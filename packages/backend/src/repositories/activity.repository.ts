import type { ActivityRecord, Prisma, ActivityStatus, ActivityType } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class ActivityRepository extends BaseRepository<ActivityRecord> {
  constructor() {
    super("activityRecord");
  }

  async findBySite(
    siteId: string,
    pagination: { skip: number; take: number },
    filters?: {
      activityType?: ActivityType;
      status?: ActivityStatus;
      from?: Date;
      to?: Date;
    },
  ): Promise<{ data: ActivityRecord[]; total: number }> {
    const where: Prisma.ActivityRecordWhereInput = {
      siteId,
      deletedAt: null,
    };

    if (filters?.activityType) {
      where.activityType = filters.activityType;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.from || filters?.to) {
      where.activityDate = {};
      if (filters.from) {
        where.activityDate.gte = filters.from;
      }
      if (filters.to) {
        where.activityDate.lte = filters.to;
      }
    }

    const [data, total] = await Promise.all([
      prisma.activityRecord.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { activityDate: "desc" },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          approvedBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          site: {
            select: { id: true, name: true, code: true },
          },
        },
      }),
      prisma.activityRecord.count({ where }),
    ]);

    return { data, total };
  }

  async findPendingApproval(
    siteIds?: string[],
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: ActivityRecord[]; total: number }> {
    const where: Prisma.ActivityRecordWhereInput = {
      status: "SUBMITTED",
      deletedAt: null,
      ...(siteIds && siteIds.length > 0 ? { siteId: { in: siteIds } } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.activityRecord.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "asc" },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          site: {
            select: { id: true, name: true, code: true },
          },
        },
      }),
      prisma.activityRecord.count({ where }),
    ]);

    return { data, total };
  }

  async findByDateRange(
    from: Date,
    to: Date,
    siteId?: string,
  ): Promise<ActivityRecord[]> {
    return prisma.activityRecord.findMany({
      where: {
        activityDate: { gte: from, lte: to },
        deletedAt: null,
        ...(siteId ? { siteId } : {}),
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
      orderBy: { activityDate: "desc" },
    });
  }

  async findByIdWithRelations(id: string): Promise<ActivityRecord | null> {
    return prisma.activityRecord.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        approvedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async findByClientId(clientId: string): Promise<ActivityRecord | null> {
    return prisma.activityRecord.findFirst({
      where: { clientId, deletedAt: null },
    });
  }
}

export const activityRepository = new ActivityRepository();
