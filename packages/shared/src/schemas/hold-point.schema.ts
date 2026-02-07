import { z } from "zod";

export const signHoldPointSchema = z.object({
  checklist: z.array(
    z.object({
      item: z.string().min(1).max(500),
      checked: z.boolean(),
    }),
  ),
  signatureData: z.string().min(1, "Signature is required"),
  signedByName: z.string().min(1, "Signer name is required").max(200),
  comments: z.string().max(2000).optional(),
});

export const rejectHoldPointSchema = z.object({
  rejectionNotes: z.string().min(1, "Rejection notes are required").max(2000),
});

export type SignHoldPointInput = z.infer<typeof signHoldPointSchema>;
export type RejectHoldPointInput = z.infer<typeof rejectHoldPointSchema>;
