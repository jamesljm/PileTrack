import { Router } from "express";
import { activitiesController } from "../controllers/activities.controller";
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

const createActivitySchema = z.object({
  siteId: z.string().uuid(),
  activityType: z.enum([
    "BORED_PILING",
    "MICROPILING",
    "DIAPHRAGM_WALL",
    "SHEET_PILING",
    "PILECAP",
    "PILE_HEAD_HACKING",
    "SOIL_NAILING",
    "GROUND_ANCHOR",
    "CAISSON_PILE",
  ]),
  activityDate: z.coerce.date(),
  weather: z.object({}).passthrough().optional(),
  details: z.object({}).passthrough(),
  remarks: z.string().max(2000).optional(),
  photos: z.array(z.string()).optional(),
  clientId: z.string().max(100).optional(),
});

const updateActivitySchema = z.object({
  activityType: z
    .enum([
      "BORED_PILING",
      "MICROPILING",
      "DIAPHRAGM_WALL",
      "SHEET_PILING",
      "PILECAP",
      "PILE_HEAD_HACKING",
      "SOIL_NAILING",
      "GROUND_ANCHOR",
      "CAISSON_PILE",
    ])
    .optional(),
  activityDate: z.coerce.date().optional(),
  weather: z.object({}).passthrough().optional(),
  details: z.object({}).passthrough().optional(),
  remarks: z.string().max(2000).optional(),
  photos: z.array(z.string()).optional(),
});

const rejectSchema = z.object({
  rejectionNotes: z.string().min(1).max(2000),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  activitiesController.getActivities.bind(activitiesController),
);

router.get(
  "/pending",
  authorize("SUPERVISOR", "ADMIN"),
  activitiesController.getPendingApprovals.bind(activitiesController),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  activitiesController.getActivityById.bind(activitiesController),
);

router.post(
  "/",
  auditLog("activity"),
  validate({ body: createActivitySchema }),
  activitiesController.createActivity.bind(activitiesController),
);

router.patch(
  "/:id",
  auditLog("activity"),
  validate({ params: idParamSchema, body: updateActivitySchema }),
  activitiesController.updateActivity.bind(activitiesController),
);

router.delete(
  "/:id",
  auditLog("activity"),
  validate({ params: idParamSchema }),
  activitiesController.deleteActivity.bind(activitiesController),
);

router.post(
  "/:id/submit",
  auditLog("activity"),
  validate({ params: idParamSchema }),
  activitiesController.submitForApproval.bind(activitiesController),
);

router.post(
  "/:id/approve",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("activity"),
  validate({ params: idParamSchema }),
  activitiesController.approve.bind(activitiesController),
);

router.post(
  "/:id/reject",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("activity"),
  validate({ params: idParamSchema, body: rejectSchema }),
  activitiesController.reject.bind(activitiesController),
);

export default router;
