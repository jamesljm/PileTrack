import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/api-error";
import type { UserRole } from "@prisma/client";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Authorization header is missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization format. Use: Bearer <token>");
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError("Token is missing");
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
