import { z } from "zod";

// ─── Create Material ─────────────────────────────────────────────────────────

export const createMaterialSchema = z.object({
  name: z
    .string()
    .min(1, "Material name is required")
    .max(200, "Material name must not exceed 200 characters")
    .trim(),
  code: z
    .string()
    .min(1, "Material code is required")
    .max(50, "Material code must not exceed 50 characters")
    .trim()
    .toUpperCase(),
  unit: z
    .string()
    .min(1, "Unit is required")
    .max(20, "Unit must not exceed 20 characters")
    .trim(),
  siteId: z.string().uuid("Invalid site ID"),
  currentStock: z
    .number()
    .min(0, "Current stock must be non-negative")
    .default(0),
  minimumStock: z
    .number()
    .min(0, "Minimum stock must be non-negative")
    .default(0),
  category: z
    .string()
    .max(100, "Category must not exceed 100 characters")
    .trim()
    .optional(),
  supplier: z
    .string()
    .max(200, "Supplier must not exceed 200 characters")
    .trim()
    .optional(),
  unitPrice: z
    .number()
    .min(0, "Unit price must be non-negative")
    .optional(),
  notes: z
    .string()
    .max(2000, "Notes must not exceed 2000 characters")
    .trim()
    .optional(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;

// ─── Update Material ─────────────────────────────────────────────────────────

export const updateMaterialSchema = z.object({
  name: z
    .string()
    .min(1, "Material name is required")
    .max(200, "Material name must not exceed 200 characters")
    .trim()
    .optional(),
  code: z
    .string()
    .min(1, "Material code is required")
    .max(50, "Material code must not exceed 50 characters")
    .trim()
    .toUpperCase()
    .optional(),
  unit: z
    .string()
    .min(1, "Unit is required")
    .max(20, "Unit must not exceed 20 characters")
    .trim()
    .optional(),
  minimumStock: z
    .number()
    .min(0, "Minimum stock must be non-negative")
    .optional(),
  category: z
    .string()
    .max(100, "Category must not exceed 100 characters")
    .trim()
    .nullish(),
  supplier: z
    .string()
    .max(200, "Supplier must not exceed 200 characters")
    .trim()
    .nullish(),
  unitPrice: z
    .number()
    .min(0, "Unit price must be non-negative")
    .nullish(),
  notes: z
    .string()
    .max(2000, "Notes must not exceed 2000 characters")
    .trim()
    .nullish(),
});

export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;

// ─── Adjust Stock ────────────────────────────────────────────────────────────

export const adjustStockSchema = z.object({
  adjustment: z
    .number()
    .refine((val) => val !== 0, "Adjustment must not be zero")
    .describe("Positive for addition, negative for consumption"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must not exceed 500 characters")
    .trim(),
});

export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
