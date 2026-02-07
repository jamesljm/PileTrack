"use client";

import { Badge } from "@/components/ui/badge";
import { SERVICE_TYPE_LABELS, SERVICE_TYPE_COLORS } from "@/lib/constants";
import type { ServiceRecord, ServiceType } from "@piletrack/shared";
import { Wrench, Calendar, DollarSign, User } from "lucide-react";

interface ServiceTimelineProps {
  records: ServiceRecord[];
}

export function ServiceTimeline({ records }: ServiceTimelineProps) {
  if (records.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No service records yet.
      </p>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      {records.map((record) => (
        <div key={record.id} className="relative pl-10 pb-6">
          {/* Dot */}
          <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <Badge className={SERVICE_TYPE_COLORS[record.serviceType as ServiceType]}>
                  {SERVICE_TYPE_LABELS[record.serviceType as ServiceType] ?? record.serviceType}
                </Badge>
                <p className="text-sm font-medium">{record.description}</p>
              </div>
              {record.cost != null && record.cost > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground shrink-0">
                  <DollarSign className="h-3 w-3" />
                  {record.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(record.serviceDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {record.performedBy}
              </span>
              {record.meterReading != null && (
                <span className="flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  {record.meterReading} hrs
                </span>
              )}
            </div>

            {record.partsReplaced && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Parts:</span> {record.partsReplaced}
              </p>
            )}

            {record.notes && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Notes:</span> {record.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
