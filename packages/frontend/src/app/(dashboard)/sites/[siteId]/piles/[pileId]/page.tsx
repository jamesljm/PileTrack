"use client";

import { use } from "react";
import { usePile } from "@/queries/use-piles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PILE_STATUS_COLORS,
  PILE_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
} from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PileStatus, ActivityType } from "@piletrack/shared";

export default function PileDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; pileId: string }>;
}) {
  const { siteId, pileId } = use(params);
  const { data, isLoading } = usePile(pileId);
  const pile = data?.data as Record<string, any> | undefined;

  if (isLoading) return <FormSkeleton />;
  if (!pile)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Pile not found
      </p>
    );

  const overconsumption =
    pile.concreteVolume && pile.actualConcreteVol
      ? (((pile.actualConcreteVol - pile.concreteVolume) / pile.concreteVolume) *
          100)
      : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/sites/${siteId}/piles`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            Pile {pile.pileId}
          </h1>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          className={
            PILE_STATUS_COLORS[pile.status as PileStatus] ??
            "bg-gray-100 text-gray-800"
          }
        >
          {PILE_STATUS_LABELS[pile.status as PileStatus] ?? pile.status}
        </Badge>
        {pile.pileType && (
          <Badge variant="outline">
            {ACTIVITY_TYPE_LABELS[pile.pileType as ActivityType] ??
              pile.pileType}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {/* Design Section */}
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Design</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Design Length</span>
                <span className="font-medium">
                  {pile.designLength != null ? `${pile.designLength} m` : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Design Diameter</span>
                <span className="font-medium">
                  {pile.designDiameter != null
                    ? `${pile.designDiameter} mm`
                    : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cut-off Level</span>
                <span className="font-medium">
                  {pile.cutOffLevel != null
                    ? `${pile.cutOffLevel} m`
                    : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Level</span>
                <span className="font-medium">
                  {pile.platformLevel != null
                    ? `${pile.platformLevel} m`
                    : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Concrete Grade</span>
                <span className="font-medium">
                  {pile.concreteGrade ?? "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Concrete Volume (Design)
                </span>
                <span className="font-medium">
                  {pile.concreteVolume != null
                    ? `${pile.concreteVolume} m\u00B3`
                    : "\u2014"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actual Section */}
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Actual</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actual Length</span>
                <span className="font-medium">
                  {pile.actualLength != null
                    ? `${pile.actualLength} m`
                    : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Actual Concrete Volume
                </span>
                <span className="font-medium">
                  {pile.actualConcreteVol != null
                    ? `${pile.actualConcreteVol} m\u00B3`
                    : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overconsumption</span>
                <span
                  className={`font-medium ${
                    overconsumption != null && overconsumption > 5
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {overconsumption != null
                    ? `${overconsumption.toFixed(1)}%`
                    : "\u2014"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-3 md:p-6">
            <h3 className="text-sm font-semibold mb-2">Location</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grid Ref</span>
                <span className="font-medium">{pile.gridRef ?? "\u2014"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPS Latitude</span>
                <span className="font-medium">
                  {pile.gpsLat != null ? pile.gpsLat : "\u2014"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPS Longitude</span>
                <span className="font-medium">
                  {pile.gpsLng != null ? pile.gpsLng : "\u2014"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remarks */}
        {pile.remarks && (
          <Card>
            <CardContent className="p-3 md:p-6">
              <h3 className="text-sm font-semibold mb-2">Remarks</h3>
              <p className="text-sm">{pile.remarks}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
