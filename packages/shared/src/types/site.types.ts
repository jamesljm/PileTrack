import type { SiteStatus } from "../enums";
import type { UserSummary } from "./user.types";

/**
 * Full Site entity matching the Prisma model.
 */
export interface Site {
  id: string;
  name: string;
  code: string;
  address: string;
  clientName: string;
  contractNumber: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  startDate: string | null;
  expectedEndDate: string | null;
  status: SiteStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lightweight site representation for lists and dropdowns.
 */
export interface SiteSummary {
  id: string;
  name: string;
  code: string;
  clientName: string;
  status: SiteStatus;
}

/**
 * Site with assigned users included.
 */
export interface SiteWithUsers extends Site {
  users: UserSummary[];
}
