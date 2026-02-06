import { z } from "zod";

export const micropilingSchema = z.object({
  pileId: z
    .string()
    .min(1, "Pile ID is required")
    .max(50, "Pile ID must not exceed 50 characters")
    .trim(),
  diameter: z
    .number()
    .int("Diameter must be a whole number")
    .positive("Diameter must be positive")
    .max(600, "Diameter must not exceed 600mm")
    .describe("Micropile diameter in mm"),
  depth: z
    .number()
    .positive("Depth must be positive")
    .max(100, "Depth must not exceed 100m")
    .describe("Total depth in m"),
  groutPressure: z
    .number()
    .min(0, "Grout pressure must be non-negative")
    .max(100, "Grout pressure must not exceed 100 bar")
    .describe("Grout pressure in bar"),
  groutVolume: z
    .number()
    .positive("Grout volume must be positive")
    .max(10000, "Grout volume must not exceed 10000 litres")
    .describe("Grout volume in litres"),
  reinforcementType: z
    .string()
    .min(1, "Reinforcement type is required")
    .max(200, "Reinforcement type must not exceed 200 characters")
    .trim(),
  bondLength: z
    .number()
    .positive("Bond length must be positive")
    .max(50, "Bond length must not exceed 50m")
    .describe("Bond length in m"),
  freeLength: z
    .number()
    .min(0, "Free length must be non-negative")
    .max(50, "Free length must not exceed 50m")
    .describe("Free length in m"),
  testLoad: z
    .number()
    .positive("Test load must be positive")
    .max(10000, "Test load must not exceed 10000 kN")
    .describe("Test load in kN")
    .optional(),
  inclination: z
    .number()
    .min(0, "Inclination must be non-negative")
    .max(90, "Inclination must not exceed 90 degrees")
    .describe("Inclination angle in degrees")
    .optional(),
  groutMixRatio: z
    .string()
    .min(1, "Grout mix ratio is required")
    .max(50, "Grout mix ratio must not exceed 50 characters")
    .trim(),
  casingLength: z
    .number()
    .min(0, "Casing length must be non-negative")
    .max(100, "Casing length must not exceed 100m")
    .describe("Casing length in m")
    .optional(),
  drillingMethod: z
    .string()
    .min(1, "Drilling method is required")
    .max(100, "Drilling method must not exceed 100 characters")
    .trim(),
  flushType: z.enum(["WATER", "AIR", "FOAM", "MUD"]),
});

export type MicropilingDetails = z.infer<typeof micropilingSchema>;
