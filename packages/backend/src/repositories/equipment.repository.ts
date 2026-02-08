import type { Equipment, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class EquipmentRepository extends BaseRepository<Equipment> {
  constructor() {
    super("equipment");
  }

  async findByQrCode(qrCode: string): Promise<Equipment | null> {
    return prisma.equipment.findFirst({
      where: { qrCode, deletedAt: null },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async findBySerialNumber(serialNumber: string): Promise<Equipment | null> {
    return prisma.equipment.findFirst({
      where: { serialNumber, deletedAt: null },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async findServiceDue(
    beforeDate?: Date,
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: Equipment[]; total: number }> {
    const where: Prisma.EquipmentWhereInput = {
      deletedAt: null,
      nextServiceDate: {
        lte: beforeDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default 30 days
      },
      status: { not: "DECOMMISSIONED" },
    };

    const [data, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { nextServiceDate: "asc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.equipment.count({ where }),
    ]);

    return { data, total };
  }

  async findBySite(
    siteId: string,
    pagination: { skip: number; take: number },
    filters?: {
      category?: string;
      status?: string;
      search?: string;
    },
  ): Promise<{ data: Equipment[]; total: number }> {
    const where: Prisma.EquipmentWhereInput = {
      siteId,
      deletedAt: null,
    };

    if (filters?.category) {
      where.category = filters.category as Equipment["category"];
    }

    if (filters?.status) {
      where.status = filters.status as Equipment["status"];
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { serialNumber: { contains: filters.search, mode: "insensitive" } },
        { manufacturer: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { name: "asc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.equipment.count({ where }),
    ]);

    return { data, total };
  }

  async findAllFiltered(
    filter: {
      search?: string;
      category?: string;
      status?: string;
      siteId?: string;
      unassigned?: boolean;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Equipment[]; total: number }> {
    const where: Prisma.EquipmentWhereInput = {
      deletedAt: null,
    };

    if (filter.unassigned) {
      where.siteId = null;
    } else if (filter.siteId) {
      where.siteId = filter.siteId;
    }

    if (filter.category) {
      where.category = filter.category as Equipment["category"];
    }

    if (filter.status) {
      where.status = filter.status as Equipment["status"];
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { serialNumber: { contains: filter.search, mode: "insensitive" } },
        { manufacturer: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.equipment.count({ where }),
    ]);

    return { data, total };
  }
}

export const equipmentRepository = new EquipmentRepository();
