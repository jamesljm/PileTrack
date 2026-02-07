"use client";

import { use } from "react";
import { useSite } from "@/queries/use-sites";
import { useActivities } from "@/queries/use-activities";
import { useEquipment } from "@/queries/use-equipment";
import { useMaterials } from "@/queries/use-materials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_STATUS_COLORS, ACTIVITY_TYPE_LABELS, EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import { FormSkeleton, CardsSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Plus, Activity, Wrench, Package, ArrowLeftRight } from "lucide-react";
import type { SiteStatus, ActivityType, EquipmentCategory } from "@piletrack/shared";

export default function SiteDetailPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useSite(siteId);
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({ siteId, pageSize: 5 });
  const { data: equipmentData, isLoading: equipmentLoading } = useEquipment({ siteId, pageSize: 5 });
  const { data: materialsData, isLoading: materialsLoading } = useMaterials({ siteId, pageSize: 5 });
  const site = data?.data;

  if (isLoading) return <FormSkeleton />;
  if (!site) return <div className="text-center py-12"><p className="text-muted-foreground">Site not found</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">{site.code} - {site.clientName}</p>
        </div>
        <Badge className={SITE_STATUS_COLORS[site.status as SiteStatus]}>{site.status}</Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <Link href={`/sites/${siteId}/activities/new`}><Button className="w-full"><Plus className="mr-2 h-4 w-4" />New Activity</Button></Link>
        <Link href={`/sites/${siteId}/equipment/new`}><Button variant="outline" className="w-full"><Wrench className="mr-2 h-4 w-4" />Add Equipment</Button></Link>
        <Link href={`/sites/${siteId}/materials/new`}><Button variant="outline" className="w-full"><Package className="mr-2 h-4 w-4" />Add Material</Button></Link>
        <Link href={`/sites/${siteId}/transfers/new`}><Button variant="outline" className="w-full"><ArrowLeftRight className="mr-2 h-4 w-4" />New Transfer</Button></Link>
        <Link href={`/sites/${siteId}/activities`}><Button variant="outline" className="w-full"><Activity className="mr-2 h-4 w-4" />All Activities</Button></Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-medium">Site Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Address:</span> {site.address}</p>
                <p><span className="text-muted-foreground">Contract:</span> {site.contractNumber ?? "N/A"}</p>
                <p><span className="text-muted-foreground">Start Date:</span> {site.startDate ? new Date(site.startDate).toLocaleDateString() : "N/A"}</p>
                <p><span className="text-muted-foreground">End Date:</span> {site.expectedEndDate ? new Date(site.expectedEndDate).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
            {site.description && (
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{site.description}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent Activities</h3>
            <Link href={`/sites/${siteId}/activities`}><Button variant="link" size="sm">View All</Button></Link>
          </div>
          {activitiesLoading ? <CardsSkeleton count={3} /> : activitiesData?.data?.length ? (
            <div className="space-y-2">
              {activitiesData.data.slice(0, 5).map((activity: any) => (
                <Link key={activity.id} href={`/sites/${siteId}/activities/${activity.id}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {ACTIVITY_TYPE_LABELS[activity.activityType as ActivityType] ?? activity.activityType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.activityDate).toLocaleDateString()}
                        {activity.createdBy && ` - ${activity.createdBy.firstName} ${activity.createdBy.lastName}`}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No activities" description="Create your first activity for this site." />
          )}
          <Link href={`/sites/${siteId}/activities/new`}>
            <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />New Activity</Button>
          </Link>
        </TabsContent>

        <TabsContent value="equipment" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Equipment at this Site</h3>
            <Link href={`/sites/${siteId}/equipment`}><Button variant="link" size="sm">View All</Button></Link>
          </div>
          {equipmentLoading ? <CardsSkeleton count={3} /> : equipmentData?.data?.length ? (
            <div className="space-y-2">
              {equipmentData.data.slice(0, 5).map((eq: any) => (
                <Link key={eq.id} href={`/sites/${siteId}/equipment/${eq.id}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{eq.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {eq.code} - {EQUIPMENT_CATEGORY_LABELS[eq.category as EquipmentCategory] ?? eq.category}
                      </p>
                    </div>
                    <Badge variant="outline">{eq.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No equipment" description="Add equipment to this site." />
          )}
          <Link href={`/sites/${siteId}/equipment/new`}>
            <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Add Equipment</Button>
          </Link>
        </TabsContent>

        <TabsContent value="materials" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Materials at this Site</h3>
            <Link href={`/sites/${siteId}/materials`}><Button variant="link" size="sm">View All</Button></Link>
          </div>
          {materialsLoading ? <CardsSkeleton count={3} /> : materialsData?.data?.length ? (
            <div className="space-y-2">
              {materialsData.data.slice(0, 5).map((material: any) => (
                <Link key={material.id} href={`/sites/${siteId}/materials/${material.id}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{material.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {material.code} - Stock: {material.currentStock} {material.unit}
                      </p>
                    </div>
                    {material.currentStock <= material.minimumStock && (
                      <Badge variant="destructive">Low Stock</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No materials" description="Add materials to this site." />
          )}
          <Link href={`/sites/${siteId}/materials/new`}>
            <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Add Material</Button>
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  );
}
