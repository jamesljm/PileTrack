"use client";

import { useMemo } from "react";
import { usePiles, useUpdatePileStatus } from "@/queries/use-piles";
import { KanbanBoard, type KanbanColumn } from "./kanban-board";
import { KanbanCard } from "./kanban-card";
import {
  PILE_STATUS_LABELS,
  PILE_STATUS_COLORS,
  ACTIVITY_TYPE_LABELS,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import type { PileSummary } from "@piletrack/shared";

// ─── Column definitions ──────────────────────────────────────────────────────

const PILE_KANBAN_COLUMNS: {
  id: string;
  title: string;
  color: string;
}[] = [
  { id: "PLANNED", title: "Planned", color: "border-slate-400" },
  { id: "SET_UP", title: "Set Up", color: "border-blue-400" },
  { id: "BORED", title: "Bored", color: "border-amber-400" },
  { id: "CAGED", title: "Caged", color: "border-violet-400" },
  { id: "CONCRETED", title: "Concreted", color: "border-orange-400" },
  { id: "TESTED", title: "Tested", color: "border-cyan-400" },
  { id: "APPROVED", title: "Approved", color: "border-green-500" },
  { id: "REJECTED", title: "Rejected", color: "border-red-500" },
];

// ─── PileKanban ──────────────────────────────────────────────────────────────

export function PileKanban({ siteId }: { siteId: string }) {
  const { data, isLoading } = usePiles({ siteId, pageSize: 200 });
  const updatePileStatus = useUpdatePileStatus();

  const columns: KanbanColumn<PileSummary>[] = useMemo(() => {
    const piles = data?.data ?? [];

    return PILE_KANBAN_COLUMNS.map((col) => ({
      ...col,
      items: piles.filter((p) => p.status === col.id),
    }));
  }, [data]);

  const handleDragEnd = (
    itemId: string,
    _fromColumn: string,
    toColumn: string,
  ) => {
    updatePileStatus.mutate({ id: itemId, status: toColumn });
  };

  if (isLoading) {
    return <CardsSkeleton count={8} />;
  }

  return (
    <KanbanBoard<PileSummary>
      columns={columns}
      onDragEnd={handleDragEnd}
      renderCard={(pile) => (
        <KanbanCard key={pile.id} id={pile.id}>
          <div className="space-y-1.5">
            {/* Pile ID */}
            <p className="text-sm font-bold">{pile.pileId}</p>

            {/* Pile type badge */}
            <Badge
              className={
                PILE_STATUS_COLORS[pile.status as keyof typeof PILE_STATUS_COLORS] ??
                "bg-gray-100 text-gray-800"
              }
            >
              {ACTIVITY_TYPE_LABELS[
                pile.pileType as keyof typeof ACTIVITY_TYPE_LABELS
              ] ?? pile.pileType}
            </Badge>

            {/* Design dimensions */}
            {(pile.designLength != null || pile.designDiameter != null) && (
              <p className="text-xs text-muted-foreground">
                {pile.designLength != null
                  ? `${Number(pile.designLength).toFixed(1)}m`
                  : "—"}
                {" \u00D7 "}
                {pile.designDiameter != null
                  ? `${pile.designDiameter}mm`
                  : "—"}
              </p>
            )}

            {/* Overconsumption */}
            {pile.overconsumption != null && (
              <p
                className={`text-xs font-medium ${
                  Number(pile.overconsumption) > 15
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                Overconsumption: {Number(pile.overconsumption).toFixed(1)}%
              </p>
            )}
          </div>
        </KanbanCard>
      )}
    />
  );
}
