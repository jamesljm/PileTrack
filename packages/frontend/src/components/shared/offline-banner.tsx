"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800 flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>You are offline. Changes will be saved locally and synced when connection is restored.</span>
    </div>
  );
}
