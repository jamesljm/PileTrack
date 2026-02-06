import { create } from "zustand";

interface SyncState {
  pendingCount: number;
  lastSyncAt: string | null;
  isSyncing: boolean;
  syncError: string | null;
  setSyncing: (syncing: boolean) => void;
  setPendingCount: (count: number) => void;
  setLastSync: (timestamp: string) => void;
  setError: (error: string | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  pendingCount: 0,
  lastSyncAt: null,
  isSyncing: false,
  syncError: null,

  setSyncing: (syncing: boolean) => set({ isSyncing: syncing }),

  setPendingCount: (count: number) => set({ pendingCount: count }),

  setLastSync: (timestamp: string) =>
    set({ lastSyncAt: timestamp, syncError: null }),

  setError: (error: string | null) => set({ syncError: error }),
}));
