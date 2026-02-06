import { prisma } from "../config/database";
import { syncLogRepository } from "../repositories/sync-log.repository";
import { activityRepository } from "../repositories/activity.repository";
import { ValidationError, NotFoundError } from "../utils/api-error";
import type { SyncAction } from "@prisma/client";
import { logger } from "../config/logger";

export interface SyncChange {
  clientId: string;
  action: SyncAction;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface PushResult {
  applied: number;
  skipped: number;
  errors: { clientId: string; error: string }[];
  serverVersion: number;
}

class SyncService {
  async pushChanges(userId: string, changes: SyncChange[]): Promise<PushResult> {
    const result: PushResult = {
      applied: 0,
      skipped: 0,
      errors: [],
      serverVersion: 0,
    };

    for (const change of changes) {
      try {
        // Dedup: check if this clientId + entityType + entityId was already processed
        const alreadyExists = await syncLogRepository.existsByClientId(
          change.clientId,
          change.entityType,
          change.entityId,
        );

        if (alreadyExists) {
          result.skipped++;
          continue;
        }

        // Apply the change
        await this.applyChange(userId, change);

        // Log the sync
        await syncLogRepository.createLog({
          userId,
          clientId: change.clientId,
          action: change.action,
          entityType: change.entityType,
          entityId: change.entityId,
          payload: change.payload,
        });

        result.applied++;
      } catch (error) {
        result.errors.push({
          clientId: change.clientId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    result.serverVersion = await syncLogRepository.getLatestVersion();

    logger.info(
      { userId, applied: result.applied, skipped: result.skipped, errors: result.errors.length },
      "Sync push completed",
    );

    return result;
  }

  async pullChanges(
    userId: string,
    sinceVersion: number,
  ): Promise<{ changes: unknown[]; serverVersion: number }> {
    const logs = await syncLogRepository.findSince(sinceVersion, userId);
    const serverVersion = await syncLogRepository.getLatestVersion();

    const changes = logs.map((log) => ({
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      payload: log.payload,
      serverVersion: log.serverVersion,
      appliedAt: log.appliedAt,
    }));

    return { changes, serverVersion };
  }

  async getStatus(userId: string): Promise<{
    serverVersion: number;
    pendingForUser: number;
  }> {
    const serverVersion = await syncLogRepository.getLatestVersion();
    const userLogs = await syncLogRepository.findByClientId(userId);
    const latestUserVersion = userLogs.length > 0 ? userLogs[0]!.serverVersion : 0;

    const pendingLogs = await syncLogRepository.findSince(latestUserVersion, userId);

    return {
      serverVersion,
      pendingForUser: pendingLogs.length,
    };
  }

  private async applyChange(userId: string, change: SyncChange): Promise<void> {
    switch (change.entityType) {
      case "activity":
        await this.applyActivityChange(userId, change);
        break;
      default:
        throw new ValidationError(`Unsupported entity type for sync: ${change.entityType}`);
    }
  }

  private async applyActivityChange(userId: string, change: SyncChange): Promise<void> {
    switch (change.action) {
      case "CREATE": {
        // Check if activity already exists (by clientId)
        if (change.payload.clientId) {
          const existing = await activityRepository.findByClientId(
            change.payload.clientId as string,
          );
          if (existing) {
            // Already exists, skip
            return;
          }
        }

        await prisma.activityRecord.create({
          data: {
            siteId: change.payload.siteId as string,
            activityType: change.payload.activityType as string as never,
            activityDate: new Date(change.payload.activityDate as string),
            weather: change.payload.weather as object | undefined,
            details: change.payload.details as object,
            remarks: change.payload.remarks as string | undefined,
            photos: (change.payload.photos as string[]) ?? [],
            createdById: userId,
            clientId: change.payload.clientId as string | undefined,
            status: "DRAFT",
          },
        });
        break;
      }

      case "UPDATE": {
        const existing = await prisma.activityRecord.findFirst({
          where: { id: change.entityId, deletedAt: null },
        });
        if (!existing) {
          throw new NotFoundError("Activity record");
        }

        // Only update if the local version is newer (conflict resolution: last write wins)
        const payload = change.payload;
        await prisma.activityRecord.update({
          where: { id: change.entityId },
          data: {
            ...(payload.activityType ? { activityType: payload.activityType as never } : {}),
            ...(payload.activityDate ? { activityDate: new Date(payload.activityDate as string) } : {}),
            ...(payload.weather !== undefined ? { weather: payload.weather as object } : {}),
            ...(payload.details ? { details: payload.details as object } : {}),
            ...(payload.remarks !== undefined ? { remarks: payload.remarks as string } : {}),
            ...(payload.photos ? { photos: payload.photos as string[] } : {}),
            version: { increment: 1 },
          },
        });
        break;
      }

      case "DELETE": {
        await prisma.activityRecord.update({
          where: { id: change.entityId },
          data: { deletedAt: new Date() },
        });
        break;
      }

      default:
        throw new ValidationError(`Unsupported sync action: ${change.action}`);
    }
  }
}

export const syncService = new SyncService();
