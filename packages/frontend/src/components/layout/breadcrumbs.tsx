"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

const SEGMENT_LABELS: Record<string, string> = {
  sites: "Sites",
  equipment: "Equipment",
  approvals: "Approvals",
  reports: "Reports",
  notifications: "Notifications",
  profile: "Profile",
  admin: "Admin",
  users: "Users",
  settings: "Settings",
  activities: "Activities",
  materials: "Materials",
  transfers: "Transfers",
  new: "New",
  scan: "Scan QR",
  "forgot-password": "Forgot Password",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Filter out route group segments like (auth) and (dashboard)
  const segments = pathname
    .split("/")
    .filter((s) => s && !s.startsWith("("));

  if (segments.length === 0) {
    return (
      <div className="hidden md:flex items-center text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-3 w-3 mx-1" />
        <span className="font-medium text-foreground">Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="hidden md:flex items-center text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label =
          SEGMENT_LABELS[segment] ?? decodeURIComponent(segment);

        return (
          <Fragment key={href}>
            <ChevronRight className="h-3 w-3 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[200px]"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
