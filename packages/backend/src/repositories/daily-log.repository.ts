import type { DailyLog, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class DailyLogRepository extends BaseRepository<DailyLog> {
  constructor() {
    super("dailyLog");
  }

  async findAllFiltered(
    filter: {
      siteId?: string;
      status?: string;
      from?: string;
      to?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: DailyLog[]; total: number }> {
    const where: Prisma.DailyLogWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) where.siteId = filter.siteId;
    if (filter.status) where.status = filter.status as any;
    if (filter.from || filter.to) {
      where.logDate = {};
      if (filter.from) (where.logDate as any).gte = new Date(filter.from);
      if (filter.to) (where.logDate as any).lte = new Date(filter.to);
    }

    const [data, total] = await Promise.all([
      prisma.dailyLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { logDate: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          approvedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.dailyLog.count({ where }),
    ]);

    return { data, total };
  }
}

export const dailyLogRepository = new DailyLogRepository();
