export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource", details?: unknown) {
    super(`${resource} not found`, 404, "NOT_FOUND", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Insufficient permissions", details?: unknown) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists", details?: unknown) {
    super(message, 409, "CONFLICT", details);
  }
}
