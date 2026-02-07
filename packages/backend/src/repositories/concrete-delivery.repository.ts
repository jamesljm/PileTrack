import type { ConcreteDelivery, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class ConcreteDeliveryRepository extends BaseRepository<ConcreteDelivery> {
  constructor() {
    super("concreteDelivery");
  }

  async findAllFiltered(
    filter: {
      siteId?: string;
      pileId?: string;
      from?: string;
      to?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: ConcreteDelivery[]; total: number }> {
    const where: Prisma.ConcreteDeliveryWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) where.siteId = filter.siteId;
    if (filter.pileId) where.pileId = filter.pileId;
    if (filter.from || filter.to) {
      where.deliveryDate = {};
      if (filter.from) (where.deliveryDate as any).gte = new Date(filter.from);
      if (filter.to) (where.deliveryDate as any).lte = new Date(filter.to);
    }

    const [data, total] = await Promise.all([
      prisma.concreteDelivery.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { deliveryDate: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          pile: { select: { id: true, pileId: true } },
        },
      }),
      prisma.concreteDelivery.count({ where }),
    ]);

    return { data, total };
  }
}

export const concreteDeliveryRepository = new ConcreteDeliveryRepository();
