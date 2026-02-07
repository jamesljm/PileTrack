import type { NCRStatus, NCRPriority, NCRCategory } from "../enums";

export interface NCR {
  id: string;
  siteId: string;
  pileId: string | null;
  ncrNumber: string;
  category: NCRCategory;
  priority: NCRPriority;
  status: NCRStatus;
  title: string;
  description: string;
  rootCause: string | null;
  correctiveAction: string | null;
  preventiveAction: string | null;
  photos: unknown[];
  raisedById: string;
  assignedToId: string | null;
  closedById: string | null;
  raisedAt: string;
  dueDate: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Included relations
  raisedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  closedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  site?: {
    id: string;
    name: string;
    code: string;
  };
  pile?: {
    id: string;
    pileId: string;
  } | null;
}

export type NCRSummary = NCR;
