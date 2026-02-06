"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_COLORS } from "@/lib/constants";
import type { ActivitySummary } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const activityColumns: ColumnDef<ActivitySummary>[] = [
  {
    accessorKey: "activityDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => format(new Date(row.getValue("activityDate")), "dd MMM yyyy"),
  },
  {
    accessorKey: "activityType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("activityType") as string;
      return (
        <Badge variant="outline">
          {ACTIVITY_TYPE_LABELS[type as keyof typeof ACTIVITY_TYPE_LABELS] ?? type}
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
        <Badge className={ACTIVITY_STATUS_COLORS[status as keyof typeof ACTIVITY_STATUS_COLORS] ?? ""}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    id: "siteName",
    accessorFn: (row: any) => row.site?.name ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Site" />
    ),
  },
  {
    id: "createdByName",
    accessorFn: (row: any) => row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <Link href={`/sites/${activity.siteId}/activities/${activity.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      );
    },
  },
];
