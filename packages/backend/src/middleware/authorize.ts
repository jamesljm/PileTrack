import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";
import { ForbiddenError, UnauthorizedError } from "../utils/api-error";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`,
        ),
      );
      return;
    }

    next();
  };
}
