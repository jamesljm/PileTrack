import { z, ZodError, type ZodSchema } from "zod";

/**
 * Result of a schema validation attempt.
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

/**
 * A single field-level validation error.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates data against a Zod schema.
 *
 * Returns a discriminated union so callers can handle success and failure
 * without try/catch.
 *
 * @param schema - The Zod schema to validate against
 * @param data   - The data to validate
 * @returns A ValidationResult with either parsed data or an array of errors
 *
 * @example
 * ```ts
 * const result = validateSchema(loginSchema, req.body);
 * if (!result.success) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * // result.data is fully typed
 * ```
 */
export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return { success: false, errors };
    }
    return {
      success: false,
      errors: [{ field: "_root", message: "Unexpected validation error" }],
    };
  }
}

/**
 * Validates data against a Zod schema and throws on failure.
 * Use this when you want to let errors propagate (e.g., in middleware).
 *
 * @param schema - The Zod schema to validate against
 * @param data   - The data to validate
 * @returns The parsed and validated data
 * @throws ZodError if validation fails
 */
export function validateSchemaOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown,
): T {
  return schema.parse(data);
}

/**
 * Formats ZodError issues into a flat record mapping field paths to error messages.
 * Useful for displaying form-level errors in a UI.
 *
 * @param error - The ZodError to format
 * @returns A record mapping field paths to arrays of error messages
 */
export function formatZodErrors(
  error: ZodError,
): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_root";
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }
  return formatted;
}
