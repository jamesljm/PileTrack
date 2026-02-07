import { prisma } from "../config/database";
import { NotFoundError } from "../utils/api-error";
import type { ServiceRecord, ServiceType, Prisma } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateServiceRecordInput {
  serviceType: ServiceType;
  serviceDate: Date;
  description: string;
  performedBy: string;
  cost?: number;
  partsReplaced?: string;
  nextServiceDate?: Date;
  meterReading?: number;
  notes?: string;
}

export interface UpdateServiceRecordInput {
  serviceType?: ServiceType;
  serviceDate?: Date;
  description?: string;
  performedBy?: string;
  cost?: number | null;
  partsReplaced?: string | null;
  nextServiceDate?: Date | null;
  meterReading?: number | null;
  notes?: string | null;
}

class ServiceRecordService {
  async create(
    equipmentId: string,
    input: CreateServiceRecordInput,
    createdById?: string,
  ): Promise<ServiceRecord> {
    const equipment = await prisma.equipment.findFirst({
      where: { id: equipmentId, deletedAt: null },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const record = await prisma.$transaction(async (tx) => {
      const created = await tx.serviceRecord.create({
        data: {
          equipmentId,
          serviceType: input.serviceType,
          serviceDate: input.serviceDate,
          description: input.description,
          performedBy: input.performedBy,
          cost: input.cost,
          partsReplaced: input.partsReplaced,
          nextServiceDate: input.nextServiceDate,
          meterReading: input.meterReading,
          notes: input.notes,
          createdById,
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });

      // Update equipment's lastServiceDate and nextServiceDate
      await tx.equipment.update({
        where: { id: equipmentId },
        data: {
          lastServiceDate: input.serviceDate,
          ...(input.nextServiceDate ? { nextServiceDate: input.nextServiceDate } : {}),
        },
      });

      return created;
    });

    logger.info({ serviceRecordId: record.id, equipmentId }, "Service record created");
    return record;
  }

  async getByEquipment(
    equipmentId: string,
    pagination: { skip: number; take: number },
    filters?: { serviceType?: ServiceType; from?: Date; to?: Date },
  ): Promise<{ data: ServiceRecord[]; total: number }> {
    const equipment = await prisma.equipment.findFirst({
      where: { id: equipmentId, deletedAt: null },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const where: Prisma.ServiceRecordWhereInput = {
      equipmentId,
      deletedAt: null,
    };

    if (filters?.serviceType) {
      where.serviceType = filters.serviceType;
    }

    if (filters?.from || filters?.to) {
      where.serviceDate = {};
      if (filters.from) where.serviceDate.gte = filters.from;
      if (filters.to) where.serviceDate.lte = filters.to;
    }

    const [data, total] = await Promise.all([
      prisma.serviceRecord.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { serviceDate: "desc" },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.serviceRecord.count({ where }),
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<ServiceRecord> {
    const record = await prisma.serviceRecord.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        equipment: {
          select: { id: true, name: true },
        },
      },
    });
    if (!record) {
      throw new NotFoundError("Service record");
    }
    return record;
  }

  async update(id: string, input: UpdateServiceRecordInput): Promise<ServiceRecord> {
    const existing = await prisma.serviceRecord.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundError("Service record");
    }

    const record = await prisma.serviceRecord.update({
      where: { id },
      data: input,
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    logger.info({ serviceRecordId: id }, "Service record updated");
    return record;
  }

  async delete(id: string): Promise<void> {
    const existing = await prisma.serviceRecord.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundError("Service record");
    }

    await prisma.serviceRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    logger.info({ serviceRecordId: id }, "Service record soft-deleted");
  }

  async getCostSummary(equipmentId: string): Promise<{
    totalCost: number;
    costByType: Record<string, number>;
    recordCount: number;
  }> {
    const equipment = await prisma.equipment.findFirst({
      where: { id: equipmentId, deletedAt: null },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const records = await prisma.serviceRecord.findMany({
      where: { equipmentId, deletedAt: null },
      select: { serviceType: true, cost: true },
    });

    const costByType: Record<string, number> = {};
    let totalCost = 0;

    for (const record of records) {
      const cost = record.cost ?? 0;
      totalCost += cost;
      costByType[record.serviceType] = (costByType[record.serviceType] ?? 0) + cost;
    }

    return {
      totalCost,
      costByType,
      recordCount: records.length,
    };
  }
}

export const serviceRecordService = new ServiceRecordService();
