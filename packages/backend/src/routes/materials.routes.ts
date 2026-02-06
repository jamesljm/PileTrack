import { Router } from "express";
import { materialsController } from "../controllers/materials.controller";
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

const createMaterialSchema = z.object({
  siteId: z.string().uuid(),
  name: z.string().min(1).max(200).trim(),
  unit: z.string().min(1).max(50).trim(),
  currentStock: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  supplier: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
});

const updateMaterialSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  unit: z.string().min(1).max(50).trim().optional(),
  minimumStock: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  supplier: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
});

const adjustStockSchema = z.object({
  quantity: z.number(),
  reason: z.string().min(1).max(500),
  referenceType: z.string().max(50).optional(),
  referenceId: z.string().uuid().optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  materialsController.getMaterials.bind(materialsController),
);

router.get(
  "/low-stock",
  authorize("SUPERVISOR", "ADMIN"),
  materialsController.getLowStock.bind(materialsController),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  materialsController.getMaterialById.bind(materialsController),
);

router.post(
  "/",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("material"),
  validate({ body: createMaterialSchema }),
  materialsController.createMaterial.bind(materialsController),
);

router.patch(
  "/:id",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("material"),
  validate({ params: idParamSchema, body: updateMaterialSchema }),
  materialsController.updateMaterial.bind(materialsController),
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  auditLog("material"),
  validate({ params: idParamSchema }),
  materialsController.deleteMaterial.bind(materialsController),
);

router.post(
  "/:id/adjust",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("material"),
  validate({ params: idParamSchema, body: adjustStockSchema }),
  materialsController.adjustStock.bind(materialsController),
);

export default router;
