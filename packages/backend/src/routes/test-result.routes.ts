import { Router } from "express";
import { testResultController } from "../controllers/test-result.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit";
import { createRateLimiter } from "../middleware/rate-limiter";
import { z } from "zod";

const router = Router();
const apiLimiter = createRateLimiter("api");

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const createTestResultSchema = z.object({
  siteId: z.string().uuid(),
  activityId: z.string().uuid().optional(),
  testType: z.enum([
    "PIT",
    "STATIC_LOAD_TEST",
    "DYNAMIC_LOAD_TEST",
    "CUBE_TEST",
    "CORE_TEST",
    "KODEN",
    "CROSSHOLE_SONIC",
  ]),
  testDate: z.string().min(1),
  pileId: z.string().max(50).optional(),
  status: z.enum(["PENDING", "PASS", "FAIL", "INCONCLUSIVE"]).optional(),
  results: z.object({}).passthrough().optional(),
  remarks: z.string().max(5000).optional(),
  photos: z.array(z.string()).optional(),
  conductedBy: z.string().max(200).optional(),
});

const updateTestResultSchema = z.object({
  activityId: z.string().uuid().nullable().optional(),
  testType: z.enum([
    "PIT",
    "STATIC_LOAD_TEST",
    "DYNAMIC_LOAD_TEST",
    "CUBE_TEST",
    "CORE_TEST",
    "KODEN",
    "CROSSHOLE_SONIC",
  ]).optional(),
  testDate: z.string().min(1).optional(),
  pileId: z.string().max(50).optional(),
  status: z.enum(["PENDING", "PASS", "FAIL", "INCONCLUSIVE"]).optional(),
  results: z.object({}).passthrough().optional(),
  remarks: z.string().max(5000).optional(),
  photos: z.array(z.string()).optional(),
  conductedBy: z.string().max(200).optional(),
});

router.use(authenticate);
router.use(apiLimiter);

router.get("/", testResultController.getTestResults.bind(testResultController));

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  testResultController.getTestResultById.bind(testResultController),
);

router.post(
  "/",
  auditLog("test-result"),
  validate({ body: createTestResultSchema }),
  testResultController.createTestResult.bind(testResultController),
);

router.patch(
  "/:id",
  auditLog("test-result"),
  validate({ params: idParamSchema, body: updateTestResultSchema }),
  testResultController.updateTestResult.bind(testResultController),
);

router.delete(
  "/:id",
  auditLog("test-result"),
  validate({ params: idParamSchema }),
  testResultController.deleteTestResult.bind(testResultController),
);

export default router;
