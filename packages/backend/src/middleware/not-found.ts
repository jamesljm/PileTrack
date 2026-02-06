import type { Request, Response, _NextFunction } from "express";
import type { ApiErrorResponse } from "../types";

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
    requestId: req.requestId,
  };

  res.status(404).json(response);
}
