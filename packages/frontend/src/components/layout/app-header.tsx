"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "./sync-status-badge";
import { UserMenu } from "./user-menu";
import { Breadcrumbs } from "./breadcrumbs";
import { useUIStore } from "@/stores/ui-store";
import { useUnreadCount } from "@/queries/use-notifications";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile menu trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
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

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-3">
        <SyncStatusBadge />

        <Link href="/notifications" className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
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
