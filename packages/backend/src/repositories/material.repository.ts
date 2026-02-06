import type { Material, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class MaterialRepository extends BaseRepository<Material> {
  constructor() {
    super("material");
  }

  async findBySite(
    siteId: string,
    pagination: { skip: number; take: number },
    filters?: {
      search?: string;
    },
  ): Promise<{ data: Material[]; total: number }> {
    const where: Prisma.MaterialWhereInput = {
      siteId,
      deletedAt: null,
    };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { supplier: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { name: "asc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.material.count({ where }),
    ]);

    return { data, total };
  }

  async findLowStock(
    siteId?: string,
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: Material[]; total: number }> {
    const where: Prisma.MaterialWhereInput = {
      deletedAt: null,
      ...(siteId ? { siteId } : {}),
    };

    // We need a raw comparison: currentStock <= minimumStock
    // Using Prisma's column reference
    const allLow = await prisma.material.findMany({
      where,
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    const lowStockItems = allLow.filter((m) => m.currentStock <= m.minimumStock);
    const total = lowStockItems.length;
    const data = lowStockItems.slice(pagination.skip, pagination.skip + pagination.take);

    return { data, total };
  }

  async findAllFiltered(
    filter: {
      search?: string;
      siteId?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Material[]; total: number }> {
    const where: Prisma.MaterialWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) {
      where.siteId = filter.siteId;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { supplier: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.material.count({ where }),
    ]);

    return { data, total };
  }
}

export const materialRepository = new MaterialRepository();
