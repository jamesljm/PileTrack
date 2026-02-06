import { z } from "zod";
import { SiteStatus } from "../enums";

// ─── Create Site ─────────────────────────────────────────────────────────────

export const createSiteSchema = z.object({
  name: z
    .string()
    .min(1, "Site name is required")
    .max(200, "Site name must not exceed 200 characters")
    .trim(),
  code: z
    .string()
    .min(1, "Site code is required")
    .max(50, "Site code must not exceed 50 characters")
    .trim()
    .toUpperCase(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must not exceed 500 characters")
    .trim(),
  clientName: z
    .string()
    .min(1, "Client name is required")
    .max(200, "Client name must not exceed 200 characters")
    .trim(),
  contractNumber: z
    .string()
    .max(100, "Contract number must not exceed 100 characters")
    .trim()
    .optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  startDate: z.coerce.date().optional(),
  expectedEndDate: z.coerce.date().optional(),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .trim()
    .optional(),
});

export type CreateSiteInput = z.infer<typeof createSiteSchema>;

// ─── Update Site ─────────────────────────────────────────────────────────────

export const updateSiteSchema = z.object({
  name: z
    .string()
    .min(1, "Site name is required")
    .max(200, "Site name must not exceed 200 characters")
    .trim()
    .optional(),
  code: z
    .string()
    .min(1, "Site code is required")
    .max(50, "Site code must not exceed 50 characters")
    .trim()
    .toUpperCase()
    .optional(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must not exceed 500 characters")
    .trim()
    .optional(),
  clientName: z
    .string()
    .min(1, "Client name is required")
    .max(200, "Client name must not exceed 200 characters")
    .trim()
    .optional(),
  contractNumber: z
    .string()
    .max(100, "Contract number must not exceed 100 characters")
    .trim()
    .nullish(),
  gpsLat: z.number().min(-90).max(90).nullish(),
  gpsLng: z.number().min(-180).max(180).nullish(),
  startDate: z.coerce.date().nullish(),
  expectedEndDate: z.coerce.date().nullish(),
  status: z.nativeEnum(SiteStatus).optional(),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .trim()
    .nullish(),
});

export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;

// ─── Site Filter ─────────────────────────────────────────────────────────────

export const siteFilterSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.nativeEnum(SiteStatus).optional(),
  clientName: z.string().max(200).optional(),
});

export type SiteFilter = z.infer<typeof siteFilterSchema>;

// ─── Assign User to Site ─────────────────────────────────────────────────────

export const assignUserToSiteSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  siteId: z.string().uuid("Invalid site ID"),
  role: z.string().min(1, "Role is required").max(50).optional(),
});

export type AssignUserToSiteInput = z.infer<typeof assignUserToSiteSchema>;
