import { Router } from "express";
import { concreteDeliveryController } from "../controllers/concrete-delivery.controller";
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

const createCDSchema = z.object({
  siteId: z.string().uuid(),
  pileId: z.string().uuid().optional(),
  doNumber: z.string().min(1).max(50),
  deliveryDate: z.string().min(1),
  supplier: z.string().min(1).max(200),
  batchPlant: z.string().max(200).optional(),
  truckNumber: z.string().max(50).optional(),
  concreteGrade: z.string().min(1).max(20),
  volume: z.number().positive(),
  slumpRequired: z.number().min(0).optional(),
  slumpActual: z.number().min(0).optional(),
  batchTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  pourStartTime: z.string().optional(),
  pourEndTime: z.string().optional(),
  temperature: z.number().optional(),
  cubesTaken: z.number().int().min(0).optional(),
  cubeSampleIds: z.array(z.any()).optional(),
  rejected: z.boolean().optional(),
  rejectionReason: z.string().max(2000).optional(),
  remarks: z.string().max(5000).optional(),
});

const updateCDSchema = z.object({
  pileId: z.string().uuid().nullable().optional(),
  doNumber: z.string().min(1).max(50).optional(),
  deliveryDate: z.string().optional(),
  supplier: z.string().min(1).max(200).optional(),
  batchPlant: z.string().max(200).optional(),
  truckNumber: z.string().max(50).optional(),
  concreteGrade: z.string().min(1).max(20).optional(),
  volume: z.number().positive().optional(),
  slumpRequired: z.number().min(0).optional(),
  slumpActual: z.number().min(0).optional(),
  batchTime: z.string().nullable().optional(),
  arrivalTime: z.string().nullable().optional(),
  pourStartTime: z.string().nullable().optional(),
  pourEndTime: z.string().nullable().optional(),
  temperature: z.number().optional(),
  cubesTaken: z.number().int().min(0).optional(),
  cubeSampleIds: z.array(z.any()).optional(),
  rejected: z.boolean().optional(),
  rejectionReason: z.string().max(2000).nullable().optional(),
  remarks: z.string().max(5000).optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get("/", concreteDeliveryController.getConcreteDeliveries.bind(concreteDeliveryController));

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  concreteDeliveryController.getConcreteDeliveryById.bind(concreteDeliveryController),
);

router.post(
  "/",
  auditLog("concrete-delivery"),
  validate({ body: createCDSchema }),
  concreteDeliveryController.createConcreteDelivery.bind(concreteDeliveryController),
);

router.patch(
  "/:id",
  auditLog("concrete-delivery"),
  validate({ params: idParamSchema, body: updateCDSchema }),
  concreteDeliveryController.updateConcreteDelivery.bind(concreteDeliveryController),
);

router.delete(
  "/:id",
  auditLog("concrete-delivery"),
  validate({ params: idParamSchema }),
  concreteDeliveryController.deleteConcreteDelivery.bind(concreteDeliveryController),
);

export default router;
