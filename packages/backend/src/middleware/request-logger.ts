import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id ?? "anonymous",
      requestId: req.requestId,
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error(logData, "Request completed with server error");
    } else if (res.statusCode >= 400) {
      logger.warn(logData, "Request completed with client error");
    } else {
      logger.info(logData, "Request completed");
    }
  });

  next();
}
