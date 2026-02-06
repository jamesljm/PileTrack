import { db, type SyncQueueItem } from "./db";
import { api } from "./api-client";
import { MAX_RETRY } from "./constants";

const LAST_SYNC_KEY = "lastSyncTimestamp";

export class SyncEngine {
  async getLastSyncTimestamp(): Promise<string | null> {
    const meta = await db.syncMeta.get(LAST_SYNC_KEY);
    return meta?.value ?? null;
  }

  async setLastSyncTimestamp(timestamp: string): Promise<void> {
    await db.syncMeta.put({ key: LAST_SYNC_KEY, value: timestamp });
  }

  async addToSyncQueue(
    table: string,
    action: "CREATE" | "UPDATE" | "DELETE",
    recordId: string,
    clientId?: string,
    payload?: Record<string, unknown>,
  ): Promise<void> {
    await db.syncQueue.add({
      table,
      action,
      recordId,
      clientId,
      payload,
      status: "PENDING",
      timestamp: new Date().toISOString(),
      retryCount: 0,
    });
  }

  async getPendingCount(): Promise<number> {
    return db.syncQueue.where("status").equals("PENDING").count();
  }

  async pushPendingChanges(): Promise<{
    pushed: number;
    failed: number;
  }> {
    const pendingItems = await db.syncQueue
      .where("status")
      .equals("PENDING")
      .toArray();

    if (pendingItems.length === 0) {
      return { pushed: 0, failed: 0 };
    }

    let pushed = 0;
    let failed = 0;

    // Process in batches of 50
    const batchSize = 50;
    for (let i = 0; i < pendingItems.length; i += batchSize) {
      const batch = pendingItems.slice(i, i + batchSize);

      try {
        const payload = batch.map((item) => ({
          table: item.table,
          action: item.action,
          recordId: item.recordId,
          clientId: item.clientId,
          payload: item.payload,
          timestamp: item.timestamp,
        }));

        await api.post("/sync/push", { changes: payload });

        // Mark batch as synced
        const ids = batch
          .map((item) => item.id)
          .filter((id): id is number => id !== undefined);
        await db.syncQueue.bulkUpdate(
          ids.map((id) => ({
            key: id,
            changes: { status: "SYNCED" as const },
          })),
        );
        pushed += batch.length;
      } catch (error) {
        // Mark batch as failed with retry count increment
        for (const item of batch) {
          if (item.id === undefined) continue;
          const newRetryCount = item.retryCount + 1;
          if (newRetryCount >= MAX_RETRY) {
            await db.syncQueue.update(item.id, {
              status: "FAILED",
              retryCount: newRetryCount,
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            });
          } else {
            await db.syncQueue.update(item.id, {
              retryCount: newRetryCount,
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            });
          }
        }
        failed += batch.length;
      }
    }

    // Clean up synced items older than 24 hours
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await db.syncQueue
      .where("status")
      .equals("SYNCED")
      .and((item) => item.timestamp < cutoff)
      .delete();

    return { pushed, failed };
  }

  async pullChanges(): Promise<{
    pulled: number;
  }> {
    const lastSync = await this.getLastSyncTimestamp();
    const params: Record<string, string> = {};
    if (lastSync) {
      params.since = lastSync;
    }

    try {
      const response = await api.get<{
        data: {
          activities: Array<Record<string, unknown>>;
          equipment: Array<Record<string, unknown>>;
          materials: Array<Record<string, unknown>>;
          transfers: Array<Record<string, unknown>>;
          sites: Array<Record<string, unknown>>;
          syncTimestamp: string;
        };
      }>("/sync/pull", params);

      const { activities, equipment, materials, transfers, sites, syncTimestamp } =
        response.data;

      let pulled = 0;

      // Merge sites
      if (sites && sites.length > 0) {
        for (const site of sites) {
          await db.sites.put(site as any);
          pulled++;
        }
      }

      // Merge activities
      if (activities && activities.length > 0) {
        for (const activity of activities) {
          const existing = await db.activities.get(activity.id as string);
          if (existing && existing.syncStatus === "PENDING") {
            // Local pending changes take priority
            continue;
          }
          await db.activities.put({
            ...(activity as any),
            syncStatus: "SYNCED",
          });
          pulled++;
        }
      }

      // Merge equipment
      if (equipment && equipment.length > 0) {
        for (const item of equipment) {
          const existing = await db.equipment.get(item.id as string);
          if (existing && existing.syncStatus === "PENDING") {
            continue;
          }
          await db.equipment.put({
            ...(item as any),
            syncStatus: "SYNCED",
          });
          pulled++;
        }
      }

      // Merge materials
      if (materials && materials.length > 0) {
        for (const material of materials) {
          const existing = await db.materials.get(material.id as string);
          if (existing && existing.syncStatus === "PENDING") {
            continue;
          }
          await db.materials.put({
            ...(material as any),
            syncStatus: "SYNCED",
          });
          pulled++;
        }
      }

      // Merge transfers
      if (transfers && transfers.length > 0) {
        for (const transfer of transfers) {
          const existing = await db.transfers.get(transfer.id as string);
          if (existing && existing.syncStatus === "PENDING") {
            continue;
          }
          await db.transfers.put({
            ...(transfer as any),
            syncStatus: "SYNCED",
          });
          pulled++;
        }
      }

      await this.setLastSyncTimestamp(syncTimestamp);

      return { pulled };
    } catch (error) {
      console.error("Pull sync failed:", error);
      throw error;
    }
  }

  async fullSync(): Promise<{
    pushed: number;
    pulled: number;
    failed: number;
  }> {
    const pushResult = await this.pushPendingChanges();
    const pullResult = await this.pullChanges();

    return {
      pushed: pushResult.pushed,
      pulled: pullResult.pulled,
      failed: pushResult.failed,
    };
  }
}

export const syncEngine = new SyncEngine();
