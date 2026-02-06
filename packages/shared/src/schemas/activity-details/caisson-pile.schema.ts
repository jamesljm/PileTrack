import { z } from "zod";

export const caissonPileSchema = z.object({
  caissonId: z
    .string()
    .min(1, "Caisson ID is required")
    .max(50, "Caisson ID must not exceed 50 characters")
    .trim(),
  diameter: z
    .number()
    .positive("Diameter must be positive")
    .max(10, "Diameter must not exceed 10m")
    .describe("Caisson diameter in m"),
  depth: z
    .number()
    .positive("Depth must be positive")
    .max(200, "Depth must not exceed 200m")
    .describe("Caisson depth in m"),
  excavationMethod: z.enum(["GRAB", "RCD", "HAMMER_GRAB", "CHISEL"]),
  groundwaterLevel: z
    .number()
    .describe("Groundwater level in m")
    .optional(),
  concreteVolume: z
    .number()
    .positive("Concrete volume must be positive")
    .max(5000, "Concrete volume must not exceed 5000 m\u00B3")
    .describe("Concrete volume in m\u00B3"),
  reinforcementCage: z
    .string()
    .min(1, "Reinforcement cage details are required")
    .max(500, "Reinforcement cage details must not exceed 500 characters")
    .trim(),
  bellDiameter: z
    .number()
    .positive("Bell diameter must be positive")
    .max(15, "Bell diameter must not exceed 15m")
    .describe("Bell-out diameter in m")
    .optional(),
  socketLength: z
    .number()
    .min(0, "Socket length must be non-negative")
    .max(50, "Socket length must not exceed 50m")
    .describe("Socket into rock length in m")
    .optional(),
  rockLevel: z
    .number()
    .describe("Rock level in mPD")
    .optional(),
  linerType: z.enum(["STEEL", "CONCRETE", "NONE"]),
  linerThickness: z
    .number()
    .min(0, "Liner thickness must be non-negative")
    .max(100, "Liner thickness must not exceed 100mm")
    .describe("Liner thickness in mm")
    .optional(),
  concreteGrade: z
    .string()
    .min(1, "Concrete grade is required")
    .max(20, "Concrete grade must not exceed 20 characters")
    .trim(),
  baseGrouting: z.boolean().default(false),
  sonicLoggingTubes: z
    .number()
    .int("Sonic logging tubes must be a whole number")
    .min(0, "Sonic logging tubes must be non-negative")
    .max(10, "Sonic logging tubes must not exceed 10")
    .default(0),
});

export type CaissonPileDetails = z.infer<typeof caissonPileSchema>;
