import type { NCR, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class NCRRepository extends BaseRepository<NCR> {
  constructor() {
    super("nCR");
  }

  async findAllFiltered(
    filter: {
      siteId?: string;
      status?: string;
      priority?: string;
      category?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: NCR[]; total: number }> {
    const where: Prisma.NCRWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) where.siteId = filter.siteId;
    if (filter.status) where.status = filter.status as any;
    if (filter.priority) where.priority = filter.priority as any;
    if (filter.category) where.category = filter.category as any;

    const [data, total] = await Promise.all([
      prisma.nCR.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          raisedBy: { select: { id: true, firstName: true, lastName: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          closedBy: { select: { id: true, firstName: true, lastName: true } },
          pile: { select: { id: true, pileId: true } },
        },
      }),
      prisma.nCR.count({ where }),
    ]);

    return { data, total };
  }

  async getNextNcrNumber(siteId: string): Promise<string> {
    const count = await prisma.nCR.count({ where: { siteId } });
    const site = await prisma.site.findUnique({ where: { id: siteId }, select: { code: true } });
    const siteCode = site?.code ?? "SITE";
    return `NCR-${siteCode}-${String(count + 1).padStart(3, "0")}`;
  }
}

export const ncrRepository = new NCRRepository();
