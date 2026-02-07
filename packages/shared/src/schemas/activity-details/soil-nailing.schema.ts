import { z } from "zod";

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  drilling: stageTimingSchema.optional(),
  grouting: stageTimingSchema.optional(),
  facing: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

export const soilNailingSchema = z.object({
  nailId: z
    .string()
    .min(1, "Nail ID is required")
    .max(50, "Nail ID must not exceed 50 characters")
    .trim(),
  length: z
    .number()
    .positive("Length must be positive")
    .max(30, "Length must not exceed 30m")
    .describe("Nail length in m"),
  diameter: z
    .number()
    .int("Diameter must be a whole number")
    .positive("Diameter must be positive")
    .max(100, "Diameter must not exceed 100mm")
    .describe("Nail bar diameter in mm"),
  angle: z
    .number()
    .min(0, "Angle must be non-negative")
    .max(90, "Angle must not exceed 90 degrees")
    .describe("Installation angle in degrees from horizontal"),
  groutPressure: z
    .number()
    .min(0, "Grout pressure must be non-negative")
    .max(50, "Grout pressure must not exceed 50 bar")
    .describe("Grout pressure in bar"),
  groutVolume: z
    .number()
    .positive("Grout volume must be positive")
    .max(5000, "Grout volume must not exceed 5000 litres")
    .describe("Grout volume in litres"),
  pullOutTestLoad: z
    .number()
    .positive("Pull-out test load must be positive")
    .max(1000, "Pull-out test load must not exceed 1000 kN")
    .describe("Pull-out test load in kN")
    .optional(),
  facingType: z.enum(["SHOTCRETE", "MESH", "PRECAST", "NONE"]),
  facingThickness: z
    .number()
    .min(0, "Facing thickness must be non-negative")
    .max(500, "Facing thickness must not exceed 500mm")
    .describe("Facing thickness in mm")
    .optional(),
  drainageProvided: z.boolean(),
  drillHoleDiameter: z
    .number()
    .int("Drill hole diameter must be a whole number")
    .positive("Drill hole diameter must be positive")
    .max(300, "Drill hole diameter must not exceed 300mm")
    .describe("Drill hole diameter in mm"),
  nailMaterial: z.enum(["STEEL_BAR", "SELF_DRILLING", "FIBREGLASS"]),
  headPlateSize: z
    .string()
    .max(50, "Head plate size must not exceed 50 characters")
    .trim()
    .optional(),
  rowNumber: z
    .number()
    .int("Row number must be a whole number")
    .positive("Row number must be positive")
    .max(100, "Row number must not exceed 100"),
  spacingHorizontal: z
    .number()
    .positive("Horizontal spacing must be positive")
    .max(10, "Horizontal spacing must not exceed 10m")
    .describe("Horizontal spacing in m"),
  spacingVertical: z
    .number()
    .positive("Vertical spacing must be positive")
    .max(10, "Vertical spacing must not exceed 10m")
    .describe("Vertical spacing in m"),

  // Enhanced fields
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z.array(equipmentUsedSchema).max(20).optional(),
});

export type SoilNailingDetails = z.infer<typeof soilNailingSchema>;
