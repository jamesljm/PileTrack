import Dexie, { type EntityTable } from "dexie";

export interface LocalActivity {
  id: string;
  clientId: string;
  siteId: string;
  activityType: string;
  status: string;
  date: string;
  details: Record<string, unknown>;
  photos: Array<{ uri: string; caption?: string; takenAt?: string }>;
  gpsLat?: number | null;
  gpsLng?: number | null;
  notes?: string | null;
  weather?: Record<string, unknown> | null;
  userId: string;
  syncStatus: "SYNCED" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface LocalEquipment {
  id: string;
  siteId: string | null;
  name: string;
  code: string;
  category: string;
  status: string;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  yearOfManufacture?: number | null;
  lastServiceDate?: string | null;
  nextServiceDate?: string | null;
  qrCode?: string | null;
  notes?: string | null;
  syncStatus: "SYNCED" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface LocalMaterial {
  id: string;
  siteId: string;
  name: string;
  code: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  category?: string | null;
  supplier?: string | null;
  unitPrice?: number | null;
  notes?: string | null;
  syncStatus: "SYNCED" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface LocalTransfer {
  id: string;
  fromSiteId: string;
  toSiteId: string;
  status: string;
  requestedById: string;
  approvedById?: string | null;
  requestedDate?: string | null;
  notes?: string | null;
  items: Array<{
    equipmentId?: string | null;
    materialId?: string | null;
    quantity: number;
  }>;
  syncStatus: "SYNCED" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface LocalSite {
  id: string;
  name: string;
  code: string;
  address: string;
  clientName: string;
  contractNumber?: string | null;
  gpsLat?: number | null;
  gpsLng?: number | null;
  startDate?: string | null;
  expectedEndDate?: string | null;
  status: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncQueueItem {
  id?: number;
  table: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  recordId: string;
  clientId?: string;
  payload?: Record<string, unknown>;
  status: "PENDING" | "SYNCED" | "FAILED";
  timestamp: string;
  retryCount: number;
  error?: string;
}

export interface SyncMeta {
  key: string;
  value: string;
}

class PileTrackDB extends Dexie {
  activities!: EntityTable<LocalActivity, "id">;
  equipment!: EntityTable<LocalEquipment, "id">;
  materials!: EntityTable<LocalMaterial, "id">;
  transfers!: EntityTable<LocalTransfer, "id">;
  sites!: EntityTable<LocalSite, "id">;
  syncQueue!: EntityTable<SyncQueueItem, "id">;
  syncMeta!: EntityTable<SyncMeta, "key">;

  constructor() {
    super("PileTrackDB");

    this.version(1).stores({
      activities:
        "id, clientId, siteId, activityType, status, date, userId, syncStatus",
      equipment: "id, siteId, code, category, status, qrCode, syncStatus",
      materials: "id, siteId, name, syncStatus",
      transfers: "id, fromSiteId, toSiteId, status, syncStatus",
      sites: "id, code, status",
      syncQueue: "++id, table, action, recordId, clientId, status, timestamp, retryCount",
      syncMeta: "key",
    });
  }
}

export const db = new PileTrackDB();
