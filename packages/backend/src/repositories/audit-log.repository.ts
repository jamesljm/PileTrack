import type { AuditLog } from "@prisma/client";
import { prisma } from "../config/database";

class AuditLogRepository {
  async createLog(data: {
    userId?: string | null;
    action: string;
    entityType: string;
    entityId: string;
    oldValues?: unknown;
    newValues?: unknown;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        userId: data.userId ?? null,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValues: data.oldValues as object | undefined,
        newValues: data.newValues as object | undefined,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  }

  async findByRecord(
    entityType: string,
    entityId: string,
    pagination: { skip: number; take: number } = { skip: 0, take: 50 },
  ): Promise<{ data: AuditLog[]; total: number }> {
    const where = { entityType, entityId };

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { data, total };
  }

  async findByUser(
    userId: string,
    pagination: { skip: number; take: number } = { skip: 0, take: 50 },
  ): Promise<{ data: AuditLog[]; total: number }> {
    const where = { userId };

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { data, total };
  }
}

export const auditLogRepository = new AuditLogRepository();
