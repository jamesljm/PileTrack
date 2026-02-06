"use client";

import { use } from "react";
import { useMaterials } from "@/queries/use-materials";
import { DataTable } from "@/components/tables/data-table";
import { materialColumns } from "@/components/tables/columns/material-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function SiteMaterialsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useMaterials({ siteId });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Materials</h1><p className="text-muted-foreground">Material stock levels for this site</p></div>
      {isLoading ? <TableSkeleton /> : <DataTable columns={materialColumns} data={data?.data ?? []} searchKey="name" searchPlaceholder="Search materials..." />}
    </div>
  );
}
