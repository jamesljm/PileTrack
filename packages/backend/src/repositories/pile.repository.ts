import type { Pile, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class PileRepository extends BaseRepository<Pile> {
  constructor() {
    super("pile");
  }

  async findAllFiltered(
    filter: {
      siteId?: string;
      status?: string;
      pileType?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Pile[]; total: number }> {
    const where: Prisma.PileWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) where.siteId = filter.siteId;
    if (filter.status) where.status = filter.status as any;
    if (filter.pileType) where.pileType = filter.pileType as any;

    const [data, total] = await Promise.all([
      prisma.pile.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.pile.count({ where }),
    ]);

    return { data, total };
  }
}

export const pileRepository = new PileRepository();
