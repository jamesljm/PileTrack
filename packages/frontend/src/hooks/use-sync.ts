"use client";

import { useCallback } from "react";
import { syncEngine } from "@/lib/sync-engine";
import { useSyncStore } from "@/stores/sync-store";

export function useSync() {
  const { pendingCount, lastSyncAt, isSyncing, syncError, setSyncing, setPendingCount, setLastSync, setError } =
    useSyncStore();

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;

    try {
      setSyncing(true);
      setError(null);

      const result = await syncEngine.fullSync();

      const pending = await syncEngine.getPendingCount();
      setPendingCount(pending);
      setLastSync(new Date().toISOString());

      if (result.failed > 0) {
        setError(`${result.failed} change(s) failed to sync`);
      }

      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sync failed");
      throw error;
    } finally {
      setSyncing(false);
    }
  }, [isSyncing, setSyncing, setPendingCount, setLastSync, setError]);

  return {
    triggerSync,
    pendingCount,
    lastSyncAt,
    isSyncing,
    syncError,
  };
}
