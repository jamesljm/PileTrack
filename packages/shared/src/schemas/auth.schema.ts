import { z } from "zod";

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
    ),
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
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Refresh Token ───────────────────────────────────────────────────────────

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// ─── Change Password ─────────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "New password must contain at least one uppercase letter, one lowercase letter, and one digit",
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must differ from current password",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ─── Forgot Password ────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password ─────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
