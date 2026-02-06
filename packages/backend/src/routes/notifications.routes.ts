import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  notificationsController.getNotifications.bind(notificationsController),
);

router.get(
  "/unread-count",
  notificationsController.getUnreadCount.bind(notificationsController),
);

router.patch(
  "/:id/read",
  validate({ params: idParamSchema }),
  notificationsController.markAsRead.bind(notificationsController),
);

router.post(
  "/read-all",
  notificationsController.markAllAsRead.bind(notificationsController),
);

export default router;
