import { z } from "zod";

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
  excavation: stageTimingSchema.optional(),
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

export const diaphragmWallSchema = z.object({
  panelId: z
    .string()
    .min(1, "Panel ID is required")
    .max(50, "Panel ID must not exceed 50 characters")
    .trim(),
  length: z
    .number()
    .positive("Length must be positive")
    .max(20, "Length must not exceed 20m")
    .describe("Panel length in m"),
  width: z
    .number()
    .positive("Width must be positive")
    .max(5, "Width must not exceed 5m")
    .describe("Panel width/thickness in m"),
  depth: z
    .number()
    .positive("Depth must be positive")
    .max(200, "Depth must not exceed 200m")
    .describe("Panel depth in m"),
  slurryLevel: z
    .number()
    .describe("Slurry level in m"),
  reinforcementCage: z
    .string()
    .min(1, "Reinforcement cage details are required")
    .max(500, "Reinforcement cage details must not exceed 500 characters")
    .trim(),
  concreteVolume: z
    .number()
    .positive("Concrete volume must be positive")
    .max(2000, "Concrete volume must not exceed 2000 m³")
    .describe("Concrete volume in m³"),
  jointType: z.enum(["CWS", "STOP_END", "CUTTER"]),
  guideWallLevel: z
    .number()
    .describe("Guide wall level in m"),
  excavationMethod: z.enum(["GRAB", "CUTTER", "HYDROMILL"]),
  slurryDensity: z
    .number()
    .positive("Slurry density must be positive")
    .max(2, "Slurry density must not exceed 2.0 g/cm³")
    .describe("Slurry density in g/cm³"),
  panelSequence: z
    .number()
    .int("Panel sequence must be a whole number")
    .positive("Panel sequence must be positive"),
  tremiePipeCount: z
    .number()
    .int("Tremie pipe count must be a whole number")
    .positive("Tremie pipe count must be positive")
    .max(10, "Tremie pipe count must not exceed 10"),
  concreteGrade: z
    .string()
    .min(1, "Concrete grade is required")
    .max(20, "Concrete grade must not exceed 20 characters")
    .trim(),
  overbreak: z
    .number()
    .min(0, "Overbreak must be non-negative")
    .describe("Overbreak volume in m³")
    .optional(),

  // Enhanced fields
  theoreticalVolume: z.number().min(0).describe("Theoretical panel volume in m³ — auto-calculated").optional(),
  overconsumptionPct: z.number().describe("Overconsumption percentage — auto-calculated").optional(),
  concreteTrucks: z.array(concreteTruckSchema).max(50).optional(),
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z.array(equipmentUsedSchema).max(20).optional(),
});

export type DiaphragmWallDetails = z.infer<typeof diaphragmWallSchema>;
