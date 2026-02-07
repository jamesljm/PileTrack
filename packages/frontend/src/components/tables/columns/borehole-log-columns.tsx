"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import type { BoreholeLog } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const boreholeLogColumns: ColumnDef<BoreholeLog>[] = [
  {
    accessorKey: "boreholeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Borehole ID" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("boreholeId")}</Badge>
    ),
  },
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
    accessorKey: "totalDepth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Depth (m)" />
    ),
    cell: ({ row }) => {
      const depth = row.getValue("totalDepth") as number;
      return <span>{depth?.toFixed(1) ?? "-"} m</span>;
    },
  },
  {
    id: "strataCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Strata" />
    ),
    cell: ({ row }) => {
      const strata = row.original.strata ?? [];
      return <span>{strata.length} layers</span>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string | null;
      return location ? (
        <span className="truncate max-w-[150px] block">{location}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;
      return (
        <Link href={`/sites/${log.siteId}/borehole-logs/${log.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      );
    },
  },
];
