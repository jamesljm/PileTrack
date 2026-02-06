"use client";

import { use } from "react";
import { useSite } from "@/queries/use-sites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_STATUS_COLORS } from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Plus, Activity, Wrench, Package, ArrowLeftRight } from "lucide-react";
import type { SiteStatus } from "@piletrack/shared";

export default function SiteDetailPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { data, isLoading } = useSite(siteId);
  const site = data?.data;

  if (isLoading) return <FormSkeleton />;
  if (!site) return <div className="text-center py-12"><p className="text-muted-foreground">Site not found</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">{site.code} - {site.clientName}</p>
        </div>
        <Badge className={SITE_STATUS_COLORS[site.status as SiteStatus]}>{site.status}</Badge>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href={`/sites/${siteId}/activities/new`}><Button className="w-full"><Plus className="mr-2 h-4 w-4" />New Activity</Button></Link>
            <Link href={`/sites/${siteId}/activities`}><Button variant="outline" className="w-full"><Activity className="mr-2 h-4 w-4" />Activities</Button></Link>
            <Link href={`/sites/${siteId}/equipment`}><Button variant="outline" className="w-full"><Wrench className="mr-2 h-4 w-4" />Equipment</Button></Link>
            <Link href={`/sites/${siteId}/transfers/new`}><Button variant="outline" className="w-full"><ArrowLeftRight className="mr-2 h-4 w-4" />Transfer</Button></Link>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          <div className="text-center py-6">
            <Link href={`/sites/${siteId}/activities`}><Button>View All Activities</Button></Link>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="mt-4">
          <div className="text-center py-6">
            <Link href={`/sites/${siteId}/equipment`}><Button>View All Equipment</Button></Link>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          <div className="text-center py-6">
            <Link href={`/sites/${siteId}/materials`}><Button>View All Materials</Button></Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
