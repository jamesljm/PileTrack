"use client";

import { use } from "react";
import { useEquipment } from "@/queries/use-equipment";
import { DataTable } from "@/components/tables/data-table";
import { equipmentColumns } from "@/components/tables/columns/equipment-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
} from "@/lib/constants";
import Link from "next/link";
import { Plus, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import type { Equipment, EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@piletrack/shared";

function SiteEquipmentMobileCard({ item, siteId }: { item: Equipment; siteId: string }) {
  const isServiceDue = item.nextServiceDate && new Date(item.nextServiceDate) < new Date();

  return (
    <Link href={`/sites/${siteId}/equipment/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{item.name}</p>
            {isServiceDue && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{item.code}</span>
            <span>-</span>
            <span>{EQUIPMENT_CATEGORY_LABELS[item.category as EquipmentCategory]}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-[10px] px-1.5 py-0 ${EQUIPMENT_STATUS_COLORS[item.status as EquipmentStatus]}`}>
              {item.status.replace(/_/g, " ")}
            </Badge>
            {(item as any).condition && (
              <Badge className={`text-[10px] px-1.5 py-0 ${EQUIPMENT_CONDITION_COLORS[(item as any).condition as EquipmentCondition] ?? ""}`}>
                {EQUIPMENT_CONDITION_LABELS[(item as any).condition as EquipmentCondition] ?? (item as any).condition}
              </Badge>
            )}
            {(item as any).totalUsageHours > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {(item as any).totalUsageHours.toFixed(0)}h
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteEquipmentPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useEquipment({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Site Equipment</h1>
        <Link href={`/sites/${siteId}/equipment/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Add Equipment</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={equipmentColumns}
          data={data?.data ?? []}
          searchKey="name"
          searchPlaceholder="Search equipment..."
          filterOptions={[{ key: "category", label: "Category", options: Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) }]}
          renderMobileCard={(item) => <SiteEquipmentMobileCard item={item as Equipment} siteId={siteId} />}
        />
      )}
    </div>
  );
}
