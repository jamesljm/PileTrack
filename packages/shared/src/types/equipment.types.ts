import type { EquipmentCategory, EquipmentStatus, EquipmentCondition, ServiceType } from "../enums";

/**
 * Full Equipment entity matching the Prisma model.
 */
export interface Equipment {
  id: string;
  name: string;
  code: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  siteId: string | null;
  serialNumber: string | null;
  manufacturer: string | null;
  model: string | null;
  yearOfManufacture: number | null;
  lastServiceDate: string | null;
  nextServiceDate: string | null;
  totalUsageHours: number;
  serviceIntervalHours: number | null;
  purchaseDate: string | null;
  purchasePrice: number | null;
  dailyRate: number | null;
  insuranceExpiry: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service record for normalized service tracking.
 */
export interface ServiceRecord {
  id: string;
  equipmentId: string;
  serviceType: ServiceType;
  serviceDate: string;
  description: string;
  performedBy: string;
  cost: number | null;
  partsReplaced: string | null;
  nextServiceDate: string | null;
  meterReading: number | null;
  notes: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Equipment site assignment history record.
 */
export interface EquipmentSiteHistory {
  id: string;
  equipmentId: string;
  siteId: string;
  assignedAt: string;
  removedAt: string | null;
  transferId: string | null;
  notes: string | null;
  site?: { id: string; name: string; code: string };
  transfer?: { id: string } | null;
}

/**
 * Usage history entry derived from activity records.
 */
export interface EquipmentUsageEntry {
  activityId: string;
  activityDate: string;
  activityType: string;
  siteId: string;
  siteName: string;
  hours: number;
  isDowntime: boolean;
  downtimeReason: string | null;
}

/**
 * Aggregated usage summary for equipment.
 */
export interface EquipmentUsageSummary {
  totalHours: number;
  productiveHours: number;
  downtimeHours: number;
  utilizationRate: number;
}

/**
 * Combined equipment statistics.
 */
export interface EquipmentStats {
  totalUsageHours: number;
  productiveHours: number;
  downtimeHours: number;
  utilizationRate: number;
  totalServiceCost: number;
  serviceCount: number;
  daysSinceLastService: number | null;
  isServiceOverdue: boolean;
}

/**
 * Service cost summary by type.
 */
export interface ServiceCostSummary {
  totalCost: number;
  costByType: Record<string, number>;
  recordCount: number;
}

/**
 * Fleet statistics.
 */
export interface FleetStats {
  totalCount: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byCondition: Record<string, number>;
  serviceOverdueCount: number;
  totalFleetValue: number;
  avgUtilizationRate: number;
  topUsed: Array<{ id: string; name: string; code: string; totalUsageHours: number }>;
  serviceDueSoon: Array<{ id: string; name: string; code: string; nextServiceDate: string | null }>;
}
