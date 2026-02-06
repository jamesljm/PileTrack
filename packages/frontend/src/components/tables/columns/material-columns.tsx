"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import type { Material } from "@piletrack/shared";
import { cn } from "@/lib/utils";

export const materialColumns: ColumnDef<Material>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => row.getValue("category") ?? "-",
  },
  {
    accessorKey: "currentStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock = row.getValue("currentStock") as number;
      const minStock = row.original.minimumStock;
      const isLow = stock <= minStock;
      return (
        <span className={cn(isLow && "text-red-600 font-medium")}>
          {stock} {row.original.unit}
          {isLow && (
            <Badge variant="destructive" className="ml-2 text-[10px]">
              LOW
            </Badge>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "minimumStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min. Stock" />
    ),
    cell: ({ row }) =>
      `${row.getValue("minimumStock")} ${row.original.unit}`,
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => row.getValue("supplier") ?? "-",
  },
];
