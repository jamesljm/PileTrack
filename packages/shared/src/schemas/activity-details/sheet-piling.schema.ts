import { z } from "zod";

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

export const sheetPilingSchema = z.object({
  pileNumber: z
    .string()
    .min(1, "Pile number is required")
    .max(50, "Pile number must not exceed 50 characters")
    .trim(),
  type: z
    .string()
    .min(1, "Sheet pile type is required")
    .max(100, "Sheet pile type must not exceed 100 characters")
    .trim(),
  length: z
    .number()
    .positive("Length must be positive")
    .max(50, "Length must not exceed 50m")
    .describe("Sheet pile length in m"),
  driveMethod: z.enum(["VIBRATORY", "IMPACT", "PRESS", "JACKING"]),
  finalSet: z
    .number()
    .min(0, "Final set must be non-negative")
    .describe("Final set in mm per blow")
    .optional(),
  inclination: z
    .number()
    .min(0, "Inclination must be non-negative")
    .max(90, "Inclination must not exceed 90 degrees")
    .describe("Inclination in degrees")
    .optional(),
  interlockCondition: z.enum(["GOOD", "FAIR", "POOR", "DAMAGED"]),
  clutchType: z
    .string()
    .max(100, "Clutch type must not exceed 100 characters")
    .trim()
    .optional(),
  vibroHammerModel: z
    .string()
    .max(100, "Vibro hammer model must not exceed 100 characters")
    .trim()
    .optional(),
  penetrationRate: z
    .number()
    .min(0, "Penetration rate must be non-negative")
    .describe("Penetration rate in m/min")
    .optional(),
  sectionModulus: z
    .number()
    .positive("Section modulus must be positive")
    .describe("Section modulus in cm³/m")
    .optional(),
  coatingType: z
    .string()
    .max(100, "Coating type must not exceed 100 characters")
    .trim()
    .optional(),
  weldingRequired: z.boolean().default(false),
  toeLevel: z
    .number()
    .describe("Toe level in mPD"),

  // Enhanced fields
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z.array(equipmentUsedSchema).max(20).optional(),
});

export type SheetPilingDetails = z.infer<typeof sheetPilingSchema>;
