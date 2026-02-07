import { Router } from "express";
import { dailyLogController } from "../controllers/daily-log.controller";
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

const createDailyLogSchema = z.object({
  siteId: z.string().uuid(),
  logDate: z.string().min(1),
  workforce: z.array(z.object({}).passthrough()).optional(),
  safety: z.object({}).passthrough().optional(),
  delays: z.array(z.object({}).passthrough()).optional(),
  materialUsage: z.array(z.object({}).passthrough()).optional(),
  weather: z.object({}).passthrough().optional(),
  remarks: z.string().max(5000).optional(),
  photos: z.array(z.string()).optional(),
});

const updateDailyLogSchema = z.object({
  workforce: z.array(z.object({}).passthrough()).optional(),
  safety: z.object({}).passthrough().optional(),
  delays: z.array(z.object({}).passthrough()).optional(),
  materialUsage: z.array(z.object({}).passthrough()).optional(),
  weather: z.object({}).passthrough().optional(),
  remarks: z.string().max(5000).optional(),
  photos: z.array(z.string()).optional(),
});

const rejectSchema = z.object({
  rejectionNotes: z.string().min(1).max(2000),
});

router.use(authenticate);
router.use(apiLimiter);

router.get("/", dailyLogController.getDailyLogs.bind(dailyLogController));

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  dailyLogController.getDailyLogById.bind(dailyLogController),
);

router.post(
  "/",
  auditLog("daily-log"),
  validate({ body: createDailyLogSchema }),
  dailyLogController.createDailyLog.bind(dailyLogController),
);

router.patch(
  "/:id",
  auditLog("daily-log"),
  validate({ params: idParamSchema, body: updateDailyLogSchema }),
  dailyLogController.updateDailyLog.bind(dailyLogController),
);

router.delete(
  "/:id",
  auditLog("daily-log"),
  validate({ params: idParamSchema }),
  dailyLogController.deleteDailyLog.bind(dailyLogController),
);

router.post(
  "/:id/submit",
  auditLog("daily-log"),
  validate({ params: idParamSchema }),
  dailyLogController.submitDailyLog.bind(dailyLogController),
);

router.post(
  "/:id/approve",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("daily-log"),
  validate({ params: idParamSchema }),
  dailyLogController.approveDailyLog.bind(dailyLogController),
);

router.post(
  "/:id/reject",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("daily-log"),
  validate({ params: idParamSchema, body: rejectSchema }),
  dailyLogController.rejectDailyLog.bind(dailyLogController),
);

export default router;
