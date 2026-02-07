"use client";

import { use } from "react";
import { usePiles } from "@/queries/use-piles";
import { DataTable } from "@/components/tables/data-table";
import { pileColumns } from "@/components/tables/columns/pile-columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { PILE_STATUS_COLORS, PILE_STATUS_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import Link from "next/link";
import { Plus, ChevronRight, ArrowLeft } from "lucide-react";
import type { Pile, PileStatus, ActivityType } from "@piletrack/shared";

function PileMobileCard({ item, siteId }: { item: Pile; siteId: string }) {
  return (
    <Link href={`/sites/${siteId}/piles/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{item.pileId}</p>
            <Badge className={`text-[10px] px-1.5 py-0 ${PILE_STATUS_COLORS[item.status as PileStatus] ?? ""}`}>
              {PILE_STATUS_LABELS[item.status as PileStatus] ?? item.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{ACTIVITY_TYPE_LABELS[item.pileType as ActivityType] ?? item.pileType}</span>
            {item.designLength && <><span>-</span><span>{item.designLength}m</span></>}
            {item.gridRef && <><span>-</span><span>{item.gridRef}</span></>}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SitePilesPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = usePiles({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link href={`/sites/${siteId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg md:text-2xl font-bold">Piles</h1>
        </div>
        <Link href={`/sites/${siteId}/piles/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Pile</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={pileColumns}
          data={data?.data ?? []}
          searchKey="pileId"
          searchPlaceholder="Search piles..."
          filterOptions={[{
            key: "status",
            label: "Status",
            options: [
              { value: "PLANNED", label: "Planned" },
              { value: "SET_UP", label: "Set Up" },
              { value: "BORED", label: "Bored" },
              { value: "CAGED", label: "Caged" },
              { value: "CONCRETED", label: "Concreted" },
              { value: "TESTED", label: "Tested" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ],
          }]}
          renderMobileCard={(item) => <PileMobileCard item={item as Pile} siteId={siteId} />}
        />
      )}
    </div>
  );
}
