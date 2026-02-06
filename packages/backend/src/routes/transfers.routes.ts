import { Router } from "express";
import { transfersController } from "../controllers/transfers.controller";
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

const createTransferSchema = z.object({
  fromSiteId: z.string().uuid(),
  toSiteId: z.string().uuid(),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        equipmentId: z.string().uuid().optional(),
        materialId: z.string().uuid().optional(),
        quantity: z.number().positive().optional(),
        notes: z.string().max(500).optional(),
      }),
    )
    .min(1),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  transfersController.getTransfers.bind(transfersController),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  transfersController.getTransferById.bind(transfersController),
);

router.post(
  "/",
  auditLog("transfer"),
  validate({ body: createTransferSchema }),
  transfersController.createTransfer.bind(transfersController),
);

router.post(
  "/:id/approve",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("transfer"),
  validate({ params: idParamSchema }),
  transfersController.approve.bind(transfersController),
);

router.post(
  "/:id/ship",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("transfer"),
  validate({ params: idParamSchema }),
  transfersController.ship.bind(transfersController),
);

router.post(
  "/:id/deliver",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("transfer"),
  validate({ params: idParamSchema }),
  transfersController.deliver.bind(transfersController),
);

router.post(
  "/:id/cancel",
  auditLog("transfer"),
  validate({ params: idParamSchema }),
  transfersController.cancel.bind(transfersController),
);

export default router;
