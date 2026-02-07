"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DAILY_LOG_STATUS_COLORS } from "@/lib/constants";
import type { DailyLog, DailyLogStatus } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const dailyLogColumns: ColumnDef<DailyLog>[] = [
  {
    accessorKey: "logDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const d = row.getValue("logDate");
      return d ? format(new Date(d as string), "dd MMM yyyy") : "-";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={DAILY_LOG_STATUS_COLORS[status as DailyLogStatus] ?? ""}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    id: "workforceTotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workforce" />
    ),
    cell: ({ row }) => {
      const workforce = row.original.workforce ?? [];
      const total = workforce.reduce((sum, w) => sum + (w.headcount ?? 0), 0);
      return <span>{total} pax</span>;
    },
  },
  {
    id: "safetySummary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Safety" />
    ),
    cell: ({ row }) => {
      const safety = row.original.safety;
      if (!safety) return <span className="text-muted-foreground">-</span>;
      const incidents = safety.incidents?.length ?? 0;
      const nearMisses = safety.nearMisses?.length ?? 0;
      if (incidents === 0 && nearMisses === 0) {
        return <span className="text-green-600 text-xs">OK</span>;
      }
      return (
        <span className="text-xs">
          {incidents > 0 && <Badge variant="destructive" className="text-[10px] mr-1">{incidents} inc</Badge>}
          {nearMisses > 0 && <Badge className="text-[10px] bg-yellow-100 text-yellow-800">{nearMisses} NM</Badge>}
        </span>
      );
    },
  },
  {
    id: "createdByName",
    accessorFn: (row: any) =>
      row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;
      return (
        <Link href={`/sites/${log.siteId}/daily-logs/${log.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      );
    },
  },
];
