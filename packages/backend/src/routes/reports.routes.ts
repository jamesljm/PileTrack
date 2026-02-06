import { Router } from "express";
import { reportsController } from "../controllers/reports.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { createRateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { z } from "zod";

const router = Router();
const reportLimiter = createRateLimiter("reports");

const siteIdParamSchema = z.object({
  siteId: z.string().uuid(),
});

router.use(authenticate);
router.use(authorize("SUPERVISOR", "ADMIN"));
router.use(reportLimiter);

router.get(
  "/daily/:siteId",
  validate({ params: siteIdParamSchema }),
  reportsController.dailySummary.bind(reportsController),
);

router.get(
  "/weekly/:siteId",
  validate({ params: siteIdParamSchema }),
  reportsController.weeklySummary.bind(reportsController),
);

router.get(
  "/site/:siteId",
  validate({ params: siteIdParamSchema }),
  reportsController.siteSummary.bind(reportsController),
);

router.get(
  "/equipment-utilization",
  reportsController.equipmentUtilization.bind(reportsController),
);

router.get(
  "/export/csv/:siteId",
  validate({ params: siteIdParamSchema }),
  reportsController.exportCsv.bind(reportsController),
);

router.get(
  "/export/pdf/:siteId",
  validate({ params: siteIdParamSchema }),
  reportsController.exportPdf.bind(reportsController),
);

export default router;
