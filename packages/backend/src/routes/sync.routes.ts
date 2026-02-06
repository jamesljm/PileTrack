import { Router } from "express";
import { syncController } from "../controllers/sync.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const syncLimiter = createRateLimiter("sync");

const pushSchema = z.object({
  changes: z.array(
    z.object({
      clientId: z.string().min(1).max(100),
      action: z.enum(["CREATE", "UPDATE", "DELETE"]),
      entityType: z.string().min(1).max(50),
      entityId: z.string().min(1).max(100),
      payload: z.object({}).passthrough(),
      timestamp: z.string(),
    }),
  ),
});

router.use(authenticate);
router.use(syncLimiter);

router.post(
  "/push",
  validate({ body: pushSchema }),
  syncController.push.bind(syncController),
);

router.get(
  "/pull",
  syncController.pull.bind(syncController),
);

router.get(
  "/status",
  syncController.getStatus.bind(syncController),
);

export default router;
