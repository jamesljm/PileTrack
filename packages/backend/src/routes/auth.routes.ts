import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const authLimiter = createRateLimiter("auth");

// Validation schemas
const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  authController.register.bind(authController),
);

router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  authController.login.bind(authController),
);

router.post(
  "/refresh-token",
  authLimiter,
  validate({ body: refreshTokenSchema }),
  authController.refreshToken.bind(authController),
);

router.post(
  "/logout",
  authenticate,
  validate({ body: refreshTokenSchema }),
  authController.logout.bind(authController),
);

router.post(
  "/change-password",
  authenticate,
  validate({ body: changePasswordSchema }),
  authController.changePassword.bind(authController),
);

router.post(
  "/forgot-password",
  authLimiter,
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword.bind(authController),
);

router.post(
  "/reset-password",
  authLimiter,
  validate({ body: resetPasswordSchema }),
  authController.resetPassword.bind(authController),
);

router.get(
  "/me",
  authenticate,
  authController.me.bind(authController),
);

export default router;
