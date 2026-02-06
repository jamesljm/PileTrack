"use client";

import { use } from "react";
import { useActivity } from "@/queries/use-activities";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_COLORS } from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { format } from "date-fns";
import type { ActivityType, ActivityStatus } from "@piletrack/shared";

export default function ActivityDetailPage({ params }: { params: Promise<{ siteId: string; activityId: string }> }) {
  const { activityId } = use(params);
  const { data, isLoading } = useActivity(activityId);
  const activity = data?.data;

  if (isLoading) return <FormSkeleton />;
  if (!activity) return <p className="text-center py-12 text-muted-foreground">Activity not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ACTIVITY_TYPE_LABELS[activity.activityType as ActivityType]}</h1>
          <p className="text-muted-foreground">{activity.activityDate ? format(new Date(activity.activityDate), "dd MMM yyyy") : "—"}</p>
        </div>
        <Badge className={ACTIVITY_STATUS_COLORS[activity.status as ActivityStatus]}>{activity.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {Object.entries(activity.details).map(([key, value]) => (
              <div key={key} className="flex justify-between"><span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span><span className="font-medium">{String(value)}</span></div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {activity.weather && (
            <Card>
              <CardHeader><CardTitle className="text-base">Weather</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>Condition: {activity.weather.condition}</p>
                {activity.weather.temperatureCelsius !== undefined && <p>Temperature: {activity.weather.temperatureCelsius}C</p>}
                {activity.weather.humidity !== undefined && <p>Humidity: {activity.weather.humidity}%</p>}
              </CardContent>
            </Card>
          )}

          {activity.gpsLat && activity.gpsLng && (
            <Card>
              <CardHeader><CardTitle className="text-base">GPS Location</CardTitle></CardHeader>
              <CardContent className="text-sm"><p>{activity.gpsLat.toFixed(6)}, {activity.gpsLng.toFixed(6)}</p></CardContent>
            </Card>
          )}

          {activity.notes && (
            <Card>
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent className="text-sm"><p>{activity.notes}</p></CardContent>
            </Card>
          )}
        </div>
      </div>

      {activity.photos.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Photos ({activity.photos.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activity.photos.map((photo, i) => (
                <div key={i} className="rounded-md overflow-hidden border">
                  <img src={photo.uri} alt={photo.caption ?? `Photo ${i + 1}`} className="w-full aspect-square object-cover" />
                  {photo.caption && <p className="text-xs p-2 text-muted-foreground">{photo.caption}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
