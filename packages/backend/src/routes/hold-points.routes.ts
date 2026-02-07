import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit";
import { createRateLimiter } from "../middleware/rate-limiter";
import { holdPointService } from "../services/hold-point.service";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const activityIdParamSchema = z.object({
  activityId: z.string().uuid(),
});

const signSchema = z.object({
  checklist: z.array(
    z.object({
      item: z.string().min(1).max(500),
      checked: z.boolean(),
    }),
  ),
  signatureData: z.string().min(1, "Signature is required"),
  signedByName: z.string().min(1).max(200),
  comments: z.string().max(2000).optional(),
});

const rejectSchema = z.object({
  rejectionNotes: z.string().min(1).max(2000),
});

router.use(authenticate);
router.use(apiLimiter);

// Get hold points for an activity
router.get(
  "/activities/:activityId/hold-points",
  validate({ params: activityIdParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const holdPoints = await holdPointService.getByActivity(req.params.activityId!);
      res.json({ data: holdPoints });
    } catch (err) {
      next(err);
    }
  },
);

// Create hold points for an activity (auto-creates 3)
router.post(
  "/activities/:activityId/hold-points",
  auditLog("hold-point"),
  validate({ params: activityIdParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const holdPoints = await holdPointService.createForActivity(req.params.activityId!);
      res.status(201).json({ data: holdPoints });
    } catch (err) {
      next(err);
    }
  },
);

// Sign a hold point
router.post(
  "/hold-points/:id/sign",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("hold-point"),
  validate({ params: idParamSchema, body: signSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const holdPoint = await holdPointService.sign(
        req.params.id!,
        userId,
        req.body,
      );
      res.json({ data: holdPoint });
    } catch (err) {
      next(err);
    }
  },
);

// Reject a hold point
router.post(
  "/hold-points/:id/reject",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("hold-point"),
  validate({ params: idParamSchema, body: rejectSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const holdPoint = await holdPointService.reject(
        req.params.id!,
        userId,
        req.body.rejectionNotes,
      );
      res.json({ data: holdPoint });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
