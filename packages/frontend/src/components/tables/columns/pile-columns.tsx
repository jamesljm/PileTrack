"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { PILE_STATUS_COLORS, PILE_STATUS_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import type { Pile, PileStatus, ActivityType } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const pileColumns: ColumnDef<Pile>[] = [
  {
    accessorKey: "pileId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pile ID" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("pileId")}</span>,
  },
  {
    accessorKey: "pileType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("pileType") as string;
      return <Badge variant="outline" className="text-xs">{ACTIVITY_TYPE_LABELS[type as ActivityType] ?? type}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge className={PILE_STATUS_COLORS[status as PileStatus] ?? ""}>{PILE_STATUS_LABELS[status as PileStatus] ?? status}</Badge>;
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "designLength",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Length (m)" />,
    cell: ({ row }) => {
      const design = row.original.designLength;
      const actual = row.original.actualLength;
      if (actual) return <span>{actual}m <span className="text-xs text-muted-foreground">/ {design}m</span></span>;
      return design ? <span>{design}m</span> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "gridRef",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Grid" />,
    cell: ({ row }) => row.getValue("gridRef") || <span className="text-muted-foreground">-</span>,
  },
  {
    accessorKey: "overconsumption",
    header: ({ column }) => <DataTableColumnHeader column={column} title="OC %" />,
    cell: ({ row }) => {
      const oc = row.original.overconsumption;
      if (oc == null) return <span className="text-muted-foreground">-</span>;
      const color = oc > 15 ? "text-red-600" : oc > 10 ? "text-yellow-600" : "text-green-600";
      return <span className={`font-medium ${color}`}>{oc.toFixed(1)}%</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pile = row.original;
      return (
        <Link href={`/sites/${pile.siteId}/piles/${pile.id}`}>
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
        </Link>
      );
    },
  },
];
