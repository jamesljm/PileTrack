"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import type { User } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge variant="outline">{role}</Badge>;
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
        <Badge
          className={
            status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : status === "SUSPENDED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link href={`/admin/users/${user.id}`}>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
      );
    },
  },
];
