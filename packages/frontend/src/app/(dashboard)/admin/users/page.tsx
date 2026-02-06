"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { DataTable } from "@/components/tables/data-table";
import { userColumns } from "@/components/tables/columns/user-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { User, PaginatedResponse } from "@piletrack/shared";

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<PaginatedResponse<User>>("/users", { pageSize: "100" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all system users</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Link>
        </Button>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable columns={userColumns} data={data?.data ?? []} searchKey="email" searchPlaceholder="Search users..."
          filterOptions={[
            { key: "role", label: "Role", options: [{ value: "ADMIN", label: "Admin" }, { value: "SUPERVISOR", label: "Supervisor" }, { value: "WORKER", label: "Worker" }] },
            { key: "status", label: "Status", options: [{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }, { value: "SUSPENDED", label: "Suspended" }] },
          ]}
        />
      )}
    </div>
  );
}
