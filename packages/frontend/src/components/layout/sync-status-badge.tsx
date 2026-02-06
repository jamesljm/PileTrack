"use client";

import { RefreshCw, Check, AlertCircle, WifiOff, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSyncStore } from "@/stores/sync-store";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useSync } from "@/hooks/use-sync";
import { cn } from "@/lib/utils";

export function SyncStatusBadge() {
  const { pendingCount, isSyncing, syncError } = useSyncStore();
  const isOnline = useOnlineStatus();
  const { triggerSync } = useSync();

  if (!isOnline) {
    return (
      <Badge
        variant="outline"
        className="gap-1 bg-red-50 text-red-700 border-red-200"
      >
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    );
  }

  if (isSyncing) {
    return (
      <Badge
        variant="outline"
        className="gap-1 bg-blue-50 text-blue-700 border-blue-200"
      >
        <RefreshCw className="h-3 w-3 animate-spin" />
        Syncing
      </Badge>
    );
  }

  if (syncError) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0"
        onClick={() => triggerSync()}
      >
        <Badge
          variant="outline"
          className="gap-1 bg-red-50 text-red-700 border-red-200 cursor-pointer"
        >
          <AlertCircle className="h-3 w-3" />
          Sync Error
        </Badge>
      </Button>
    );
  }

  if (pendingCount > 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0"
        onClick={() => triggerSync()}
      >
        <Badge
          variant="outline"
          className={cn(
            "gap-1 cursor-pointer",
            "bg-yellow-50 text-yellow-700 border-yellow-200",
          )}
        >
          <Clock className="h-3 w-3" />
          {pendingCount} pending
        </Badge>
      </Button>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 bg-green-50 text-green-700 border-green-200"
    >
      <Check className="h-3 w-3" />
      Synced
    </Badge>
  );
}
