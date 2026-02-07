import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/authenticate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const siteIdParamSchema = z.object({
  siteId: z.string().uuid(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get(
  "/:siteId",
  validate({ params: siteIdParamSchema }),
  dashboardController.getSiteDashboard.bind(dashboardController),
);

export default router;
