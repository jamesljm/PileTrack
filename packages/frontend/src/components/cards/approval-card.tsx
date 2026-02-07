"use client";

import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import type { ActivityType } from "@piletrack/shared";

interface ApprovalCardProps {
  id: string;
  activityType: ActivityType;
  date: string;
  siteName: string;
  createdByName: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

export function ApprovalCard({
  id,
  activityType,
  date,
  siteName,
  createdByName,
  onApprove,
  onReject,
  isLoading,
}: ApprovalCardProps) {
  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] md:text-xs">
            {ACTIVITY_TYPE_LABELS[activityType]}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 text-[10px] md:text-xs">SUBMITTED</Badge>
        </div>
        <div className="space-y-0.5 text-sm mb-3">
          <p className="font-medium truncate">{siteName}</p>
          <p className="text-xs text-muted-foreground">
            {date ? format(new Date(date), "dd MMM yyyy") : "—"} - {createdByName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 h-8"
            onClick={() => onApprove(id)}
            disabled={isLoading}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 h-8"
            onClick={() => onReject(id)}
            disabled={isLoading}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
