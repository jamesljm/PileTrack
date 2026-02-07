import type { BoreholeLog, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class BoreholeLogRepository extends BaseRepository<BoreholeLog> {
  constructor() {
    super("boreholeLog");
  }

  async findAllFiltered(
    filter: {
      siteId?: string;
      search?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: BoreholeLog[]; total: number }> {
    const where: Prisma.BoreholeLogWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) where.siteId = filter.siteId;
    if (filter.search) {
      where.OR = [
        { boreholeId: { contains: filter.search, mode: "insensitive" } },
        { location: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.boreholeLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { logDate: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.boreholeLog.count({ where }),
    ]);

    return { data, total };
  }
}

export const boreholeLogRepository = new BoreholeLogRepository();
