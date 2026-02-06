"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
} from "@/lib/constants";
import type { EquipmentCategory, EquipmentStatus } from "@piletrack/shared";

interface EquipmentCardProps {
  id: string;
  name: string;
  code: string;
  status: EquipmentStatus;
  category: EquipmentCategory;
  siteName?: string;
  onClick?: () => void;
}

export function EquipmentCard({
  name,
  code,
  status,
  category,
  siteName,
  onClick,
}: EquipmentCardProps) {
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
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="outline">
            {EQUIPMENT_CATEGORY_LABELS[category]}
          </Badge>
          {siteName && <span>{siteName}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
