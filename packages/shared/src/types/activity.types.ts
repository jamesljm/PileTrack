import type { ActivityStatus, ActivityType } from "../enums";

/**
 * Full Activity record entity matching the Prisma model.
 */
export interface ActivityRecord {
  id: string;
  clientId: string | null;
  siteId: string;
  activityType: ActivityType;
  status: ActivityStatus;
  activityDate: string;
  details: Record<string, unknown>;
  photos: unknown[];
  remarks: string | null;
  weather: Record<string, unknown> | null;
  createdById: string;
  approvedById: string | null;
  approvedAt: string | null;
  rejectionNotes: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Included relations
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  site?: {
    id: string;
    name: string;
    code: string;
  };
}

/**
 * Activity representation for lists (same shape as ActivityRecord with relations).
 */
export type ActivitySummary = ActivityRecord;
