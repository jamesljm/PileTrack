import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { corsOptions } from "./config/cors";
import { logger } from "./config/logger";
import { requestIdMiddleware } from "./middleware/request-id";
import { requestLogger } from "./middleware/request-logger";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import { config } from "./config";
import healthRoutes from "./routes/health.routes";
import apiRoutes from "./routes/index";

export function createApp(): express.Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors(corsOptions));

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request ID
  app.use(requestIdMiddleware);

  // Pino HTTP logging
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => {
          // Don't log health checks
          return (req.url ?? "").startsWith("/health");
        },
      },
      customSuccessMessage: () => "Request completed",
      customErrorMessage: () => "Request failed",
      customProps: (req) => ({
        requestId: (req as express.Request).requestId,
      }),
    }),
  );

  // Request logger (custom, with userId)
  app.use(requestLogger);

  // Health routes (no auth required, outside /api/v1 prefix)
  app.use(healthRoutes);

  // API routes
  app.use(config.apiPrefix, apiRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
