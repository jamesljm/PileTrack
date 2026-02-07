import { Router } from "express";
import { pileController } from "../controllers/pile.controller";
import { authenticate } from "../middleware/authenticate";
import { auditLog } from "../middleware/audit";
import { validate } from "../middleware/validate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const createPileSchema = z.object({
  siteId: z.string().uuid(),
  pileId: z.string().min(1).max(50),
  pileType: z.string().min(1),
  designLength: z.number().positive().optional(),
  designDiameter: z.number().positive().optional(),
  cutOffLevel: z.number().optional(),
  platformLevel: z.number().optional(),
  gridRef: z.string().max(50).optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  concreteGrade: z.string().max(20).optional(),
  concreteVolume: z.number().positive().optional(),
  remarks: z.string().max(5000).optional(),
});

const updatePileSchema = z.object({
  pileId: z.string().min(1).max(50).optional(),
  pileType: z.string().min(1).optional(),
  designLength: z.number().positive().optional(),
  actualLength: z.number().positive().optional(),
  designDiameter: z.number().positive().optional(),
  cutOffLevel: z.number().optional(),
  platformLevel: z.number().optional(),
  gridRef: z.string().max(50).optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  concreteGrade: z.string().max(20).optional(),
  concreteVolume: z.number().positive().optional(),
  actualConcreteVol: z.number().positive().optional(),
  overconsumption: z.number().optional(),
  remarks: z.string().max(5000).optional(),
});

const updateStatusSchema = z.object({
  status: z.string().min(1),
});

router.use(authenticate);
router.use(apiLimiter);

router.get("/", pileController.getPiles.bind(pileController));

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  pileController.getPileById.bind(pileController),
);

router.post(
  "/",
  auditLog("pile"),
  validate({ body: createPileSchema }),
  pileController.createPile.bind(pileController),
);

router.patch(
  "/:id",
  auditLog("pile"),
  validate({ params: idParamSchema, body: updatePileSchema }),
  pileController.updatePile.bind(pileController),
);

router.delete(
  "/:id",
  auditLog("pile"),
  validate({ params: idParamSchema }),
  pileController.deletePile.bind(pileController),
);

router.patch(
  "/:id/status",
  auditLog("pile"),
  validate({ params: idParamSchema, body: updateStatusSchema }),
  pileController.updatePileStatus.bind(pileController),
);

export default router;
