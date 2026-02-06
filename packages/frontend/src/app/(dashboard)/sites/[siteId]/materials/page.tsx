"use client";

import { use } from "react";
import { useMaterials } from "@/queries/use-materials";
import { DataTable } from "@/components/tables/data-table";
import { materialColumns } from "@/components/tables/columns/material-columns";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function SiteMaterialsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useMaterials({ siteId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Materials</h1><p className="text-muted-foreground">Material stock levels for this site</p></div>
        <Link href={`/sites/${siteId}/materials/new`}><Button><Plus className="mr-2 h-4 w-4" />Add Material</Button></Link>
      </div>
      {isLoading ? <TableSkeleton /> : <DataTable columns={materialColumns} data={data?.data ?? []} searchKey="name" searchPlaceholder="Search materials..." />}
    </div>
  );
}
