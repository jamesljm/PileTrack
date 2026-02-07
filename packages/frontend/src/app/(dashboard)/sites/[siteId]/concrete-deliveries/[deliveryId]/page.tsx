"use client";

import { use } from "react";
import Link from "next/link";
import { useConcreteDelivery } from "@/queries/use-concrete-deliveries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default function ConcreteDeliveryDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; deliveryId: string }>;
}) {
  const { siteId, deliveryId } = use(params);
  const { data, isLoading } = useConcreteDelivery(deliveryId);
  const delivery = data?.data as Record<string, any> | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!delivery)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Delivery not found
      </p>
    );

  const cubeSampleIds: string[] = (() => {
    try {
      if (Array.isArray(delivery.cubeSampleIds)) return delivery.cubeSampleIds;
      if (typeof delivery.cubeSampleIds === "string")
        return JSON.parse(delivery.cubeSampleIds);
      return [];
    } catch {
      return [];
    }
  })();

  const slumpExceeded =
    delivery.slumpActual != null &&
    delivery.slumpRequired != null &&
    Number(delivery.slumpActual) > Number(delivery.slumpRequired) + 20;

  function formatTime(value: unknown): string {
    if (!value) return "\u2014";
    const str = String(value);
    // If it looks like an ISO date, extract the time portion
    if (str.includes("T")) {
      try {
        return format(new Date(str), "HH:mm");
      } catch {
        return str;
      }
    }
    return str;
  }

  function formatDate(value: unknown): string {
    if (!value) return "\u2014";
    try {
      return format(new Date(String(value)), "dd MMM yyyy");
    } catch {
      return String(value);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}/concrete-deliveries`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            DO: {delivery.doNumber ?? "\u2014"}
          </h1>
          {delivery.rejected && (
            <Badge className="bg-red-100 text-red-800 shrink-0">
              Rejected
            </Badge>
          )}
        </div>
      </div>

      {/* Delivery Info */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Delivery Info</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Supplier:</span>{" "}
              <span className="font-medium">{delivery.supplier ?? "\u2014"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Batch Plant:</span>{" "}
              <span className="font-medium">
                {delivery.batchPlant ?? "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Truck Number:</span>{" "}
              <span className="font-medium">
                {delivery.truckNumber ?? "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Delivery Date:</span>{" "}
              <span className="font-medium">
                {formatDate(delivery.deliveryDate)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concrete Details */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Concrete Details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Concrete Grade:</span>{" "}
              <span className="font-medium">
                {delivery.concreteGrade ?? "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Volume:</span>{" "}
              <span className="font-medium">
                {delivery.volume != null
                  ? `${delivery.volume} m\u00B3`
                  : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Slump Required:</span>{" "}
              <span className="font-medium">
                {delivery.slumpRequired != null
                  ? `${delivery.slumpRequired} mm`
                  : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Slump Actual:</span>{" "}
              <span
                className={`font-medium ${slumpExceeded ? "text-red-600" : ""}`}
              >
                {delivery.slumpActual != null
                  ? `${delivery.slumpActual} mm`
                  : "\u2014"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Timeline</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Batch Time:</span>{" "}
              <span className="font-medium">
                {formatTime(delivery.batchTime)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Arrival Time:</span>{" "}
              <span className="font-medium">
                {formatTime(delivery.arrivalTime)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pour Start:</span>{" "}
              <span className="font-medium">
                {formatTime(delivery.pourStartTime)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pour End:</span>{" "}
              <span className="font-medium">
                {formatTime(delivery.pourEndTime)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <h3 className="text-sm font-semibold mb-3">Quality</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Temperature:</span>{" "}
              <span className="font-medium">
                {delivery.temperature != null
                  ? `${delivery.temperature} \u00B0C`
                  : "\u2014"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Cubes Taken:</span>{" "}
              <span className="font-medium">
                {delivery.cubesTaken ?? "\u2014"}
              </span>
            </div>
            {cubeSampleIds.length > 0 && (
              <div>
                <span className="text-muted-foreground">
                  Cube Sample IDs:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {cubeSampleIds.map((id: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reason */}
      {delivery.rejected && delivery.rejectionReason && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2 text-red-600">
              Rejection Reason
            </h3>
            <p className="text-sm">{delivery.rejectionReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Remarks */}
      {delivery.remarks && (
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Remarks</h3>
            <p className="text-sm">{delivery.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
