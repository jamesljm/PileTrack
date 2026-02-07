import { Router } from "express";
import { boreholeLogController } from "../controllers/borehole-log.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const createBoreholeLogSchema = z.object({
  siteId: z.string().uuid(),
  boreholeId: z.string().min(1).max(50),
  logDate: z.string().min(1),
  location: z.string().max(200).optional(),
  gpsLat: z.number().optional(),
  gpsLng: z.number().optional(),
  totalDepth: z.number().positive(),
  groundLevel: z.number().optional(),
  groundwaterLevel: z.number().optional(),
  casingDepth: z.number().optional(),
  strata: z.array(z.object({}).passthrough()).optional(),
  sptResults: z.array(z.object({}).passthrough()).optional(),
  remarks: z.string().max(5000).optional(),
  photos: z.array(z.string()).optional(),
  drillingMethod: z.string().max(100).optional(),
  contractor: z.string().max(200).optional(),
  loggedBy: z.string().max(200).optional(),
});

const updateBoreholeLogSchema = z.object({
  boreholeId: z.string().min(1).max(50).optional(),
  logDate: z.string().min(1).optional(),
  location: z.string().max(200).optional(),
  gpsLat: z.number().optional(),
  gpsLng: z.number().optional(),
  totalDepth: z.number().positive().optional(),
  groundLevel: z.number().optional(),
  groundwaterLevel: z.number().optional(),
  casingDepth: z.number().optional(),
  strata: z.array(z.object({}).passthrough()).optional(),
  sptResults: z.array(z.object({}).passthrough()).optional(),
  remarks: z.string().max(5000).optional(),
  photos: z.array(z.string()).optional(),
  drillingMethod: z.string().max(100).optional(),
  contractor: z.string().max(200).optional(),
  loggedBy: z.string().max(200).optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get("/", boreholeLogController.getBoreholeLogs.bind(boreholeLogController));

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  boreholeLogController.getBoreholeLogById.bind(boreholeLogController),
);

router.post(
  "/",
  auditLog("borehole-log"),
  validate({ body: createBoreholeLogSchema }),
  boreholeLogController.createBoreholeLog.bind(boreholeLogController),
);

router.patch(
  "/:id",
  auditLog("borehole-log"),
  validate({ params: idParamSchema, body: updateBoreholeLogSchema }),
  boreholeLogController.updateBoreholeLog.bind(boreholeLogController),
);

router.delete(
  "/:id",
  auditLog("borehole-log"),
  validate({ params: idParamSchema }),
  boreholeLogController.deleteBoreholeLog.bind(boreholeLogController),
);

export default router;
