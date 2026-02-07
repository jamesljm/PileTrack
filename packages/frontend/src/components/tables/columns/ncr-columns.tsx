"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { NCR_STATUS_COLORS, NCR_STATUS_LABELS, NCR_PRIORITY_COLORS, NCR_PRIORITY_LABELS, NCR_CATEGORY_LABELS } from "@/lib/constants";
import type { NCR, NCRStatus, NCRPriority, NCRCategory } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const ncrColumns: ColumnDef<NCR>[] = [
  {
    accessorKey: "ncrNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="NCR #" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("ncrNumber")}</span>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="max-w-[200px] truncate block">{title}</span>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const cat = row.getValue("category") as string;
      return <Badge variant="outline" className="text-xs">{NCR_CATEGORY_LABELS[cat as NCRCategory] ?? cat}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const p = row.getValue("priority") as string;
      return <Badge className={NCR_PRIORITY_COLORS[p as NCRPriority] ?? ""}>{NCR_PRIORITY_LABELS[p as NCRPriority] ?? p}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      return <Badge className={NCR_STATUS_COLORS[s as NCRStatus] ?? ""}>{NCR_STATUS_LABELS[s as NCRStatus] ?? s}</Badge>;
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    id: "assignedToName",
    accessorFn: (row: any) => row.assignedTo ? `${row.assignedTo.firstName} ${row.assignedTo.lastName}` : "",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
    cell: ({ row }) => row.getValue("assignedToName") || <span className="text-muted-foreground">-</span>,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => {
      const d = row.getValue("dueDate");
      if (!d) return <span className="text-muted-foreground">-</span>;
      const isOverdue = new Date(d as string) < new Date() && !["CLOSED", "VOIDED"].includes(row.original.status);
      return <span className={isOverdue ? "text-red-600 font-medium" : ""}>{format(new Date(d as string), "dd MMM yyyy")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ncr = row.original;
      return (
        <Link href={`/sites/${ncr.siteId}/ncrs/${ncr.id}`}>
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
        </Link>
      );
    },
  },
];
