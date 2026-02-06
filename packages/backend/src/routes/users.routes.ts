import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const createUserSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional(),
  role: z.enum(["WORKER", "SUPERVISOR", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).trim().optional(),
  lastName: z.string().min(1).max(100).trim().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/).nullish(),
  role: z.enum(["WORKER", "SUPERVISOR", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

const bulkCreateSchema = z.object({
  users: z.array(createUserSchema).min(1).max(100),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  authorize("ADMIN", "SUPERVISOR"),
  usersController.getUsers.bind(usersController),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  usersController.getUserById.bind(usersController),
);

router.post(
  "/",
  authorize("ADMIN"),
  auditLog("user"),
  validate({ body: createUserSchema }),
  usersController.createUser.bind(usersController),
);

router.patch(
  "/:id",
  authorize("ADMIN"),
  auditLog("user"),
  validate({ params: idParamSchema, body: updateUserSchema }),
  usersController.updateUser.bind(usersController),
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  auditLog("user"),
  validate({ params: idParamSchema }),
  usersController.deleteUser.bind(usersController),
);

router.get(
  "/:id/sites",
  validate({ params: idParamSchema }),
  usersController.getUserSites.bind(usersController),
);

router.post(
  "/bulk",
  authorize("ADMIN"),
  auditLog("user"),
  validate({ body: bulkCreateSchema }),
  usersController.bulkCreate.bind(usersController),
);

export default router;
