import { Router, type Request, type Response } from "express";
import { prisma } from "../config/database";
import { getRedis } from "../config/redis";

const router = Router();

// Basic health check
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version ?? "0.1.0",
  });
});

// Readiness check (includes dependency checks)
router.get("/health/ready", async (_req: Request, res: Response) => {
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // Check database
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latency: Date.now() - dbStart };
  } catch (error) {
    checks.database = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Check Redis
  try {
    const redisStart = Date.now();
    const redis = getRedis();
    await redis.ping();
    checks.redis = { status: "ok", latency: Date.now() - redisStart };
  } catch (error) {
    checks.redis = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ready" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
  });
});

// Liveness check (simple process check)
router.get("/health/live", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    pid: process.pid,
    memory: process.memoryUsage(),
  });
});

export default router;
