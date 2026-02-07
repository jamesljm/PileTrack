import { z } from "zod";

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  jacking: stageTimingSchema.optional(),
  jointing: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

// ─── Main schema ────────────────────────────────────────────────────────────

export const jackInPilingSchema = z.object({
  pileId: z
    .string()
    .min(1, "Pile ID is required")
    .max(50, "Pile ID must not exceed 50 characters")
    .trim(),
  jackingForce: z
    .number()
    .positive("Jacking force must be positive")
    .max(20000, "Jacking force must not exceed 20000 kN")
    .describe("Jacking force in kN"),
  designCapacity: z
    .number()
    .positive("Design capacity must be positive")
    .max(20000, "Design capacity must not exceed 20000 kN")
    .describe("Design capacity in kN"),
  maxJackingForce: z
    .number()
    .positive("Max jacking force must be positive")
    .max(20000, "Max jacking force must not exceed 20000 kN")
    .describe("Maximum jacking force in kN")
    .optional(),
  pileType: z.enum(["RC_SPUN", "RC_SQUARE", "STEEL_H"]).describe("Type of jack-in pile"),
  pileSection: z
    .string()
    .min(1, "Pile section is required")
    .max(100, "Pile section must not exceed 100 characters")
    .trim(),
  pileLength: z
    .number()
    .positive("Pile length must be positive")
    .max(50, "Pile length must not exceed 50m")
    .describe("Individual section length in m"),
  numberOfSections: z
    .number()
    .int("Number of sections must be a whole number")
    .min(1)
    .max(20)
    .describe("Number of pile sections"),
  jointDetails: z
    .string()
    .max(500, "Joint details must not exceed 500 characters")
    .trim()
    .optional(),
  finalLoad: z
    .number()
    .positive("Final load must be positive")
    .max(20000, "Final load must not exceed 20000 kN")
    .describe("Final jacking load in kN")
    .optional(),
  penetrationRate: z
    .number()
    .min(0)
    .max(100, "Penetration rate must not exceed 100 mm/s")
    .describe("Penetration rate in mm/s")
    .optional(),
  terminationCriteria: z
    .string()
    .max(500, "Termination criteria must not exceed 500 characters")
    .trim()
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
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z
    .array(equipmentUsedSchema)
    .max(20, "Maximum 20 equipment entries")
    .optional(),
});

export type JackInPilingDetails = z.infer<typeof jackInPilingSchema>;
