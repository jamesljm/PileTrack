import { z } from "zod";
import { UserRole, UserStatus } from "../enums";

// ─── Create User ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must not exceed 100 characters")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must not exceed 100 characters")
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number format")
    .optional(),
  role: z.nativeEnum(UserRole).default(UserRole.WORKER),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ─── Update User ─────────────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must not exceed 100 characters")
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must not exceed 100 characters")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number format")
    .nullish(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ─── User Filter ─────────────────────────────────────────────────────────────

export const userFilterSchema = z.object({
  search: z.string().max(200).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  siteId: z.string().uuid().optional(),
});

export type UserFilter = z.infer<typeof userFilterSchema>;
