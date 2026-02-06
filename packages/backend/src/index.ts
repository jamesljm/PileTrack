import { createApp } from "./app";
import { config } from "./config";
import { prisma, disconnectDatabase } from "./config/database";
import { connectRedis, disconnectRedis } from "./config/redis";
import { logger } from "./config/logger";

async function bootstrap(): Promise<void> {
  const app = createApp();

  // Connect to database
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error({ error }, "Failed to connect to database");
    process.exit(1);
  }

  // Connect to Redis (non-fatal - rate limiting will fallback to in-memory)
  try {
    await connectRedis();
  } catch (error) {
    logger.warn({ error }, "Failed to connect to Redis, rate limiting will use in-memory store");
  }

  // Start server
  const server = app.listen(config.port, () => {
    logger.info(
      {
        port: config.port,
        env: config.nodeEnv,
        apiPrefix: config.apiPrefix,
      },
      `PileTrack API server running on port ${config.port}`,
    );
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutdown signal received");

    // Stop accepting new connections
    server.close(async () => {
      logger.info("HTTP server closed");

      try {
        await disconnectDatabase();
      } catch (error) {
        logger.error({ error }, "Error disconnecting database");
      }

      try {
        await disconnectRedis();
      } catch (error) {
        logger.error({ error }, "Error disconnecting Redis");
      }

      logger.info("Graceful shutdown completed");
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error("Forced shutdown due to timeout");
      process.exit(1);
    }, 30000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error({ reason, promise }, "Unhandled rejection");
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    logger.fatal({ error }, "Uncaught exception");
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
