"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && !isPublicPath) {
      router.replace("/login");
    }

    if (isAuthenticated && isPublicPath) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
