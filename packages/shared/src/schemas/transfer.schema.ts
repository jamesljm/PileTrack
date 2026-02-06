import { z } from "zod";
import { TransferStatus } from "../enums";

// ─── Transfer Item ───────────────────────────────────────────────────────────

const transferItemSchema = z
  .object({
    equipmentId: z.string().uuid("Invalid equipment ID").optional(),
    materialId: z.string().uuid("Invalid material ID").optional(),
    quantity: z
      .number()
      .positive("Quantity must be positive")
      .default(1),
  })
  .refine(
    (data) =>
      (data.equipmentId && !data.materialId) ||
      (!data.equipmentId && data.materialId),
    {
      message:
        "Each transfer item must have either an equipmentId or a materialId, but not both",
    },
  );

// ─── Create Transfer ─────────────────────────────────────────────────────────

export const createTransferSchema = z
  .object({
    fromSiteId: z.string().uuid("Invalid source site ID"),
    toSiteId: z.string().uuid("Invalid destination site ID"),
    items: z
      .array(transferItemSchema)
      .min(1, "At least one item is required")
      .max(50, "Maximum 50 items per transfer"),
    notes: z
      .string()
      .max(2000, "Notes must not exceed 2000 characters")
      .trim()
      .optional(),
    requestedDate: z.coerce.date().optional(),
  })
  .refine((data) => data.fromSiteId !== data.toSiteId, {
    message: "Source and destination sites must be different",
    path: ["toSiteId"],
  });

export type CreateTransferInput = z.infer<typeof createTransferSchema>;

// ─── Transfer Filter ─────────────────────────────────────────────────────────

export const transferFilterSchema = z.object({
  fromSiteId: z.string().uuid().optional(),
  toSiteId: z.string().uuid().optional(),
  status: z.nativeEnum(TransferStatus).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type TransferFilter = z.infer<typeof transferFilterSchema>;
