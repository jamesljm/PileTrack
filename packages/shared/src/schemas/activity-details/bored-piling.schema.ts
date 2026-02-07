import { z } from "zod";

// ─── Sub-schemas for enhanced fields ────────────────────────────────────────

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

export const boredPilingSchema = z.object({
  pileId: z
    .string()
    .min(1, "Pile ID is required")
    .max(50, "Pile ID must not exceed 50 characters")
    .trim(),
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
  slumpTest: z
    .number()
    .int("Slump test must be a whole number")
    .min(0, "Slump test must be non-negative")
    .max(300, "Slump test must not exceed 300mm")
    .describe("Slump test result in mm"),
  cubeTestRef: z
    .string()
    .max(100, "Cube test reference must not exceed 100 characters")
    .trim()
    .optional(),
  boreholeLog: z
    .string()
    .max(2000, "Borehole log must not exceed 2000 characters")
    .trim()
    .optional(),
  casingDepth: z
    .number()
    .min(0, "Casing depth must be non-negative")
    .max(200, "Casing depth must not exceed 200m")
    .describe("Casing depth in m"),
  tremieLength: z
    .number()
    .positive("Tremie length must be positive")
    .max(200, "Tremie length must not exceed 200m")
    .describe("Tremie pipe length in m"),
  cutOffLevel: z
    .number()
    .describe("Cut-off level in mPD"),
  concreteGrade: z
    .string()
    .min(1, "Concrete grade is required")
    .max(20, "Concrete grade must not exceed 20 characters")
    .trim(),
  startDepth: z
    .number()
    .min(0, "Start depth must be non-negative")
    .describe("Start depth in m"),
  finalDepth: z
    .number()
    .positive("Final depth must be positive")
    .describe("Final depth in m"),
  socketRockLength: z
    .number()
    .min(0, "Socket rock length must be non-negative")
    .describe("Socket into rock length in m")
    .optional(),
  groundwaterLevel: z
    .number()
    .describe("Groundwater level in m")
    .optional(),
  casingType: z
    .string()
    .max(100, "Casing type must not exceed 100 characters")
    .trim()
    .optional(),

  // ─── New enhanced fields ────────────────────────────────────────────────
  pileDesignRef: z
    .string()
    .max(100, "Pile design reference must not exceed 100 characters")
    .trim()
    .optional(),
  platformLevel: z
    .number()
    .describe("Platform level in mPD")
    .optional(),
  toeLevel: z
    .number()
    .describe("Toe level in mPD")
    .optional(),
  cageWeight: z
    .number()
    .min(0, "Cage weight must be non-negative")
    .max(200, "Cage weight must not exceed 200 tonnes")
    .describe("Cage weight in tonnes")
    .optional(),
  cageLength: z
    .number()
    .min(0, "Cage length must be non-negative")
    .max(200, "Cage length must not exceed 200m")
    .describe("Cage length in m")
    .optional(),
  bentoniteUsed: z
    .number()
    .min(0, "Bentonite used must be non-negative")
    .max(100000, "Bentonite used must not exceed 100000 litres")
    .describe("Bentonite used in litres")
    .optional(),
  slurryDensityStart: z
    .number()
    .min(0.5)
    .max(2.0)
    .describe("Slurry density at start in g/cm³")
    .optional(),
  slurryDensityEnd: z
    .number()
    .min(0.5)
    .max(2.0)
    .describe("Slurry density at end in g/cm³")
    .optional(),
  theoreticalVolume: z
    .number()
    .min(0)
    .describe("Theoretical concrete volume in m³ — auto-calculated")
    .optional(),
  overconsumptionPct: z
    .number()
    .describe("Overconsumption percentage — auto-calculated")
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

export type BoredPilingDetails = z.infer<typeof boredPilingSchema>;
export type ConcreteTruck = z.infer<typeof concreteTruckSchema>;
export type StageTimings = z.infer<typeof stageTimingsSchema>;
export type EquipmentUsedEntry = z.infer<typeof equipmentUsedSchema>;
