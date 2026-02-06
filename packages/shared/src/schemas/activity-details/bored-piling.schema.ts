import { z } from "zod";

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
    .max(1000, "Concrete volume must not exceed 1000 m\u00B3")
    .describe("Concrete volume in m\u00B3"),
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
});

export type BoredPilingDetails = z.infer<typeof boredPilingSchema>;
