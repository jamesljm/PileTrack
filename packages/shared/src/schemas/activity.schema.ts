import { z } from "zod";
import { ActivityStatus, ActivityType } from "../enums";
import { weatherSchema } from "./common.schema";

// ─── Create Activity ─────────────────────────────────────────────────────────

export const createActivitySchema = z.object({
  clientId: z
    .string()
    .uuid("Invalid client ID")
    .describe("Client-generated UUID for offline-first sync"),
  siteId: z.string().uuid("Invalid site ID"),
  activityType: z.nativeEnum(ActivityType),
  date: z.coerce.date(),
  details: z
    .record(z.string(), z.unknown())
    .describe("Activity-type-specific details validated by sub-schema"),
  photos: z
    .array(
      z.object({
        uri: z.string().min(1, "Photo URI is required"),
        caption: z.string().max(500).optional(),
        takenAt: z.coerce.date().optional(),
      }),
    )
    .max(20, "Maximum 20 photos allowed")
    .default([]),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  notes: z
    .string()
    .max(5000, "Notes must not exceed 5000 characters")
    .trim()
    .optional(),
  weather: weatherSchema.optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

// ─── Update Activity ─────────────────────────────────────────────────────────

export const updateActivitySchema = z.object({
  date: z.coerce.date().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  photos: z
    .array(
      z.object({
        uri: z.string().min(1, "Photo URI is required"),
        caption: z.string().max(500).optional(),
        takenAt: z.coerce.date().optional(),
      }),
    )
    .max(20, "Maximum 20 photos allowed")
    .optional(),
  gpsLat: z.number().min(-90).max(90).nullish(),
  gpsLng: z.number().min(-180).max(180).nullish(),
  notes: z
    .string()
    .max(5000, "Notes must not exceed 5000 characters")
    .trim()
    .nullish(),
  weather: weatherSchema.nullish(),
});

export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

// ─── Activity Filter ─────────────────────────────────────────────────────────

export const activityFilterSchema = z.object({
  siteId: z.string().uuid().optional(),
  activityType: z.nativeEnum(ActivityType).optional(),
  status: z.nativeEnum(ActivityStatus).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  createdBy: z.string().uuid().optional(),
});

export type ActivityFilter = z.infer<typeof activityFilterSchema>;

// ─── Approve Activity ────────────────────────────────────────────────────────

export const approveActivitySchema = z.object({
  comments: z
    .string()
    .max(2000, "Comments must not exceed 2000 characters")
    .trim()
    .optional(),
});

export type ApproveActivityInput = z.infer<typeof approveActivitySchema>;

// ─── Reject Activity ─────────────────────────────────────────────────────────

export const rejectActivitySchema = z.object({
  reason: z
    .string()
    .min(1, "Rejection reason is required")
    .max(2000, "Reason must not exceed 2000 characters")
    .trim(),
});

export type RejectActivityInput = z.infer<typeof rejectActivitySchema>;
