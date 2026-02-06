import type { EquipmentCategory, EquipmentStatus } from "../enums";

/**
 * Full Equipment entity matching the Prisma model.
 */
export interface Equipment {
  id: string;
  name: string;
  code: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  siteId: string | null;
  serialNumber: string | null;
  manufacturer: string | null;
  model: string | null;
  yearOfManufacture: number | null;
  lastServiceDate: string | null;
  nextServiceDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
