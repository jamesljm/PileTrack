import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedis } from "../config/redis";
import { rateLimitTiers, type RateLimitTier } from "../config/rate-limit";
import { config } from "../config";

export function createRateLimiter(tier: string) {
  const tierConfig: RateLimitTier = rateLimitTiers[tier] ?? rateLimitTiers.api!;

  if (!config.rateLimit.enabled) {
    // Return a pass-through middleware when rate limiting is disabled
    return rateLimit({
      windowMs: tierConfig.windowMs,
      max: 999999,
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  let store: RedisStore | undefined;

  try {
    const redis = getRedis();
    store = new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...(args as [string, ...string[]])) as never,
      prefix: `rl:${tier}:`,
    });
  } catch {
    // Fall back to in-memory store if Redis is unavailable
  }

  return rateLimit({
    windowMs: tierConfig.windowMs,
    max: tierConfig.max,
    message: {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: tierConfig.message,
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...(store ? { store } : {}),
    keyGenerator: (req) => {
      return req.user?.id ?? req.ip ?? "unknown";
    },
  });
}
