export interface WorkforceEntry {
  trade: string;
  headcount: number;
  hours: number;
}

export interface SafetyRecord {
  toolboxTopic?: string;
  toolboxAttendees?: number;
  incidents: string[];
  nearMisses: string[];
}

export interface DelayEntry {
  reason: string;
  durationMins: number;
  description?: string;
}

export interface MaterialUsageEntry {
  materialId?: string;
  materialName: string;
  quantity: number;
  unit: string;
  purpose?: string;
}

export interface DailyLog {
  id: string;
  siteId: string;
  logDate: string;
  status: string;
  workforce: WorkforceEntry[];
  safety: SafetyRecord;
  delays: DelayEntry[];
  materialUsage: MaterialUsageEntry[];
  weather: unknown;
  remarks: string | null;
  photos: string[] | null;
  createdById: string;
  createdBy?: { firstName: string; lastName: string };
  approvedById: string | null;
  approvedAt: string | null;
  rejectionNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
