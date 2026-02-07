import { z } from "zod";

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const drivingLogEntrySchema = z.object({
  depth: z.number().min(0).max(100).describe("Depth in m"),
  blowCount: z.number().int().min(0).max(10000).describe("Blow count at depth"),
  set: z.number().min(0).max(1000).describe("Set in mm/10 blows"),
});

const penetrationEntrySchema = z.number().min(0).max(1000).describe("Penetration per blow in mm");

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  driving: stageTimingSchema.optional(),
  welding: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

// ─── Main schema ────────────────────────────────────────────────────────────

export const drivenPilingSchema = z.object({
  pileId: z
    .string()
    .min(1, "Pile ID is required")
    .max(50, "Pile ID must not exceed 50 characters")
    .trim(),
  hammerType: z
    .string()
    .min(1, "Hammer type is required")
    .max(100, "Hammer type must not exceed 100 characters")
    .trim(),
  hammerWeight: z
    .number()
    .positive("Hammer weight must be positive")
    .max(50, "Hammer weight must not exceed 50 tonnes")
    .describe("Hammer weight in tonnes"),
  dropHeight: z
    .number()
    .positive("Drop height must be positive")
    .max(5, "Drop height must not exceed 5m")
    .describe("Drop height in m"),
  finalSet: z
    .number()
    .min(0, "Final set must be non-negative")
    .max(1000, "Final set must not exceed 1000mm")
    .describe("Final set in mm/10 blows"),
  totalBlowCount: z
    .number()
    .int("Total blow count must be a whole number")
    .min(0)
    .max(100000)
    .describe("Total number of blows"),
  penetrationPerBlow: z
    .array(penetrationEntrySchema)
    .max(1000, "Maximum 1000 entries")
    .optional(),
  rebound: z
    .array(z.number().min(0).max(1000))
    .max(1000, "Maximum 1000 entries")
    .optional(),
  designLength: z
    .number()
    .positive("Design length must be positive")
    .max(100, "Design length must not exceed 100m")
    .describe("Design length in m"),
  actualLength: z
    .number()
    .positive("Actual length must be positive")
    .max(100, "Actual length must not exceed 100m")
    .describe("Actual length in m")
    .optional(),
  cutOffLevel: z
    .number()
    .describe("Cut-off level in mPD")
    .optional(),
  platformLevel: z
    .number()
    .describe("Platform level in mPD")
    .optional(),
  pileType: z.enum(["PRECAST", "STEEL_H", "STEEL_PIPE"]).describe("Type of driven pile"),
  pileSection: z
    .string()
    .min(1, "Pile section is required")
    .max(100, "Pile section must not exceed 100 characters")
    .trim(),
  concreteGrade: z
    .string()
    .max(20, "Concrete grade must not exceed 20 characters")
    .trim()
    .optional()
    .describe("Concrete grade (if precast)"),
  steelGrade: z
    .string()
    .max(20, "Steel grade must not exceed 20 characters")
    .trim()
    .optional()
    .describe("Steel grade (if steel pile)"),
  drivingLog: z
    .array(drivingLogEntrySchema)
    .max(500, "Maximum 500 driving log entries")
    .optional(),
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z
    .array(equipmentUsedSchema)
    .max(20, "Maximum 20 equipment entries")
    .optional(),
});

export type DrivenPilingDetails = z.infer<typeof drivenPilingSchema>;
