"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
} from "@/lib/constants";
import type { Equipment } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle } from "lucide-react";

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
    accessorKey: "condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition" />
    ),
    cell: ({ row }) => {
      const condition = row.getValue("condition") as string | undefined;
      if (!condition) return <span className="text-muted-foreground">-</span>;
      return (
        <Badge className={EQUIPMENT_CONDITION_COLORS[condition as keyof typeof EQUIPMENT_CONDITION_COLORS] ?? ""}>
          {EQUIPMENT_CONDITION_LABELS[condition as keyof typeof EQUIPMENT_CONDITION_LABELS] ?? condition}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalUsageHours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hours" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue("totalUsageHours") as number | undefined;
      return <span>{hours != null ? hours.toFixed(1) : "-"}</span>;
    },
  },
  {
    id: "site",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Site" />
    ),
    cell: ({ row }) => {
      const site = (row.original as any).site as { id: string; name: string; code: string } | null;
      return site ? (
        <Link href={`/sites/${site.id}`} className="text-primary hover:underline">
          {site.name}
        </Link>
      ) : (
        <span className="text-muted-foreground">Unassigned</span>
      );
    },
  },
  {
    id: "lastService",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Service" />
    ),
    cell: ({ row }) => {
      const eq = row.original;
      const lastServiceDate = eq.lastServiceDate;
      const nextServiceDate = eq.nextServiceDate;

      if (!lastServiceDate) return <span className="text-muted-foreground">-</span>;

      const isOverdue = nextServiceDate && new Date(nextServiceDate) < new Date();

      return (
        <div className="flex items-center gap-1">
          <span>{new Date(lastServiceDate).toLocaleDateString()}</span>
          {isOverdue && (
            <AlertTriangle className="h-3 w-3 text-destructive" />
          )}
        </div>
      );
    },
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
