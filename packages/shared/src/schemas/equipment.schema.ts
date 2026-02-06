import { z } from "zod";
import { EquipmentCategory, EquipmentStatus } from "../enums";

// ─── Create Equipment ────────────────────────────────────────────────────────

export const createEquipmentSchema = z.object({
  name: z
    .string()
    .min(1, "Equipment name is required")
    .max(200, "Equipment name must not exceed 200 characters")
    .trim(),
  code: z
    .string()
    .min(1, "Equipment code is required")
    .max(50, "Equipment code must not exceed 50 characters")
    .trim()
    .toUpperCase(),
  category: z.nativeEnum(EquipmentCategory),
  siteId: z.string().uuid("Invalid site ID").optional(),
  serialNumber: z
    .string()
    .max(100, "Serial number must not exceed 100 characters")
    .trim()
    .optional(),
  manufacturer: z
    .string()
    .max(200, "Manufacturer must not exceed 200 characters")
    .trim()
    .optional(),
  model: z
    .string()
    .max(200, "Model must not exceed 200 characters")
    .trim()
    .optional(),
  yearOfManufacture: z
    .number()
    .int("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must not exceed 2100")
    .optional(),
  lastServiceDate: z.coerce.date().optional(),
  nextServiceDate: z.coerce.date().optional(),
  notes: z
    .string()
    .max(2000, "Notes must not exceed 2000 characters")
    .trim()
    .optional(),
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;

// ─── Update Equipment ────────────────────────────────────────────────────────

export const updateEquipmentSchema = z.object({
  name: z
    .string()
    .min(1, "Equipment name is required")
    .max(200, "Equipment name must not exceed 200 characters")
    .trim()
    .optional(),
  code: z
    .string()
    .min(1, "Equipment code is required")
    .max(50, "Equipment code must not exceed 50 characters")
    .trim()
    .toUpperCase()
    .optional(),
  category: z.nativeEnum(EquipmentCategory).optional(),
  status: z.nativeEnum(EquipmentStatus).optional(),
  siteId: z.string().uuid("Invalid site ID").nullish(),
  serialNumber: z
    .string()
    .max(100, "Serial number must not exceed 100 characters")
    .trim()
    .nullish(),
  manufacturer: z
    .string()
    .max(200, "Manufacturer must not exceed 200 characters")
    .trim()
    .nullish(),
  model: z
    .string()
    .max(200, "Model must not exceed 200 characters")
    .trim()
    .nullish(),
  yearOfManufacture: z
    .number()
    .int("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must not exceed 2100")
    .nullish(),
  lastServiceDate: z.coerce.date().nullish(),
  nextServiceDate: z.coerce.date().nullish(),
  notes: z
    .string()
    .max(2000, "Notes must not exceed 2000 characters")
    .trim()
    .nullish(),
});

export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;

// ─── Equipment Filter ────────────────────────────────────────────────────────

export const equipmentFilterSchema = z.object({
  search: z.string().max(200).optional(),
  category: z.nativeEnum(EquipmentCategory).optional(),
  status: z.nativeEnum(EquipmentStatus).optional(),
  siteId: z.string().uuid().optional(),
});

export type EquipmentFilter = z.infer<typeof equipmentFilterSchema>;
