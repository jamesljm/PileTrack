import { z } from "zod";

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
    .max(2000, "Concrete volume must not exceed 2000 m\u00B3")
    .describe("Concrete volume in m\u00B3"),
  jointType: z.enum(["CWS", "STOP_END", "CUTTER"]),
  guideWallLevel: z
    .number()
    .describe("Guide wall level in m"),
  excavationMethod: z.enum(["GRAB", "CUTTER", "HYDROMILL"]),
  slurryDensity: z
    .number()
    .positive("Slurry density must be positive")
    .max(2, "Slurry density must not exceed 2.0 g/cm\u00B3")
    .describe("Slurry density in g/cm\u00B3"),
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
    .describe("Overbreak volume in m\u00B3")
    .optional(),
});

export type DiaphragmWallDetails = z.infer<typeof diaphragmWallSchema>;
