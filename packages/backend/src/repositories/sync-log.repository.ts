import type { SyncLog, SyncAction } from "@prisma/client";
import { prisma } from "../config/database";

class SyncLogRepository {
  async createLog(data: {
    userId: string;
    clientId: string;
    action: SyncAction;
    entityType: string;
    entityId: string;
    payload: unknown;
  }): Promise<SyncLog> {
    return prisma.syncLog.create({
      data: {
        userId: data.userId,
        clientId: data.clientId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        payload: data.payload as object,
      },
    });
  }

  async findByClientId(clientId: string): Promise<SyncLog[]> {
    return prisma.syncLog.findMany({
      where: { clientId },
      orderBy: { appliedAt: "desc" },
    });
  }

  async findSince(
    sinceVersion: number,
    userId?: string,
  ): Promise<SyncLog[]> {
    return prisma.syncLog.findMany({
      where: {
        serverVersion: { gt: sinceVersion },
        ...(userId ? { userId: { not: userId } } : {}),
      },
      orderBy: { serverVersion: "asc" },
    });
  }

  async getLatestVersion(): Promise<number> {
    const latest = await prisma.syncLog.findFirst({
      orderBy: { serverVersion: "desc" },
      select: { serverVersion: true },
    });
    return latest?.serverVersion ?? 0;
  }

  async existsByClientId(clientId: string, entityType: string, entityId: string): Promise<boolean> {
    const count = await prisma.syncLog.count({
      where: { clientId, entityType, entityId },
    });
    return count > 0;
  }
}

export const syncLogRepository = new SyncLogRepository();
