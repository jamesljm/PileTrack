import type { User, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super("user");
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findByIdWithSites(id: string): Promise<User & { siteUsers: unknown[] } | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        siteUsers: {
          include: { site: true },
        },
      },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
        deletedAt: null,
      },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async findAllFiltered(
    filter: {
      search?: string;
      role?: string;
      status?: string;
      siteId?: string;
    },
    pagination: { skip: number; take: number },
    orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: "desc" },
  ): Promise<{ data: User[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (filter.search) {
      where.OR = [
        { firstName: { contains: filter.search, mode: "insensitive" } },
        { lastName: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.role) {
      where.role = filter.role as User["role"];
    }

    if (filter.status) {
      where.status = filter.status as User["status"];
    }

    if (filter.siteId) {
      where.siteUsers = {
        some: { siteId: filter.siteId },
      };
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          avatarUrl: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          passwordHash: false,
          resetToken: false,
          resetTokenExp: false,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data: data as unknown as User[], total };
  }
}

export const userRepository = new UserRepository();
