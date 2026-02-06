import Redis from "ioredis";
import { config } from "./index";
import { logger } from "./logger";

let redis: Redis;

function createRedisClient(): Redis {
  const client = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 5000);
      logger.warn({ attempt: times, delay }, "Redis reconnecting...");
      return delay;
    },
    lazyConnect: true,
  });

  client.on("connect", () => {
    logger.info("Redis connected");
  });

  client.on("ready", () => {
    logger.info("Redis ready");
  });

  client.on("error", (err) => {
    logger.error({ error: err.message }, "Redis connection error");
  });

  client.on("close", () => {
    logger.warn("Redis connection closed");
  });

  return client;
}

export function getRedis(): Redis {
  if (!redis) {
    redis = createRedisClient();
  }
  return redis;
}

export async function connectRedis(): Promise<void> {
  const client = getRedis();
  try {
    await client.connect();
  } catch (err) {
    // ioredis may already be connecting or connected via lazyConnect
    if ((err as Error).message?.includes("already")) {
      return;
    }
    throw err;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    logger.info("Redis disconnected");
  }
}
