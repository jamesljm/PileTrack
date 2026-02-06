import type { Transfer, TransferStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

const transferInclude = {
  fromSite: { select: { id: true, name: true, code: true } },
  toSite: { select: { id: true, name: true, code: true } },
  requestedBy: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
  approvedBy: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
  items: {
    include: {
      equipment: { select: { id: true, name: true, serialNumber: true } },
      material: { select: { id: true, name: true, unit: true } },
    },
  },
};

class TransferRepository extends BaseRepository<Transfer> {
  constructor() {
    super("transfer");
  }

  async findByStatus(
    status: TransferStatus,
    pagination: { skip: number; take: number },
  ): Promise<{ data: Transfer[]; total: number }> {
    const where: Prisma.TransferWhereInput = {
      status,
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: transferInclude,
      }),
      prisma.transfer.count({ where }),
    ]);

    return { data, total };
  }

  async findBySite(
    siteId: string,
    pagination: { skip: number; take: number },
    direction?: "from" | "to" | "both",
  ): Promise<{ data: Transfer[]; total: number }> {
    let where: Prisma.TransferWhereInput = { deletedAt: null };

    switch (direction) {
      case "from":
        where.fromSiteId = siteId;
        break;
      case "to":
        where.toSiteId = siteId;
        break;
      default:
        where.OR = [{ fromSiteId: siteId }, { toSiteId: siteId }];
    }

    const [data, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: transferInclude,
      }),
      prisma.transfer.count({ where }),
    ]);

    return { data, total };
  }

  async findByIdWithRelations(id: string): Promise<Transfer | null> {
    return prisma.transfer.findFirst({
      where: { id, deletedAt: null },
      include: transferInclude,
    });
  }

  async findAllFiltered(
    filter: {
      status?: TransferStatus;
      fromSiteId?: string;
      toSiteId?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Transfer[]; total: number }> {
    const where: Prisma.TransferWhereInput = { deletedAt: null };

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.fromSiteId) {
      where.fromSiteId = filter.fromSiteId;
    }

    if (filter.toSiteId) {
      where.toSiteId = filter.toSiteId;
    }

    const [data, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: transferInclude,
      }),
      prisma.transfer.count({ where }),
    ]);

    return { data, total };
  }
}

export const transferRepository = new TransferRepository();
