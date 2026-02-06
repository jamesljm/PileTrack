"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Wrench,
  QrCode,
  User,
  CheckSquare,
  BarChart3,
  Bell,
  Users,
  Settings,
  HardHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@piletrack/shared";

const bottomNavItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/sites", label: "Sites", icon: MapPin },
  { href: "/equipment", label: "Equipment", icon: Wrench },
  { href: "/equipment/scan", label: "Scan QR", icon: QrCode },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden safe-bottom">
      <div className="flex items-center justify-around h-16">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[4rem] py-1",
              isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MobileSidebarContent() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const mainItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/sites", label: "Sites", icon: MapPin },
    { href: "/equipment", label: "Equipment", icon: Wrench },
    { href: "/approvals", label: "Approvals", icon: CheckSquare },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const adminItems = [
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/sites", label: "Site Management", icon: MapPin },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center gap-2 px-4 mb-4">
        <HardHat className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">PileTrack</span>
      </div>
      <nav>
        <ul className="space-y-1 px-2">
          {mainItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <Separator className="my-4 mx-2" />
            <p className="px-5 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admin
            </p>
            <ul className="space-y-1 px-2">
              {adminItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </div>
  );
}
