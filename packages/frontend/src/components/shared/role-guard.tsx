"use client";

import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@piletrack/shared";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuthStore();
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
