import { prisma } from "../config/database";
import { userRepository } from "../repositories/user.repository";
import { hashPassword } from "../utils/hash";
import { NotFoundError, ConflictError } from "../utils/api-error";
import type { User, UserRole, UserStatus } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  role?: UserRole;
  status?: UserStatus;
}

class UserService {
  async getUsers(
    filter: {
      search?: string;
      role?: string;
      status?: string;
      siteId?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: User[]; total: number }> {
    return userRepository.findAllFiltered(filter, pagination);
  }

  async getUserById(id: string): Promise<User> {
    const user = await userRepository.findByIdWithSites(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
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
        role: input.role ?? "WORKER",
        status: input.status ?? "ACTIVE",
      },
    });

    logger.info({ userId: user.id }, "User created");
    return user;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("User");
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
        ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
    });

    logger.info({ userId: user.id }, "User updated");
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("User");
    }

    await userRepository.softDelete(id);
    logger.info({ userId: id }, "User soft-deleted");
  }

  async getUserSites(userId: string): Promise<unknown[]> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    const siteUsers = await prisma.siteUser.findMany({
      where: { userId },
      include: {
        site: true,
      },
    });

    return siteUsers.map((su) => ({
      ...su.site,
      siteRole: su.siteRole,
      assignedAt: su.assignedAt,
    }));
  }

  async bulkCreate(
    users: CreateUserInput[],
  ): Promise<{ created: number; errors: { email: string; error: string }[] }> {
    const results = { created: 0, errors: [] as { email: string; error: string }[] };

    for (const input of users) {
      try {
        const existing = await userRepository.findByEmail(input.email);
        if (existing) {
          results.errors.push({ email: input.email, error: "Email already exists" });
          continue;
        }

        const passwordHash = await hashPassword(input.password);
        await prisma.user.create({
          data: {
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            role: input.role ?? "WORKER",
            status: input.status ?? "ACTIVE",
          },
        });

        results.created++;
      } catch (error) {
        results.errors.push({
          email: input.email,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    logger.info({ created: results.created, errors: results.errors.length }, "Bulk user creation completed");
    return results;
  }
}

export const userService = new UserService();
