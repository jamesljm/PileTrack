import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import { ValidationError } from "../utils/api-error";

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Record<string, string>;
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Record<string, string>;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        next(new ValidationError("Validation failed", details));
        return;
      }

      next(error);
    }
  };
}
