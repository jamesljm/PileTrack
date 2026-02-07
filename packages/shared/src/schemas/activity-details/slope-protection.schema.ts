import { z } from "zod";

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  surfacePrep: stageTimingSchema.optional(),
  installation: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

// ─── Main schema ────────────────────────────────────────────────────────────

export const slopeProtectionSchema = z.object({
  method: z.enum([
    "SHOTCRETE",
    "GABION",
    "GEOTEXTILE",
    "RIP_RAP",
    "SOIL_BIOENGINEERING",
  ]),
  chainage: z
    .string()
    .max(50, "Chainage must not exceed 50 characters")
    .trim()
    .optional(),
  length: z
    .number()
    .positive("Length must be positive")
    .max(1000, "Length must not exceed 1000m")
    .describe("Length in m"),
  height: z
    .number()
    .positive("Height must be positive")
    .max(100, "Height must not exceed 100m")
    .describe("Height in m"),
  thickness: z
    .number()
    .positive("Thickness must be positive")
    .max(5000, "Thickness must not exceed 5000mm")
    .describe("Thickness in mm")
    .optional(),
  coverArea: z
    .number()
    .positive()
    .max(100000, "Cover area must not exceed 100000 m²")
    .describe("Cover area in m²")
    .optional(),
  materials: z
    .array(z.string().min(1).max(200).trim())
    .max(20, "Maximum 20 materials")
    .optional(),
  soilNailIds: z
    .array(z.string().min(1).max(50).trim())
    .max(100, "Maximum 100 soil nail IDs")
    .optional(),
  drainageDetails: z
    .string()
    .max(1000, "Drainage details must not exceed 1000 characters")
    .trim()
    .optional(),
  surfacePrep: z
    .string()
    .max(1000, "Surface preparation must not exceed 1000 characters")
    .trim()
    .optional(),
  remarks: z
    .string()
    .max(2000, "Remarks must not exceed 2000 characters")
    .trim()
    .optional(),
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z
    .array(equipmentUsedSchema)
    .max(20, "Maximum 20 equipment entries")
    .optional(),
});

export type SlopeProtectionDetails = z.infer<typeof slopeProtectionSchema>;
