"use client";

import { use } from "react";
import { useMaterials } from "@/queries/use-materials";
import { DataTable } from "@/components/tables/data-table";
import { materialColumns } from "@/components/tables/columns/material-columns";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus, AlertTriangle, ChevronRight } from "lucide-react";
import type { Material } from "@piletrack/shared";

function MaterialMobileCard({ item, siteId }: { item: Material; siteId: string }) {
  const isLowStock = item.currentStock <= item.minimumStock;

  return (
    <Link href={`/sites/${siteId}/materials/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{item.name}</p>
            {isLowStock && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{item.code}</span>
            {item.category && (
              <>
                <span>-</span>
                <span>{item.category}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className={isLowStock ? "text-destructive font-semibold" : "text-foreground font-medium"}>
              {item.currentStock} {item.unit}
            </span>
            <span className="text-muted-foreground">min: {item.minimumStock}</span>
            {item.unitPrice && (
              <span className="text-muted-foreground">${item.unitPrice}/{item.unit}</span>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function SiteMaterialsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useMaterials({ siteId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Materials</h1>
        <Link href={`/sites/${siteId}/materials/new`}>
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Add Material</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={materialColumns}
          data={data?.data ?? []}
          searchKey="name"
          searchPlaceholder="Search materials..."
          renderMobileCard={(item) => <MaterialMobileCard item={item as Material} siteId={siteId} />}
        />
      )}
    </div>
  );
}
