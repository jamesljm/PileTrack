import { Router } from "express";
import { equipmentController } from "../controllers/equipment.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";
import serviceRecordRoutes from "./service-record.routes";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const createEquipmentSchema = z.object({
  siteId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  category: z
    .enum([
      "PILING_RIG",
      "CRANE",
      "EXCAVATOR",
      "CONCRETE_PUMP",
      "GENERATOR",
      "COMPRESSOR",
      "WELDING_MACHINE",
      "SURVEYING",
      "SAFETY",
      "GENERAL",
    ])
    .optional(),
  serialNumber: z.string().max(100).optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "DECOMMISSIONED"]).optional(),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"]).optional(),
  manufacturer: z.string().max(200).optional(),
  model: z.string().max(200).optional(),
  yearManufactured: z.number().int().min(1900).max(2100).optional(),
  lastServiceDate: z.coerce.date().optional(),
  nextServiceDate: z.coerce.date().optional(),
  serviceIntervalHours: z.number().min(0).optional(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.number().min(0).optional(),
  dailyRate: z.number().min(0).optional(),
  insuranceExpiry: z.coerce.date().optional(),
  notes: z.string().max(2000).optional(),
});

const updateEquipmentSchema = createEquipmentSchema.partial().extend({
  siteId: z.string().uuid().nullish(),
  serviceIntervalHours: z.number().min(0).nullish(),
  purchaseDate: z.coerce.date().nullish(),
  purchasePrice: z.number().min(0).nullish(),
  dailyRate: z.number().min(0).nullish(),
  insuranceExpiry: z.coerce.date().nullish(),
});

const scanQrSchema = z.object({
  qrCode: z.string().min(1),
});

const logServiceSchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(1).max(2000),
  performedBy: z.string().min(1).max(200),
  cost: z.number().min(0).optional(),
  nextServiceDate: z.coerce.date().optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  equipmentController.getEquipment.bind(equipmentController),
);

router.get(
  "/fleet-stats",
  authorize("SUPERVISOR", "ADMIN"),
  equipmentController.getFleetStats.bind(equipmentController),
);

router.get(
  "/service-due",
  authorize("SUPERVISOR", "ADMIN"),
  equipmentController.getServiceDue.bind(equipmentController),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  equipmentController.getEquipmentById.bind(equipmentController),
);

router.post(
  "/",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("equipment"),
  validate({ body: createEquipmentSchema }),
  equipmentController.createEquipment.bind(equipmentController),
);

router.patch(
  "/:id",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("equipment"),
  validate({ params: idParamSchema, body: updateEquipmentSchema }),
  equipmentController.updateEquipment.bind(equipmentController),
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  auditLog("equipment"),
  validate({ params: idParamSchema }),
  equipmentController.deleteEquipment.bind(equipmentController),
);

router.get(
  "/:id/qr",
  validate({ params: idParamSchema }),
  equipmentController.generateQR.bind(equipmentController),
);

router.post(
  "/scan",
  validate({ body: scanQrSchema }),
  equipmentController.scanQR.bind(equipmentController),
);

router.post(
  "/:id/service",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("equipment"),
  validate({ params: idParamSchema, body: logServiceSchema }),
  equipmentController.logService.bind(equipmentController),
);

router.get(
  "/:id/history",
  validate({ params: idParamSchema }),
  equipmentController.getHistory.bind(equipmentController),
);

// ─── Usage & Stats Routes ─────────────────────────────────────────────────
router.get(
  "/:id/usage",
  validate({ params: idParamSchema }),
  equipmentController.getUsage.bind(equipmentController),
);

router.get(
  "/:id/usage/summary",
  validate({ params: idParamSchema }),
  equipmentController.getUsageSummary.bind(equipmentController),
);

router.get(
  "/:id/stats",
  validate({ params: idParamSchema }),
  equipmentController.getStats.bind(equipmentController),
);

router.get(
  "/:id/site-history",
  validate({ params: idParamSchema }),
  equipmentController.getSiteHistory.bind(equipmentController),
);

// ─── Service Record Sub-Routes ────────────────────────────────────────────
router.use("/:id/service-records", serviceRecordRoutes);

export default router;
