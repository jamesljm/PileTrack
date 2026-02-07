import { z } from "zod";
import { ServiceType } from "../enums";

// ─── Create Service Record ──────────────────────────────────────────────────

export const createServiceRecordSchema = z.object({
  serviceType: z.nativeEnum(ServiceType),
  serviceDate: z.coerce.date(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  performedBy: z
    .string()
    .min(1, "Performed by is required")
    .max(200, "Performed by must not exceed 200 characters")
    .trim(),
  cost: z.number().min(0, "Cost must be non-negative").optional(),
  partsReplaced: z
    .string()
    .max(2000, "Parts replaced must not exceed 2000 characters")
    .trim()
    .optional(),
  nextServiceDate: z.coerce.date().optional(),
  meterReading: z.number().min(0, "Meter reading must be non-negative").optional(),
  notes: z
    .string()
    .max(2000, "Notes must not exceed 2000 characters")
    .trim()
    .optional(),
});

export type CreateServiceRecordInput = z.infer<typeof createServiceRecordSchema>;

// ─── Update Service Record ──────────────────────────────────────────────────

export const updateServiceRecordSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).optional(),
  serviceDate: z.coerce.date().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must not exceed 2000 characters")
    .trim()
    .optional(),
  performedBy: z
    .string()
    .min(1, "Performed by is required")
    .max(200, "Performed by must not exceed 200 characters")
    .trim()
    .optional(),
  cost: z.number().min(0, "Cost must be non-negative").nullish(),
  partsReplaced: z
    .string()
    .max(2000, "Parts replaced must not exceed 2000 characters")
    .trim()
    .nullish(),
  nextServiceDate: z.coerce.date().nullish(),
  meterReading: z.number().min(0, "Meter reading must be non-negative").nullish(),
  notes: z
    .string()
    .max(2000, "Notes must not exceed 2000 characters")
    .trim()
    .nullish(),
});

export type UpdateServiceRecordInput = z.infer<typeof updateServiceRecordSchema>;

// ─── Service Record Filter ─────────────────────────────────────────────────

export const serviceRecordFilterSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ServiceRecordFilter = z.infer<typeof serviceRecordFilterSchema>;
