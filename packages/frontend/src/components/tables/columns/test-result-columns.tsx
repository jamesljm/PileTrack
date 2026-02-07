"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { TEST_TYPE_LABELS, TEST_RESULT_STATUS_COLORS } from "@/lib/constants";
import type { TestResult, TestType, TestResultStatus } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const testResultColumns: ColumnDef<TestResult>[] = [
  {
    accessorKey: "pileId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pile ID" />
    ),
    cell: ({ row }) => {
      const pileId = row.getValue("pileId") as string | null;
      return pileId ? (
        <Badge variant="outline">{pileId}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "testType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Test Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("testType") as string;
      return (
        <Badge variant="outline">
          {TEST_TYPE_LABELS[type as TestType] ?? type}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "testDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const d = row.getValue("testDate");
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
        <Badge className={TEST_RESULT_STATUS_COLORS[status as TestResultStatus] ?? ""}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "conductedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conducted By" />
    ),
    cell: ({ row }) => {
      const by = row.getValue("conductedBy") as string | null;
      return by ?? <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const result = row.original;
      return (
        <Link href={`/sites/${result.siteId}/test-results/${result.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      );
    },
  },
];
