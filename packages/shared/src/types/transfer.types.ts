import type { TransferStatus } from "../enums";

/**
 * A single line item within a transfer.
 */
export interface TransferItem {
  id: string;
  transferId: string;
  equipmentId: string | null;
  materialId: string | null;
  quantity: number;
  createdAt: string;
}

/**
 * Full Transfer entity matching the Prisma model.
 */
export interface Transfer {
  id: string;
  fromSiteId: string;
  toSiteId: string;
  status: TransferStatus;
  requestedById: string;
  approvedById: string | null;
  requestedDate: string | null;
  approvedAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transfer with its associated items included.
 */
export interface TransferWithItems extends Transfer {
  items: TransferItem[];
  fromSiteName: string;
  toSiteName: string;
  requestedByName: string;
  approvedByName: string | null;
}
