"use client";

import { useEffect, useRef, useCallback } from "react";
import { syncEngine } from "@/lib/sync-engine";
import { useSyncStore } from "@/stores/sync-store";
import { useAuthStore } from "@/stores/auth-store";
import { SYNC_INTERVAL } from "@/lib/constants";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { setSyncing, setPendingCount, setLastSync, setError } =
    useSyncStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isOnlineRef = useRef(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  const performSync = useCallback(async () => {
    if (!isOnlineRef.current || !isAuthenticated) return;

    try {
      setSyncing(true);
      setError(null);

      const result = await syncEngine.fullSync();

      const pendingCount = await syncEngine.getPendingCount();
      setPendingCount(pendingCount);
      setLastSync(new Date().toISOString());

      if (result.failed > 0) {
        setError(`${result.failed} change(s) failed to sync`);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Sync failed",
      );
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, setSyncing, setPendingCount, setLastSync, setError]);

  // Update pending count on mount
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const count = await syncEngine.getPendingCount();
        setPendingCount(count);
      } catch {
        // IndexedDB might not be available
      }
    };
    updatePendingCount();
  }, [setPendingCount]);

  // Set up periodic sync
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial sync
    performSync();

    // Periodic sync
    intervalRef.current = setInterval(performSync, SYNC_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, performSync]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      isOnlineRef.current = true;
      performSync();
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [performSync]);

  return <>{children}</>;
}
