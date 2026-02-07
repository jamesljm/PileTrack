import { z } from "zod";

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  drilling: stageTimingSchema.optional(),
  grouting: stageTimingSchema.optional(),
  stressing: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

export const groundAnchorSchema = z.object({
  anchorId: z
    .string()
    .min(1, "Anchor ID is required")
    .max(50, "Anchor ID must not exceed 50 characters")
    .trim(),
  type: z.enum(["TEMPORARY", "PERMANENT"]),
  freeLength: z
    .number()
    .min(0, "Free length must be non-negative")
    .max(50, "Free length must not exceed 50m")
    .describe("Free length in m"),
  bondLength: z
    .number()
    .positive("Bond length must be positive")
    .max(30, "Bond length must not exceed 30m")
    .describe("Bond length in m"),
  designLoad: z
    .number()
    .positive("Design load must be positive")
    .max(10000, "Design load must not exceed 10000 kN")
    .describe("Design load in kN"),
  testLoad: z
    .number()
    .positive("Test load must be positive")
    .max(15000, "Test load must not exceed 15000 kN")
    .describe("Test load in kN")
    .optional(),
  lockOffLoad: z
    .number()
    .positive("Lock-off load must be positive")
    .max(10000, "Lock-off load must not exceed 10000 kN")
    .describe("Lock-off load in kN")
    .optional(),
  strandCount: z
    .number()
    .int("Strand count must be a whole number")
    .positive("Strand count must be positive")
    .max(50, "Strand count must not exceed 50"),
  groutPressure: z
    .number()
    .min(0, "Grout pressure must be non-negative")
    .max(100, "Grout pressure must not exceed 100 bar")
    .describe("Grout pressure in bar"),
  inclination: z
    .number()
    .min(0, "Inclination must be non-negative")
    .max(90, "Inclination must not exceed 90 degrees")
    .describe("Inclination angle in degrees from horizontal"),
  drillHoleDiameter: z
    .number()
    .int("Drill hole diameter must be a whole number")
    .positive("Drill hole diameter must be positive")
    .max(500, "Drill hole diameter must not exceed 500mm")
    .describe("Drill hole diameter in mm"),
  stressingRecord: z
    .string()
    .max(2000, "Stressing record must not exceed 2000 characters")
    .trim()
    .optional(),
  creepTest: z.boolean().default(false),
  corrosionProtection: z.enum(["SINGLE", "DOUBLE", "NONE"]),
  anchorHeadType: z
    .string()
    .max(100, "Anchor head type must not exceed 100 characters")
    .trim()
    .optional(),
  wallType: z
    .string()
    .max(100, "Wall type must not exceed 100 characters")
    .trim()
    .optional(),

  // Enhanced fields
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z.array(equipmentUsedSchema).max(20).optional(),
});

export type GroundAnchorDetails = z.infer<typeof groundAnchorSchema>;
