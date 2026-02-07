"use client";

import Link from "next/link";
import { MapPin, Activity } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE_STATUS_COLORS } from "@/lib/constants";
import type { SiteStatus } from "@piletrack/shared";

interface SiteCardProps {
  id: string;
  name: string;
  code: string;
  status: SiteStatus;
  clientName: string;
  activityCount?: number;
}

export function SiteCard({
  id,
  name,
  code,
  status,
  clientName,
  activityCount,
}: SiteCardProps) {
  return (
    <Link href={`/sites/${id}`}>
      <Card className="hover:shadow-md active:bg-accent/50 transition-all cursor-pointer">
        <CardContent className="p-3 md:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <CardTitle className="text-sm md:text-base truncate">{name}</CardTitle>
              <p className="text-xs text-muted-foreground">{code}</p>
            </div>
            <Badge className={`shrink-0 text-[10px] px-1.5 py-0 md:text-xs md:px-2.5 md:py-0.5 ${SITE_STATUS_COLORS[status]}`}>{status}</Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{clientName}</span>
            </div>
            {activityCount !== undefined && (
              <div className="flex items-center gap-1 shrink-0">
                <Activity className="h-3 w-3" />
                <span>{activityCount}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
