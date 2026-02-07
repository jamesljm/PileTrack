"use client";

import { Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "./sync-status-badge";
import { UserMenu } from "./user-menu";
import { Breadcrumbs } from "./breadcrumbs";
import { useUIStore } from "@/stores/ui-store";
import { useUnreadCount } from "@/queries/use-notifications";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileSidebarContent } from "./mobile-nav";

export function AppHeader() {
  const { toggleSidebar } = useUIStore();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.data?.count ?? 0;
  const pathname = usePathname();
  const router = useRouter();

  // Show back button on child pages (depth > 1)
  const segments = pathname.split("/").filter((s) => s && !s.startsWith("("));
  const showBack = segments.length > 1;

  return (
    <header className="sticky top-0 z-40 flex h-12 md:h-14 items-center gap-2 border-b bg-background px-3 md:px-6">
      {/* Mobile: back button on child pages, menu on root pages */}
      <div className="md:hidden">
        {showBack ? (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>PileTrack</SheetTitle>
              </SheetHeader>
              <MobileSidebarContent />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Desktop sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hidden md:flex"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Mobile: show page title instead of breadcrumbs */}
      <div className="md:hidden flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {segments.length === 0 ? "Dashboard" : getPageTitle(segments)}
        </p>
      </div>

      <div className="hidden md:block">
        <Breadcrumbs />
      </div>

      <div className="ml-auto flex items-center gap-1 md:gap-3">
        <SyncStatusBadge />

        <Link href="/notifications" className="relative">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 flex items-center justify-center text-[9px] md:text-[10px]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}

function getPageTitle(segments: string[]): string {
  const labels: Record<string, string> = {
    sites: "Sites",
    equipment: "Equipment",
    approvals: "Approvals",
    reports: "Reports",
    notifications: "Notifications",
    profile: "Profile",
    admin: "Admin",
    activities: "Activities",
    materials: "Materials",
    transfers: "Transfers",
    new: "New",
    scan: "Scan QR",
    dashboard: "Fleet Dashboard",
  };
  const last = segments[segments.length - 1]!;
  return labels[last] ?? last.charAt(0).toUpperCase() + last.slice(1);
}
