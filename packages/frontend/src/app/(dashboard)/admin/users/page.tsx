"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { DataTable } from "@/components/tables/data-table";
import { userColumns } from "@/components/tables/columns/user-columns";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, Mail } from "lucide-react";
import type { User, PaginatedResponse } from "@piletrack/shared";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  SUPERVISOR: "bg-blue-100 text-blue-800",
  WORKER: "bg-gray-100 text-gray-800",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  SUSPENDED: "bg-red-100 text-red-800",
};

function UserMobileCard({ item }: { item: User }) {
  return (
    <Link href={`/admin/users/${item.id}`} className="block">
      <div className="flex items-center gap-3 rounded-lg border p-3 active:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-semibold truncate">{item.firstName} {item.lastName}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{item.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-[10px] px-1.5 py-0 ${ROLE_COLORS[item.role] ?? ""}`}>
              {item.role}
            </Badge>
            <Badge className={`text-[10px] px-1.5 py-0 ${STATUS_COLORS[item.status] ?? ""}`}>
              {item.status}
            </Badge>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<PaginatedResponse<User>>("/users", { pageSize: "100" }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Users</h1>
        <Button asChild size="sm" className="h-9">
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Create User</span>
            <span className="sm:hidden">New</span>
          </Link>
        </Button>
      </div>
      {isLoading ? <TableSkeleton /> : (
        <DataTable
          columns={userColumns}
          data={data?.data ?? []}
          searchKey="email"
          searchPlaceholder="Search users..."
          filterOptions={[
            { key: "role", label: "Role", options: [{ value: "ADMIN", label: "Admin" }, { value: "SUPERVISOR", label: "Supervisor" }, { value: "WORKER", label: "Worker" }] },
            { key: "status", label: "Status", options: [{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }, { value: "SUSPENDED", label: "Suspended" }] },
          ]}
          renderMobileCard={(item) => <UserMobileCard item={item as User} />}
        />
      )}
    </div>
  );
}
