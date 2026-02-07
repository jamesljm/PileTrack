import { Router } from "express";
import { ncrController } from "../controllers/ncr.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { auditLog } from "../middleware/audit";
import { validate } from "../middleware/validate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const createNCRSchema = z.object({
  siteId: z.string().uuid(),
  pileId: z.string().uuid().optional(),
  ncrNumber: z.string().max(50).optional(),
  category: z.string().min(1),
  priority: z.string().optional(),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  photos: z.array(z.any()).optional(),
});

const updateNCRSchema = z.object({
  category: z.string().min(1).optional(),
  priority: z.string().optional(),
  title: z.string().min(1).max(300).optional(),
  description: z.string().min(1).max(5000).optional(),
  rootCause: z.string().max(5000).optional(),
  correctiveAction: z.string().max(5000).optional(),
  preventiveAction: z.string().max(5000).optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  photos: z.array(z.any()).optional(),
});

const resolveSchema = z.object({
  rootCause: z.string().max(5000).optional(),
  correctiveAction: z.string().max(5000).optional(),
  preventiveAction: z.string().max(5000).optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get("/", ncrController.getNCRs.bind(ncrController));

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  ncrController.getNCRById.bind(ncrController),
);

router.post(
  "/",
  auditLog("ncr"),
  validate({ body: createNCRSchema }),
  ncrController.createNCR.bind(ncrController),
);

router.patch(
  "/:id",
  auditLog("ncr"),
  validate({ params: idParamSchema, body: updateNCRSchema }),
  ncrController.updateNCR.bind(ncrController),
);

router.delete(
  "/:id",
  auditLog("ncr"),
  validate({ params: idParamSchema }),
  ncrController.deleteNCR.bind(ncrController),
);

router.post(
  "/:id/investigate",
  auditLog("ncr"),
  validate({ params: idParamSchema }),
  ncrController.investigateNCR.bind(ncrController),
);

router.post(
  "/:id/resolve",
  auditLog("ncr"),
  validate({ params: idParamSchema, body: resolveSchema }),
  ncrController.resolveNCR.bind(ncrController),
);

router.post(
  "/:id/close",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("ncr"),
  validate({ params: idParamSchema }),
  ncrController.closeNCR.bind(ncrController),
);

export default router;
