"use client";

import Link from "next/link";
import { MapPin, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{code}</p>
            </div>
            <Badge className={SITE_STATUS_COLORS[status]}>{status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{clientName}</span>
            </div>
            {activityCount !== undefined && (
              <div className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                <span>{activityCount} activities</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
