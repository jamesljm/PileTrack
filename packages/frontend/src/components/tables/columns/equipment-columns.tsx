"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
} from "@/lib/constants";
import type { Equipment } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const equipmentColumns: ColumnDef<Equipment>[] = [
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
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant="outline">
          {EQUIPMENT_CATEGORY_LABELS[category as keyof typeof EQUIPMENT_CATEGORY_LABELS] ?? category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={EQUIPMENT_STATUS_COLORS[status as keyof typeof EQUIPMENT_STATUS_COLORS] ?? ""}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "manufacturer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Manufacturer" />
    ),
    cell: ({ row }) => row.getValue("manufacturer") ?? "-",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const equipment = row.original;
      return (
        <Link
          href={
            equipment.siteId
              ? `/sites/${equipment.siteId}/equipment/${equipment.id}`
              : `/equipment`
          }
        >
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      );
    },
  },
];
