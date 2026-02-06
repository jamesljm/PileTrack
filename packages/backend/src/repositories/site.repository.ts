import type { Site, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class SiteRepository extends BaseRepository<Site> {
  constructor() {
    super("site");
  }

  async findByCode(code: string): Promise<Site | null> {
    return prisma.site.findFirst({
      where: { code, deletedAt: null },
    });
  }

  async findUserSites(userId: string): Promise<Site[]> {
    const siteUsers = await prisma.siteUser.findMany({
      where: { userId },
      include: { site: true },
    });
    return siteUsers
      .map((su) => su.site)
      .filter((site) => site.deletedAt === null);
  }

  async findWithUsers(id: string): Promise<(Site & { siteUsers: unknown[] }) | null> {
    return prisma.site.findFirst({
      where: { id, deletedAt: null },
      include: {
        siteUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllFiltered(
    filter: {
      search?: string;
      status?: string;
      clientName?: string;
    },
    pagination: { skip: number; take: number },
    orderBy: Prisma.SiteOrderByWithRelationInput = { createdAt: "desc" },
  ): Promise<{ data: Site[]; total: number }> {
    const where: Prisma.SiteWhereInput = {
      deletedAt: null,
    };

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { code: { contains: filter.search, mode: "insensitive" } },
        { address: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.status) {
      where.status = filter.status as Site["status"];
    }

    if (filter.clientName) {
      where.clientName = { contains: filter.clientName, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
      prisma.site.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: {
          _count: {
            select: {
              siteUsers: true,
              activities: true,
              equipment: true,
              materials: true,
            },
          },
        },
      }),
      prisma.site.count({ where }),
    ]);

    return { data: data as Site[], total };
  }

  async assignUser(siteId: string, userId: string, siteRole?: string): Promise<void> {
    await prisma.siteUser.upsert({
      where: { userId_siteId: { userId, siteId } },
      create: { userId, siteId, siteRole },
      update: { siteRole },
    });
  }

  async removeUser(siteId: string, userId: string): Promise<void> {
    await prisma.siteUser.deleteMany({
      where: { userId, siteId },
    });
  }

  async getSiteUsers(siteId: string): Promise<unknown[]> {
    return prisma.siteUser.findMany({
      where: { siteId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            phone: true,
          },
        },
      },
    });
  }
}

export const siteRepository = new SiteRepository();
