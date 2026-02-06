import { Router } from "express";
import { sitesController } from "../controllers/sites.controller";
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

const siteUserParamSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

const createSiteSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  code: z.string().min(1).max(50).trim().toUpperCase(),
  address: z.string().min(1).max(500).trim(),
  clientName: z.string().min(1).max(200).trim(),
  contractNumber: z.string().max(100).trim().optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  startDate: z.coerce.date().optional(),
  expectedEndDate: z.coerce.date().optional(),
  description: z.string().max(2000).trim().optional(),
});

const updateSiteSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  code: z.string().min(1).max(50).trim().toUpperCase().optional(),
  address: z.string().min(1).max(500).trim().optional(),
  clientName: z.string().min(1).max(200).trim().optional(),
  contractNumber: z.string().max(100).trim().nullish(),
  gpsLat: z.number().min(-90).max(90).nullish(),
  gpsLng: z.number().min(-180).max(180).nullish(),
  startDate: z.coerce.date().nullish(),
  expectedEndDate: z.coerce.date().nullish(),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED"]).optional(),
  description: z.string().max(2000).trim().nullish(),
});

const assignUserSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().min(1).max(50).optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/",
  sitesController.getSites.bind(sitesController),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  sitesController.getSiteById.bind(sitesController),
);

router.post(
  "/",
  authorize("ADMIN"),
  auditLog("site"),
  validate({ body: createSiteSchema }),
  sitesController.createSite.bind(sitesController),
);

router.patch(
  "/:id",
  authorize("ADMIN", "SUPERVISOR"),
  auditLog("site"),
  validate({ params: idParamSchema, body: updateSiteSchema }),
  sitesController.updateSite.bind(sitesController),
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  auditLog("site"),
  validate({ params: idParamSchema }),
  sitesController.deleteSite.bind(sitesController),
);

router.get(
  "/:id/users",
  validate({ params: idParamSchema }),
  sitesController.getSiteUsers.bind(sitesController),
);

router.post(
  "/:id/users",
  authorize("ADMIN", "SUPERVISOR"),
  auditLog("site_user"),
  validate({ params: idParamSchema, body: assignUserSchema }),
  sitesController.assignUser.bind(sitesController),
);

router.delete(
  "/:id/users/:userId",
  authorize("ADMIN", "SUPERVISOR"),
  auditLog("site_user"),
  validate({ params: siteUserParamSchema }),
  sitesController.removeUser.bind(sitesController),
);

router.get(
  "/:id/dashboard",
  validate({ params: idParamSchema }),
  sitesController.getDashboard.bind(sitesController),
);

export default router;
