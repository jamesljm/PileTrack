import type { ActivityStatus, ActivityType } from "../enums";

/**
 * Full Activity record entity matching the Prisma model.
 */
export interface ActivityRecord {
  id: string;
  clientId: string;
  siteId: string;
  activityType: ActivityType;
  status: ActivityStatus;
  date: string;
  details: Record<string, unknown>;
  photos: Array<{
    uri: string;
    caption?: string;
    takenAt?: string;
  }>;
  gpsLat: number | null;
  gpsLng: number | null;
  notes: string | null;
  weather: {
    condition: string;
    temperatureCelsius?: number;
    humidity?: number;
    windSpeedKmh?: number;
    rainfall?: number;
  } | null;
  createdById: string;
  approvedById: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lightweight activity representation for lists.
 */
export interface ActivitySummary {
  id: string;
  clientId: string;
  siteId: string;
  siteName: string;
  activityType: ActivityType;
  status: ActivityStatus;
  date: string;
  createdByName: string;
  createdAt: string;
}
