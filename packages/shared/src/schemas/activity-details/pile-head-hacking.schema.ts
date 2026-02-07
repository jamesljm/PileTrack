import { z } from "zod";

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  hacking: stageTimingSchema.optional(),
  cleanup: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

export const pileHeadHackingSchema = z.object({
  pileId: z
    .string()
    .min(1, "Pile ID is required")
    .max(50, "Pile ID must not exceed 50 characters")
    .trim(),
  hackingLevel: z
    .number()
    .describe("Hacking level in mPD"),
  method: z.enum(["MANUAL", "MECHANICAL", "HYDRAULIC"]),
  reinforcementExposed: z.boolean(),
  inspectionStatus: z.enum(["PENDING", "PASSED", "FAILED", "REWORK"]),
  wasteVolume: z
    .number()
    .min(0, "Waste volume must be non-negative")
    .max(100, "Waste volume must not exceed 100 m³")
    .describe("Waste volume in m³"),
  exposedRebarLength: z
    .number()
    .min(0, "Exposed rebar length must be non-negative")
    .max(10, "Exposed rebar length must not exceed 10m")
    .describe("Exposed rebar length in m")
    .optional(),
  pileIntegrity: z
    .enum(["GOOD", "MINOR_DEFECT", "MAJOR_DEFECT"])
    .optional(),
  defectDescription: z
    .string()
    .max(2000, "Defect description must not exceed 2000 characters")
    .trim()
    .optional(),
  completionPhotos: z
    .array(
      z.string().min(1, "Photo URI must not be empty"),
    )
    .max(10, "Maximum 10 completion photos allowed")
    .optional(),

  // Enhanced fields
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z.array(equipmentUsedSchema).max(20).optional(),
});

export type PileHeadHackingDetails = z.infer<typeof pileHeadHackingSchema>;
