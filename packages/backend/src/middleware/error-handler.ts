import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/api-error";
import { logger } from "../config/logger";
import type { ApiErrorResponse } from "../types";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId;

  // Handle AppError (our custom errors)
  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      requestId,
    };

    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, "Server error");
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));

    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
      requestId,
    };

    res.status(400).json(response);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = 500;
    let code = "DATABASE_ERROR";
    let message = "A database error occurred";

    switch (err.code) {
      case "P2002": {
        statusCode = 409;
        code = "CONFLICT";
        const target = (err.meta?.target as string[])?.join(", ") ?? "field";
        message = `A record with this ${target} already exists`;
        break;
      }
      case "P2003": {
        statusCode = 400;
        code = "FOREIGN_KEY_VIOLATION";
        message = "Referenced record does not exist";
        break;
      }
      case "P2025": {
        statusCode = 404;
        code = "NOT_FOUND";
        message = "Record not found";
        break;
      }
      default:
        logger.error({ err, prismaCode: err.code, requestId }, "Unhandled Prisma error");
    }

    const response: ApiErrorResponse = {
      success: false,
      error: { code, message },
      requestId,
    };

    res.status(statusCode).json(response);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error({ err, requestId }, "Prisma validation error");

    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid data provided",
      },
      requestId,
    };

    res.status(400).json(response);
    return;
  }

  // Handle CORS errors
  if (err.message?.includes("CORS")) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: "CORS_ERROR",
        message: err.message,
      },
      requestId,
    };

    res.status(403).json(response);
    return;
  }

  // Unhandled errors
  logger.error({ err, requestId, stack: err.stack }, "Unhandled error");

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : err.message || "An unexpected error occurred",
    },
    requestId,
  };

  res.status(500).json(response);
}
