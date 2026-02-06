"use client";

import { MapPin, Activity, CheckSquare, Wrench } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { SiteCard } from "@/components/cards/site-card";
import { useSites } from "@/queries/use-sites";
import { useActivities, usePendingActivities } from "@/queries/use-activities";
import { useEquipment } from "@/queries/use-equipment";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { ActivityType, ActivityStatus, SiteStatus } from "@piletrack/shared";

export default function DashboardPage() {
  const router = useRouter();
  const { data: sitesData, isLoading: sitesLoading } = useSites({ pageSize: 6 });
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({ pageSize: 5 });
  const { data: pendingData } = usePendingActivities();
  const { data: equipmentData } = useEquipment({ pageSize: 1 });

  const totalSites = sitesData?.pagination?.totalItems ?? 0;
  const totalActivitiesToday = activitiesData?.pagination?.totalItems ?? 0;
  const pendingApprovals = pendingData?.pagination?.totalItems ?? 0;
  const totalEquipment = equipmentData?.pagination?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your construction operations</p>
      </div>

      {/* Stats */}
      {sitesLoading ? (
        <CardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={MapPin} label="Total Sites" value={totalSites} />
          <StatCard icon={Activity} label="Activities Today" value={totalActivitiesToday} />
          <StatCard icon={CheckSquare} label="Pending Approvals" value={pendingApprovals} />
          <StatCard icon={Wrench} label="Equipment" value={totalEquipment} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <Button variant="link" asChild><Link href="/sites">View All</Link></Button>
          </div>
          {activitiesLoading ? (
            <CardsSkeleton count={3} />
          ) : activitiesData?.data?.length ? (
            <div className="space-y-3">
              {activitiesData.data.slice(0, 5).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  id={activity.id}
                  activityType={activity.activityType as ActivityType}
                  status={activity.status as ActivityStatus}
                  date={activity.date}
                  siteName={activity.siteName}
                  createdByName={activity.createdByName}
                  onClick={() => router.push(`/sites/${activity.siteId}/activities/${activity.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No activities yet" description="Activities will appear here once they are created." />
          )}
        </div>

        {/* Site Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sites</h2>
            <Button variant="link" asChild><Link href="/sites">View All</Link></Button>
          </div>
          {sitesLoading ? (
            <CardsSkeleton count={3} />
          ) : sitesData?.data?.length ? (
            <div className="space-y-3">
              {sitesData.data.slice(0, 4).map((site) => (
                <SiteCard
                  key={site.id}
                  id={site.id}
                  name={site.name}
                  code={site.code}
                  status={site.status as SiteStatus}
                  clientName={site.clientName}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No sites yet" description="Sites will appear here once they are created." />
          )}
        </div>
      </div>
    </div>
  );
}
