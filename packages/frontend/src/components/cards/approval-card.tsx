"use client";

import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline">
            {ACTIVITY_TYPE_LABELS[activityType]}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">SUBMITTED</Badge>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-medium">{siteName}</p>
          <p className="text-muted-foreground">
            {format(new Date(date), "dd MMM yyyy")}
          </p>
          <p className="text-muted-foreground">By: {createdByName}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onApprove(id)}
          disabled={isLoading}
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={() => onReject(id)}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
