import { z } from "zod";

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
    .max(500, "Concrete volume must not exceed 500 m\u00B3")
    .describe("Concrete volume in m\u00B3"),
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
});

export type PilecapDetails = z.infer<typeof pilecapSchema>;
