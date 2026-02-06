import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database";
import { userRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/api-error";
import type { TokenPair, JwtPayload } from "../types";
import { logger } from "../config/logger";

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

class AuthService {
  async register(input: RegisterInput): Promise<{ user: Record<string, unknown>; tokens: TokenPair }> {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("A user with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(jwtPayload);
    const refreshToken = signRefreshToken(jwtPayload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    logger.info({ userId: user.id }, "User registered");

    return {
      user,
      tokens: { accessToken, refreshToken },
    };
  }

  async login(input: LoginInput): Promise<{ user: Record<string, unknown>; tokens: TokenPair }> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Account is not active. Please contact an administrator.");
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(jwtPayload);
    const refreshToken = signRefreshToken(jwtPayload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await userRepository.updateLastLogin(user.id);

    logger.info({ userId: user.id }, "User logged in");

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        lastLoginAt: new Date(),
      },
      tokens: { accessToken, refreshToken },
    };
  }

  async refreshTokens(currentRefreshToken: string): Promise<TokenPair> {
    // Verify the token signature
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(currentRefreshToken);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Check if token exists and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: currentRefreshToken },
    });

    if (!storedToken || storedToken.revokedAt) {
      // Possible token reuse attack - revoke all tokens for this user
      if (storedToken?.revokedAt) {
        await prisma.refreshToken.updateMany({
          where: { userId: storedToken.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        logger.warn({ userId: storedToken.userId }, "Refresh token reuse detected, all tokens revoked");
      }
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Refresh token has expired");
    }

    // Revoke the current token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Fetch fresh user data
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.status !== "ACTIVE" || user.deletedAt) {
      throw new UnauthorizedError("User account is no longer active");
    }

    const newPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    // Store the new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User");
    }

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new ValidationError("Current password is incorrect");
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    logger.info({ userId }, "Password changed, all tokens revoked");
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await userRepository.findByEmail(email);

    // Always return success to prevent user enumeration
    if (!user) {
      return { message: "If the email exists, a reset link will be sent" };
    }

    const resetToken = uuidv4();
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    // In production, send an email with the reset token
    logger.info({ userId: user.id, resetToken }, "Password reset token generated");

    return { message: "If the email exists, a reset link will be sent" };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      throw new ValidationError("Invalid or expired reset token");
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    logger.info({ userId: user.id }, "Password reset completed");
  }
}

export const authService = new AuthService();
