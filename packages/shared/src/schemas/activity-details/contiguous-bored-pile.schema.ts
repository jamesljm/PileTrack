import { z } from "zod";

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const concreteTruckSchema = z.object({
  ticketNo: z.string().min(1).max(50).trim(),
  volume: z.number().positive().max(20).describe("Volume in m³"),
  slump: z.number().int().min(0).max(300).describe("Slump in mm"),
  temperature: z.number().min(0).max(60).describe("Temperature in °C").optional(),
  arrivalTime: z.string().optional(),
  accepted: z.boolean().default(true),
});

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  boring: stageTimingSchema.optional(),
  cage: stageTimingSchema.optional(),
  concreting: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

// ─── Main schema ────────────────────────────────────────────────────────────

export const contiguousBoredPileSchema = z.object({
  pileId: z
    .string()
    .min(1, "Pile ID is required")
    .max(50, "Pile ID must not exceed 50 characters")
    .trim(),
  wallSectionId: z
    .string()
    .min(1, "Wall section ID is required")
    .max(50, "Wall section ID must not exceed 50 characters")
    .trim(),
  panelId: z
    .string()
    .max(50, "Panel ID must not exceed 50 characters")
    .trim()
    .optional(),
  pileSpacing: z
    .number()
    .positive("Pile spacing must be positive")
    .max(5, "Pile spacing must not exceed 5m")
    .describe("Pile spacing in m"),
  isSecant: z
    .boolean()
    .default(false)
    .describe("true = secant, false = contiguous"),
  guideWallDetails: z
    .string()
    .max(500, "Guide wall details must not exceed 500 characters")
    .trim()
    .optional(),
  diameter: z
    .number()
    .int("Diameter must be a whole number")
    .positive("Diameter must be positive")
    .max(5000, "Diameter must not exceed 5000mm")
    .describe("Pile diameter in mm"),
  depth: z
    .number()
    .positive("Depth must be positive")
    .max(200, "Depth must not exceed 200m")
    .describe("Total pile depth in m"),
  reinforcementCage: z
    .string()
    .min(1, "Reinforcement cage details are required")
    .max(500, "Reinforcement cage details must not exceed 500 characters")
    .trim(),
  concreteVolume: z
    .number()
    .positive("Concrete volume must be positive")
    .max(1000, "Concrete volume must not exceed 1000 m³")
    .describe("Concrete volume in m³"),
  concreteGrade: z
    .string()
    .min(1, "Concrete grade is required")
    .max(20, "Concrete grade must not exceed 20 characters")
    .trim(),
  slumpTest: z
    .number()
    .int("Slump test must be a whole number")
    .min(0)
    .max(300, "Slump test must not exceed 300mm")
    .describe("Slump test result in mm"),
  casingDepth: z
    .number()
    .min(0)
    .max(200, "Casing depth must not exceed 200m")
    .describe("Casing depth in m")
    .optional(),
  tremieLength: z
    .number()
    .positive()
    .max(200, "Tremie length must not exceed 200m")
    .describe("Tremie pipe length in m")
    .optional(),
  cutOffLevel: z
    .number()
    .describe("Cut-off level in mPD")
    .optional(),
  startDepth: z
    .number()
    .min(0)
    .describe("Start depth in m")
    .optional(),
  finalDepth: z
    .number()
    .positive("Final depth must be positive")
    .describe("Final depth in m"),
  theoreticalVolume: z
    .number()
    .min(0)
    .describe("Theoretical concrete volume in m³")
    .optional(),
  overconsumptionPct: z
    .number()
    .describe("Overconsumption percentage")
    .optional(),
  concreteTrucks: z
    .array(concreteTruckSchema)
    .max(50, "Maximum 50 concrete trucks")
    .optional(),
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z
    .array(equipmentUsedSchema)
    .max(20, "Maximum 20 equipment entries")
    .optional(),
});

export type ContiguousBoredPileDetails = z.infer<typeof contiguousBoredPileSchema>;
