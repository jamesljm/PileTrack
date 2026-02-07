"use client";

import { useMemo } from "react";
import { useNCRs, useInvestigateNCR, useResolveNCR, useCloseNCR } from "@/queries/use-ncrs";
import { KanbanBoard, type KanbanColumn } from "./kanban-board";
import { KanbanCard } from "./kanban-card";
import {
  NCR_STATUS_LABELS,
  NCR_PRIORITY_COLORS,
  NCR_CATEGORY_LABELS,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import type { NCRSummary } from "@piletrack/shared";

// ─── Column definitions ──────────────────────────────────────────────────────

const NCR_KANBAN_COLUMNS: {
  id: string;
  title: string;
  color: string;
}[] = [
  { id: "OPEN", title: "Open", color: "border-red-400" },
  { id: "INVESTIGATING", title: "Investigating", color: "border-amber-400" },
  { id: "ACTION_REQUIRED", title: "Action Required", color: "border-orange-400" },
  { id: "RESOLVED", title: "Resolved", color: "border-blue-400" },
  { id: "CLOSED", title: "Closed", color: "border-green-500" },
];

// ─── NCRKanban ───────────────────────────────────────────────────────────────

export function NCRKanban({ siteId }: { siteId: string }) {
  const { data, isLoading } = useNCRs({ siteId, pageSize: 100 });
  const investigateNCR = useInvestigateNCR();
  const resolveNCR = useResolveNCR();
  const closeNCR = useCloseNCR();

  const columns: KanbanColumn<NCRSummary>[] = useMemo(() => {
    const ncrs = data?.data ?? [];

    return NCR_KANBAN_COLUMNS.map((col) => ({
      ...col,
      items: ncrs.filter((n) => n.status === col.id),
    }));
  }, [data]);

  const handleDragEnd = (
    itemId: string,
    _fromColumn: string,
    toColumn: string,
  ) => {
    // Call the appropriate mutation based on the target status column.
    // The backend validates whether the transition is legal.
    switch (toColumn) {
      case "INVESTIGATING":
        investigateNCR.mutate(itemId);
        break;
      case "RESOLVED":
        resolveNCR.mutate({ id: itemId, data: {} });
        break;
      case "CLOSED":
        closeNCR.mutate(itemId);
        break;
      default:
        // For OPEN and ACTION_REQUIRED there is no dedicated mutation;
        // the backend will reject invalid transitions if needed.
        break;
    }
  };

  if (isLoading) {
    return <CardsSkeleton count={5} />;
  }

  return (
    <KanbanBoard<NCRSummary>
      columns={columns}
      onDragEnd={handleDragEnd}
      renderCard={(ncr) => (
        <KanbanCard key={ncr.id} id={ncr.id}>
          <div className="space-y-1.5">
            {/* NCR number */}
            <p className="text-sm font-bold">{ncr.ncrNumber}</p>

            {/* Title (truncated) */}
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {ncr.title}
            </p>

            {/* Priority badge */}
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                className={
                  NCR_PRIORITY_COLORS[
                    ncr.priority as keyof typeof NCR_PRIORITY_COLORS
                  ] ?? "bg-gray-100 text-gray-800"
                }
              >
                {ncr.priority}
              </Badge>

              {/* Category badge */}
              <Badge variant="outline">
                {NCR_CATEGORY_LABELS[
                  ncr.category as keyof typeof NCR_CATEGORY_LABELS
                ] ?? ncr.category}
              </Badge>
            </div>

            {/* Due date */}
            {ncr.dueDate && (
              <p
                className={`text-xs font-medium ${
                  new Date(ncr.dueDate) < new Date()
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                Due: {new Date(ncr.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </KanbanCard>
      )}
    />
  );
}
