import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { createRateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { productionKPIService } from "../services/production-kpi.service";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const router = Router();
const apiLimiter = createRateLimiter("api");

const siteIdParamSchema = z.object({
  siteId: z.string().uuid(),
});

router.use(authenticate);
router.use(apiLimiter);

// GET /sites/:siteId/production
router.get(
  "/sites/:siteId/production",
  validate({ params: siteIdParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { siteId } = req.params;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      const kpis = await productionKPIService.getKPIs(siteId!, from, to);
      res.json({ data: kpis });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
