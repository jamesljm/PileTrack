"use client";

import { use } from "react";
import { useEquipment } from "@/queries/use-equipment";
import { DataTable } from "@/components/tables/data-table";
import { equipmentColumns } from "@/components/tables/columns/equipment-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";

export default function SiteEquipmentPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useEquipment({ siteId });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Site Equipment</h1><p className="text-muted-foreground">Equipment assigned to this site</p></div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable columns={equipmentColumns} data={data?.data ?? []} searchKey="name" searchPlaceholder="Search equipment..."
          filterOptions={[{ key: "category", label: "Category", options: Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })) }]}
        />
      )}
    </div>
  );
}
