import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database";
import { equipmentRepository } from "../repositories/equipment.repository";
import { NotFoundError, ConflictError, ValidationError } from "../utils/api-error";
import { generateQRCode } from "../utils/qr-generator";
import type { Equipment, EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateEquipmentInput {
  siteId?: string;
  name: string;
  category?: EquipmentCategory;
  serialNumber?: string;
  status?: EquipmentStatus;
  condition?: EquipmentCondition;
  manufacturer?: string;
  model?: string;
  yearManufactured?: number;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  serviceIntervalHours?: number;
  purchaseDate?: Date;
  purchasePrice?: number;
  dailyRate?: number;
  insuranceExpiry?: Date;
  notes?: string;
}

export interface UpdateEquipmentInput {
  siteId?: string | null;
  name?: string;
  category?: EquipmentCategory;
  serialNumber?: string;
  status?: EquipmentStatus;
  condition?: EquipmentCondition;
  manufacturer?: string;
  model?: string;
  yearManufactured?: number;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  serviceIntervalHours?: number | null;
  purchaseDate?: Date | null;
  purchasePrice?: number | null;
  dailyRate?: number | null;
  insuranceExpiry?: Date | null;
  notes?: string;
}

class EquipmentService {
  async getEquipment(
    filter: {
      search?: string;
      category?: string;
      status?: string;
      siteId?: string;
      unassigned?: boolean;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Equipment[]; total: number }> {
    return equipmentRepository.findAllFiltered(filter, pagination);
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    const equipment = await equipmentRepository.findById(id, {
      site: { select: { id: true, name: true, code: true } },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }
    return equipment;
  }

  async createEquipment(input: CreateEquipmentInput): Promise<Equipment> {
    if (input.serialNumber) {
      const existing = await equipmentRepository.findBySerialNumber(input.serialNumber);
      if (existing) {
        throw new ConflictError(`Equipment with serial number '${input.serialNumber}' already exists`);
      }
    }

    if (input.siteId) {
      const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
      if (!site) {
        throw new NotFoundError("Site");
      }
    }

    const qrCode = `EQ-${uuidv4()}`;

    const equipment = await prisma.equipment.create({
      data: {
        siteId: input.siteId,
        name: input.name,
        category: input.category ?? "GENERAL",
        serialNumber: input.serialNumber,
        qrCode,
        status: input.status ?? "AVAILABLE",
        condition: input.condition ?? "GOOD",
        manufacturer: input.manufacturer,
        model: input.model,
        yearManufactured: input.yearManufactured,
        lastServiceDate: input.lastServiceDate,
        nextServiceDate: input.nextServiceDate,
        serviceIntervalHours: input.serviceIntervalHours,
        purchaseDate: input.purchaseDate,
        purchasePrice: input.purchasePrice,
        dailyRate: input.dailyRate,
        insuranceExpiry: input.insuranceExpiry,
        notes: input.notes,
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    // Create initial site history record if assigned to a site
    if (input.siteId) {
      await prisma.equipmentSiteHistory.create({
        data: {
          equipmentId: equipment.id,
          siteId: input.siteId,
        },
      });
    }

    logger.info({ equipmentId: equipment.id, name: equipment.name }, "Equipment created");
    return equipment;
  }

  async updateEquipment(id: string, input: UpdateEquipmentInput): Promise<Equipment> {
    const existing = await equipmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Equipment");
    }

    const eq = existing as Equipment;

    if (input.serialNumber && input.serialNumber !== eq.serialNumber) {
      const conflict = await equipmentRepository.findBySerialNumber(input.serialNumber);
      if (conflict) {
        throw new ConflictError(`Equipment with serial number '${input.serialNumber}' already exists`);
      }
    }

    // Track site changes for history
    const siteChanged = input.siteId !== undefined && input.siteId !== eq.siteId;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: input,
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    if (siteChanged) {
      // Close old site history record
      if (eq.siteId) {
        const openRecord = await prisma.equipmentSiteHistory.findFirst({
          where: { equipmentId: id, siteId: eq.siteId, removedAt: null },
          orderBy: { assignedAt: "desc" },
        });
        if (openRecord) {
          await prisma.equipmentSiteHistory.update({
            where: { id: openRecord.id },
            data: { removedAt: new Date() },
          });
        }
      }
      // Create new site history record
      if (input.siteId) {
        await prisma.equipmentSiteHistory.create({
          data: {
            equipmentId: id,
            siteId: input.siteId,
          },
        });
      }
    }

    logger.info({ equipmentId: id }, "Equipment updated");
    return equipment;
  }

  async deleteEquipment(id: string): Promise<void> {
    const existing = await equipmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Equipment");
    }

    await equipmentRepository.softDelete(id);
    logger.info({ equipmentId: id }, "Equipment soft-deleted");
  }

  async generateQR(id: string): Promise<{ qrCode: string; svgContent: string }> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const eq = equipment as Equipment;
    const qrData = JSON.stringify({
      id: eq.id,
      name: eq.name,
      serialNumber: eq.serialNumber,
      qrCode: eq.qrCode,
    });

    const svgContent = generateQRCode(qrData);

    return {
      qrCode: eq.qrCode ?? "",
      svgContent,
    };
  }

  async scanQR(qrCode: string): Promise<Equipment> {
    const equipment = await equipmentRepository.findByQrCode(qrCode);
    if (!equipment) {
      throw new NotFoundError("Equipment with this QR code");
    }
    return equipment;
  }

  async logService(
    id: string,
    serviceData: {
      date: Date;
      description: string;
      performedBy: string;
      cost?: number;
      nextServiceDate?: Date;
    },
  ): Promise<Equipment> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const eq = equipment as Equipment;
    const currentHistory = (eq.serviceHistory as unknown[] | null) ?? [];
    const updatedHistory = [
      ...currentHistory,
      {
        ...serviceData,
        loggedAt: new Date().toISOString(),
      },
    ];

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        lastServiceDate: serviceData.date,
        nextServiceDate: serviceData.nextServiceDate ?? eq.nextServiceDate,
        serviceHistory: updatedHistory,
        status: "AVAILABLE",
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    logger.info({ equipmentId: id }, "Service logged for equipment");
    return updated;
  }

  async getServiceDue(
    beforeDate?: Date,
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: Equipment[]; total: number }> {
    return equipmentRepository.findServiceDue(beforeDate, pagination);
  }

  async getFleetStats(): Promise<{
    totalCount: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    byCondition: Record<string, number>;
    serviceOverdueCount: number;
    totalFleetValue: number;
    avgUtilizationRate: number;
    topUsed: Array<{ id: string; name: string; code: string; totalUsageHours: number }>;
    serviceDueSoon: Array<{ id: string; name: string; code: string; nextServiceDate: string | null }>;
  }> {
    const allEquipment = await prisma.equipment.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        status: true,
        category: true,
        condition: true,
        totalUsageHours: true,
        purchasePrice: true,
        nextServiceDate: true,
        qrCode: true,
      },
    });

    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byCondition: Record<string, number> = {};
    let totalFleetValue = 0;
    let serviceOverdueCount = 0;
    const now = new Date();

    for (const eq of allEquipment) {
      byStatus[eq.status] = (byStatus[eq.status] ?? 0) + 1;
      byCategory[eq.category] = (byCategory[eq.category] ?? 0) + 1;
      byCondition[eq.condition] = (byCondition[eq.condition] ?? 0) + 1;

      if (eq.purchasePrice) totalFleetValue += eq.purchasePrice;

      if (eq.nextServiceDate && new Date(eq.nextServiceDate) < now) {
        serviceOverdueCount++;
      }
    }

    // Top 5 most used
    const topUsed = [...allEquipment]
      .sort((a, b) => b.totalUsageHours - a.totalUsageHours)
      .slice(0, 5)
      .map((eq) => ({
        id: eq.id,
        name: eq.name,
        code: eq.qrCode ?? "",
        totalUsageHours: eq.totalUsageHours,
      }));

    // Top 5 service due soon (not yet overdue, earliest first)
    const serviceDueSoon = [...allEquipment]
      .filter((eq) => eq.nextServiceDate && new Date(eq.nextServiceDate) >= now)
      .sort((a, b) => {
        const dateA = a.nextServiceDate ? new Date(a.nextServiceDate).getTime() : Infinity;
        const dateB = b.nextServiceDate ? new Date(b.nextServiceDate).getTime() : Infinity;
        return dateA - dateB;
      })
      .slice(0, 5)
      .map((eq) => ({
        id: eq.id,
        name: eq.name,
        code: eq.qrCode ?? "",
        nextServiceDate: eq.nextServiceDate?.toISOString() ?? null,
      }));

    // Average utilization rate
    const totalHours = allEquipment.reduce((sum, eq) => sum + eq.totalUsageHours, 0);
    const avgUtilizationRate = allEquipment.length > 0
      ? totalHours / allEquipment.length
      : 0;

    return {
      totalCount: allEquipment.length,
      byStatus,
      byCategory,
      byCondition,
      serviceOverdueCount,
      totalFleetValue,
      avgUtilizationRate: Math.round(avgUtilizationRate * 10) / 10,
      topUsed,
      serviceDueSoon,
    };
  }

  async getHistory(id: string): Promise<unknown[]> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    return ((equipment as Equipment).serviceHistory as unknown[] | null) ?? [];
  }
}

export const equipmentService = new EquipmentService();
