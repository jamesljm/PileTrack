import { z } from "zod";

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
    .max(100, "Waste volume must not exceed 100 m\u00B3")
    .describe("Waste volume in m\u00B3"),
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
});

export type PileHeadHackingDetails = z.infer<typeof pileHeadHackingSchema>;
