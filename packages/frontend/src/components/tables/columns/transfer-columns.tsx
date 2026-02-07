"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { TRANSFER_STATUS_COLORS } from "@/lib/constants";
import type { TransferWithItems } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const transferColumns: ColumnDef<TransferWithItems>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) =>
      format(new Date(row.getValue("createdAt")), "dd MMM yyyy"),
  },
  {
    accessorKey: "fromSiteName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
  },
  {
    accessorKey: "toSiteName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={TRANSFER_STATUS_COLORS[status as keyof typeof TRANSFER_STATUS_COLORS] ?? ""}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "requestedByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested By" />
    ),
  },
  {
    id: "itemCount",
    header: "Items",
    cell: ({ row }) => row.original.items?.length ?? 0,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transfer = row.original;
      return (
        <Link
          href={`/sites/${transfer.fromSiteId}/transfers/${transfer.id}`}
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
