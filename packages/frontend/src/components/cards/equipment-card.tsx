"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
} from "@/lib/constants";
import type { EquipmentCategory, EquipmentStatus, EquipmentCondition } from "@piletrack/shared";
import { Clock, AlertTriangle } from "lucide-react";

interface EquipmentCardProps {
  id: string;
  name: string;
  code: string;
  status: EquipmentStatus;
  category: EquipmentCategory;
  condition?: EquipmentCondition;
  totalUsageHours?: number;
  nextServiceDate?: string | null;
  siteName?: string;
  onClick?: () => void;
}

export function EquipmentCard({
  name,
  code,
  status,
  category,
  condition,
  totalUsageHours,
  nextServiceDate,
  siteName,
  onClick,
}: EquipmentCardProps) {
  const isServiceDue = nextServiceDate && new Date(nextServiceDate) < new Date();

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{code}</p>
          </div>
          <Badge className={EQUIPMENT_STATUS_COLORS[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="outline">
            {EQUIPMENT_CATEGORY_LABELS[category]}
          </Badge>
          {condition && (
            <Badge className={EQUIPMENT_CONDITION_COLORS[condition]}>
              {EQUIPMENT_CONDITION_LABELS[condition]}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {totalUsageHours != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {totalUsageHours.toFixed(1)} hrs
            </span>
          )}
          {isServiceDue && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Service due
            </span>
          )}
          {siteName && !isServiceDue && <span>{siteName}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
