import { z } from "zod";
import { SyncAction } from "../enums";

// ─── Sync Push Item ──────────────────────────────────────────────────────────

export const syncPushItemSchema = z.object({
  action: z.nativeEnum(SyncAction),
  table: z
    .string()
    .min(1, "Table name is required")
    .max(100, "Table name must not exceed 100 characters"),
  recordId: z.string().uuid("Invalid record ID"),
  clientId: z
    .string()
    .uuid("Invalid client ID")
    .describe("Client-generated UUID for deduplication"),
  payload: z
    .record(z.string(), z.unknown())
    .describe("Record data to sync"),
  timestamp: z
    .string()
    .datetime({ message: "Timestamp must be a valid ISO 8601 datetime" }),
});

export type SyncPushItem = z.infer<typeof syncPushItemSchema>;

// ─── Sync Push ───────────────────────────────────────────────────────────────

export const syncPushSchema = z.object({
  items: z
    .array(syncPushItemSchema)
    .min(1, "At least one sync item is required")
    .max(100, "Maximum 100 items per sync push"),
});

export type SyncPushInput = z.infer<typeof syncPushSchema>;

// ─── Sync Pull Query ─────────────────────────────────────────────────────────

export const syncPullQuerySchema = z.object({
  since: z
    .string()
    .datetime({
      message: "Since must be a valid ISO 8601 datetime",
    })
    .describe("Fetch all changes since this ISO datetime"),
});

export type SyncPullQuery = z.infer<typeof syncPullQuerySchema>;
