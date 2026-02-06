"use client";

import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS_COLORS,
} from "@/lib/constants";
import type { ActivityType, ActivityStatus } from "@piletrack/shared";

interface ActivityCardProps {
  id: string;
  activityType: ActivityType;
  status: ActivityStatus;
  date: string;
  siteName?: string;
  createdByName?: string;
  onClick?: () => void;
}

export function ActivityCard({
  activityType,
  status,
  date,
  siteName,
  createdByName,
  onClick,
}: ActivityCardProps) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline">
            {ACTIVITY_TYPE_LABELS[activityType]}
          </Badge>
          <Badge className={ACTIVITY_STATUS_COLORS[status]}>{status}</Badge>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{date ? format(new Date(date), "dd MMM yyyy") : "—"}</p>
          {siteName && <p>Site: {siteName}</p>}
          {createdByName && <p>By: {createdByName}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
