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
  formwork: stageTimingSchema.optional(),
  reinforcement: stageTimingSchema.optional(),
  concreting: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

export const pilecapSchema = z.object({
  pilecapId: z
    .string()
    .min(1, "Pilecap ID is required")
    .max(50, "Pilecap ID must not exceed 50 characters")
    .trim(),
  linkedPileIds: z
    .array(
      z
        .string()
        .min(1, "Pile ID must not be empty")
        .max(50, "Pile ID must not exceed 50 characters"),
    )
    .min(1, "At least one linked pile ID is required"),
  length: z
    .number()
    .positive("Length must be positive")
    .max(50, "Length must not exceed 50m")
    .describe("Pilecap length in m"),
  width: z
    .number()
    .positive("Width must be positive")
    .max(50, "Width must not exceed 50m")
    .describe("Pilecap width in m"),
  depth: z
    .number()
    .positive("Depth must be positive")
    .max(10, "Depth must not exceed 10m")
    .describe("Pilecap depth in m"),
  reinforcementDetails: z
    .string()
    .min(1, "Reinforcement details are required")
    .max(1000, "Reinforcement details must not exceed 1000 characters")
    .trim(),
  concreteVolume: z
    .number()
    .positive("Concrete volume must be positive")
    .max(500, "Concrete volume must not exceed 500 m³")
    .describe("Concrete volume in m³"),
  formworkType: z.enum(["TIMBER", "STEEL", "PLYWOOD", "SYSTEM"]),
  curingMethod: z.enum(["WATER", "MEMBRANE", "STEAM", "BLANKET"]),
  cubeTestRef: z
    .string()
    .max(100, "Cube test reference must not exceed 100 characters")
    .trim()
    .optional(),
  concreteGrade: z
    .string()
    .min(1, "Concrete grade is required")
    .max(20, "Concrete grade must not exceed 20 characters")
    .trim(),
  blindingThickness: z
    .number()
    .min(0, "Blinding thickness must be non-negative")
    .max(1, "Blinding thickness must not exceed 1m")
    .describe("Blinding thickness in m")
    .optional(),
  waterproofing: z.boolean().default(false),
  holdingDownBolts: z.boolean().default(false),

  // Enhanced fields
  theoreticalVolume: z.number().min(0).describe("Theoretical volume in m³ — auto-calculated").optional(),
  overconsumptionPct: z.number().describe("Overconsumption percentage — auto-calculated").optional(),
  concreteTrucks: z.array(concreteTruckSchema).max(50).optional(),
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z.array(equipmentUsedSchema).max(20).optional(),
});

export type PilecapDetails = z.infer<typeof pilecapSchema>;
