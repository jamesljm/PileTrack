import { z } from "zod";

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const stageTimingSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

const stageTimingsSchema = z.object({
  setup: stageTimingSchema.optional(),
  treatment: stageTimingSchema.optional(),
  verification: stageTimingSchema.optional(),
});

const equipmentUsedSchema = z.object({
  equipmentId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).trim(),
  hours: z.number().min(0).max(24),
  isDowntime: z.boolean().default(false),
  downtimeReason: z.string().max(500).trim().optional(),
});

// ─── Main schema ────────────────────────────────────────────────────────────

export const groundImprovementSchema = z.object({
  method: z.enum([
    "VIBRO_REPLACEMENT",
    "STONE_COLUMN",
    "JGP",
    "DSM",
    "COMPACTION_GROUTING",
    "CEMENT_MIXING",
  ]),
  gridRef: z
    .string()
    .max(50, "Grid reference must not exceed 50 characters")
    .trim()
    .optional(),
  depth: z
    .number()
    .positive("Depth must be positive")
    .max(50, "Depth must not exceed 50m")
    .describe("Treatment depth in m"),
  diameter: z
    .number()
    .positive("Diameter must be positive")
    .max(3000, "Diameter must not exceed 3000mm")
    .describe("Column diameter in mm")
    .optional(),
  groutMix: z
    .string()
    .max(200, "Grout mix must not exceed 200 characters")
    .trim()
    .optional(),
  injectionPressure: z
    .number()
    .min(0)
    .max(200, "Injection pressure must not exceed 200 bar")
    .describe("Injection pressure in bar")
    .optional(),
  injectionVolume: z
    .number()
    .min(0)
    .max(100000, "Injection volume must not exceed 100000 litres")
    .describe("Injection volume in litres")
    .optional(),
  columnSpacing: z
    .number()
    .positive()
    .max(10, "Column spacing must not exceed 10m")
    .describe("Column spacing in m")
    .optional(),
  treatmentArea: z
    .number()
    .positive()
    .max(100000, "Treatment area must not exceed 100000 m²")
    .describe("Treatment area in m²")
    .optional(),
  fillMaterial: z
    .string()
    .max(200, "Fill material must not exceed 200 characters")
    .trim()
    .optional(),
  remarks: z
    .string()
    .max(2000, "Remarks must not exceed 2000 characters")
    .trim()
    .optional(),
  stageTimings: stageTimingsSchema.optional(),
  equipmentUsed: z
    .array(equipmentUsedSchema)
    .max(20, "Maximum 20 equipment entries")
    .optional(),
});

export type GroundImprovementDetails = z.infer<typeof groundImprovementSchema>;
