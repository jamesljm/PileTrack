import type { UserRole, UserStatus } from "../enums";

/**
 * Full User entity matching the Prisma model.
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lightweight user representation for lists and references.
 */
export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
}
