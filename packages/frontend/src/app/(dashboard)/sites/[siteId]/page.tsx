"use client";

import { use, useState } from "react";
import { useSite, useSiteUsers, useAssignSiteUser, useRemoveSiteUser } from "@/queries/use-sites";
import { useActivities } from "@/queries/use-activities";
import { useEquipment } from "@/queries/use-equipment";
import { useMaterials } from "@/queries/use-materials";
import { useUsers } from "@/queries/use-users";
import { useDailyLogs } from "@/queries/use-daily-logs";
import { useTestResults } from "@/queries/use-test-results";
import { useBoreholeLogs } from "@/queries/use-borehole-logs";
import { usePiles } from "@/queries/use-piles";
import { useNCRs } from "@/queries/use-ncrs";
import { useConcreteDeliveries } from "@/queries/use-concrete-deliveries";
import { SiteCommandCenter } from "@/components/dashboard/site-command-center";
import { PileKanban } from "@/components/kanban/pile-kanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SITE_STATUS_COLORS,
  ACTIVITY_TYPE_LABELS,
  EQUIPMENT_CATEGORY_LABELS,
  DAILY_LOG_STATUS_COLORS,
  TEST_TYPE_LABELS,
  TEST_RESULT_STATUS_COLORS,
  NCR_PRIORITY_COLORS,
  NCR_STATUS_COLORS,
  NCR_CATEGORY_LABELS,
} from "@/lib/constants";
import { FormSkeleton, CardsSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  Plus,
  Activity,
  Wrench,
  Package,
  Users,
  Trash2,
  Loader2,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  Columns3,
  AlertTriangle,
  Truck,
} from "lucide-react";
import type {
  SiteStatus,
  ActivityType,
  EquipmentCategory,
  DailyLogStatus,
  TestType,
  TestResultStatus,
  NCRPriority,
  NCRStatus,
  NCRCategory,
} from "@piletrack/shared";

export default function SiteDetailPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const { toast } = useToast();
  const { data, isLoading } = useSite(siteId);
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({ siteId, pageSize: 5 });
  const { data: equipmentData, isLoading: equipmentLoading } = useEquipment({ siteId, pageSize: 5 });
  const { data: materialsData, isLoading: materialsLoading } = useMaterials({ siteId, pageSize: 5 });
  const { data: siteUsersData, isLoading: siteUsersLoading } = useSiteUsers(siteId);
  const { data: allUsersData } = useUsers({ pageSize: 100 });
  const { data: dailyLogsData, isLoading: dailyLogsLoading } = useDailyLogs({ siteId, pageSize: 5 });
  const { data: testResultsData, isLoading: testResultsLoading } = useTestResults({ siteId, pageSize: 5 });
  const { data: boreholeLogsData, isLoading: boreholeLogsLoading } = useBoreholeLogs({ siteId, pageSize: 5 });
  const { data: ncrsData, isLoading: ncrsLoading } = useNCRs({ siteId, pageSize: 5 });
  const { data: concreteData, isLoading: concreteLoading } = useConcreteDeliveries({ siteId, pageSize: 5 });
  const site = data?.data;

  const assignUser = useAssignSiteUser(siteId);
  const removeUser = useRemoveSiteUser(siteId);

  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedSiteRole, setSelectedSiteRole] = useState<string>("");
  const [removingUser, setRemovingUser] = useState<Record<string, any> | null>(null);
  const [pileView, setPileView] = useState<"kanban" | "list">("kanban");

  const siteUsers = (siteUsersData?.data ?? []) as Array<Record<string, any>>;
  const allUsers = allUsersData?.data ?? [];

  const siteUserIds = new Set(siteUsers.map((su: any) => su.userId ?? su.user?.id ?? su.id));
  const availableUsers = allUsers.filter((u: any) => !siteUserIds.has(u.id));

  const handleAssignUser = async () => {
    if (!selectedUserId) return;
    try {
      await assignUser.mutateAsync({
        userId: selectedUserId,
        siteRole: selectedSiteRole || undefined,
      });
      toast({ title: "User added", description: "User has been assigned to this site." });
      setAddUserDialogOpen(false);
      setSelectedUserId("");
      setSelectedSiteRole("");
    } catch {
      toast({ title: "Error", description: "Failed to assign user.", variant: "destructive" });
    }
  };

  const handleRemoveUser = async () => {
    if (!removingUser) return;
    const userId = removingUser.userId ?? removingUser.user?.id ?? removingUser.id;
    try {
      await removeUser.mutateAsync(userId);
      toast({ title: "User removed", description: "User has been removed from this site." });
      setRemoveDialogOpen(false);
      setRemovingUser(null);
    } catch {
      toast({ title: "Error", description: "Failed to remove user.", variant: "destructive" });
    }
  };

  if (isLoading) return <FormSkeleton />;
  if (!site) return <div className="text-center py-12"><p className="text-muted-foreground">Site not found</p></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">{site.name}</h1>
          <p className="text-xs md:text-sm text-muted-foreground">{site.code} - {site.clientName}</p>
        </div>
        <Badge className={`shrink-0 ${SITE_STATUS_COLORS[site.status as SiteStatus]}`}>{site.status}</Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <Link href={`/sites/${siteId}/activities/new`} className="col-span-2 md:col-span-1">
          <Button className="w-full h-9" size="sm"><Plus className="mr-1.5 h-4 w-4" />New Activity</Button>
        </Link>
        <Link href={`/sites/${siteId}/piles/new`}>
          <Button variant="outline" className="w-full h-9" size="sm"><Columns3 className="mr-1.5 h-4 w-4" />New Pile</Button>
        </Link>
        <Link href={`/sites/${siteId}/ncrs/new`}>
          <Button variant="outline" className="w-full h-9" size="sm"><AlertTriangle className="mr-1.5 h-4 w-4" />Raise NCR</Button>
        </Link>
        <Link href={`/sites/${siteId}/concrete-deliveries/new`}>
          <Button variant="outline" className="w-full h-9" size="sm"><Truck className="mr-1.5 h-4 w-4" />Concrete DO</Button>
        </Link>
        <Link href={`/sites/${siteId}/daily-logs/new`}>
          <Button variant="outline" className="w-full h-9" size="sm"><ClipboardList className="mr-1.5 h-4 w-4" />Daily Log</Button>
        </Link>
        <Link href={`/sites/${siteId}/test-results/new`}>
          <Button variant="outline" className="w-full h-9" size="sm"><FlaskConical className="mr-1.5 h-4 w-4" />Test Result</Button>
        </Link>
        <Link href={`/sites/${siteId}/activities`}>
          <Button variant="outline" className="w-full h-9" size="sm"><Activity className="mr-1.5 h-4 w-4" />All Activity</Button>
        </Link>
      </div>

      <Tabs defaultValue="command-center">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="command-center"><LayoutDashboard className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Command Center</TabsTrigger>
          <TabsTrigger value="piles"><Columns3 className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Pile Progress</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="diary">Diary</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Command Center Tab */}
        <TabsContent value="command-center" className="mt-4">
          <SiteCommandCenter siteId={siteId} />
        </TabsContent>

        {/* Pile Progress Tab */}
        <TabsContent value="piles" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Pile Progress</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={pileView === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setPileView("kanban")}
              >
                Kanban
              </Button>
              <Button
                variant={pileView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setPileView("list")}
              >
                <Link href={`/sites/${siteId}/piles`}>List View</Link>
              </Button>
            </div>
          </div>
          {pileView === "kanban" && <PileKanban siteId={siteId} />}
        </TabsContent>

        {/* Activities Tab */}
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

        {/* Quality Tab — Test Results + NCRs + Concrete Deliveries + Borehole Logs */}
        <TabsContent value="quality" className="mt-4 space-y-6">
          {/* Test Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Test Results</h3>
              <Link href={`/sites/${siteId}/test-results`}><Button variant="link" size="sm">View All</Button></Link>
            </div>
            {testResultsLoading ? <CardsSkeleton count={3} /> : testResultsData?.data?.length ? (
              <div className="space-y-2">
                {testResultsData.data.slice(0, 5).map((result: any) => (
                  <Link key={result.id} href={`/sites/${siteId}/test-results/${result.id}`} className="block">
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {result.pileId && <span className="text-sm font-medium">{result.pileId}</span>}
                          <Badge variant="outline" className="text-xs">
                            {TEST_TYPE_LABELS[result.testType as TestType] ?? result.testType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.testDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={TEST_RESULT_STATUS_COLORS[result.status as TestResultStatus] ?? ""}>{result.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No test results" description="Record quality control test results." />
            )}
            <Link href={`/sites/${siteId}/test-results/new`}>
              <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />New Test</Button>
            </Link>
          </div>

          {/* NCRs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Non-Conformance Reports</h3>
              <Link href={`/sites/${siteId}/ncrs`}><Button variant="link" size="sm">View All</Button></Link>
            </div>
            {ncrsLoading ? <CardsSkeleton count={3} /> : ncrsData?.data?.length ? (
              <div className="space-y-2">
                {ncrsData.data.slice(0, 5).map((ncr: any) => (
                  <Link key={ncr.id} href={`/sites/${siteId}/ncrs/${ncr.id}`} className="block">
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{ncr.ncrNumber}</span>
                          <Badge className={`text-xs ${NCR_PRIORITY_COLORS[ncr.priority as NCRPriority] ?? ""}`}>
                            {ncr.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {NCR_CATEGORY_LABELS[ncr.category as NCRCategory] ?? ncr.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">{ncr.title}</p>
                      </div>
                      <Badge className={NCR_STATUS_COLORS[ncr.status as NCRStatus] ?? ""}>{ncr.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No NCRs" description="No non-conformance reports have been raised." />
            )}
            <Link href={`/sites/${siteId}/ncrs/new`}>
              <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Raise NCR</Button>
            </Link>
          </div>

          {/* Concrete Deliveries Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Concrete Deliveries</h3>
              <Link href={`/sites/${siteId}/concrete-deliveries`}><Button variant="link" size="sm">View All</Button></Link>
            </div>
            {concreteLoading ? <CardsSkeleton count={3} /> : concreteData?.data?.length ? (
              <div className="space-y-2">
                {concreteData.data.slice(0, 5).map((delivery: any) => (
                  <Link key={delivery.id} href={`/sites/${siteId}/concrete-deliveries/${delivery.id}`} className="block">
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{delivery.doNumber}</span>
                          <Badge variant="outline" className="text-xs">{delivery.concreteGrade}</Badge>
                          <span className="text-xs text-muted-foreground">{delivery.volume} m³</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(delivery.deliveryDate).toLocaleDateString()} - {delivery.supplier}
                        </p>
                      </div>
                      {delivery.rejected && <Badge variant="destructive">Rejected</Badge>}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No concrete deliveries" description="Record concrete delivery orders." />
            )}
            <Link href={`/sites/${siteId}/concrete-deliveries/new`}>
              <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />New Concrete DO</Button>
            </Link>
          </div>

          {/* Borehole Logs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Borehole Logs</h3>
              <Link href={`/sites/${siteId}/borehole-logs`}><Button variant="link" size="sm">View All</Button></Link>
            </div>
            {boreholeLogsLoading ? <CardsSkeleton count={3} /> : boreholeLogsData?.data?.length ? (
              <div className="space-y-2">
                {boreholeLogsData.data.slice(0, 5).map((bh: any) => (
                  <Link key={bh.id} href={`/sites/${siteId}/borehole-logs/${bh.id}`} className="block">
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{bh.boreholeId}</Badge>
                          <span className="text-sm font-medium">{bh.totalDepth}m depth</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bh.logDate).toLocaleDateString()}
                          {bh.location && ` - ${bh.location}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{(bh.strata ?? []).length} layers</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No borehole logs" description="Record geotechnical investigation data." />
            )}
            <Link href={`/sites/${siteId}/borehole-logs/new`}>
              <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />New Borehole Log</Button>
            </Link>
          </div>
        </TabsContent>

        {/* Diary Tab */}
        <TabsContent value="diary" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent Daily Logs</h3>
            <Link href={`/sites/${siteId}/daily-logs`}><Button variant="link" size="sm">View All</Button></Link>
          </div>
          {dailyLogsLoading ? <CardsSkeleton count={3} /> : dailyLogsData?.data?.length ? (
            <div className="space-y-2">
              {dailyLogsData.data.slice(0, 5).map((log: any) => {
                const totalWorkforce = (log.workforce ?? []).reduce((s: number, w: any) => s + (w.headcount ?? 0), 0);
                return (
                  <Link key={log.id} href={`/sites/${siteId}/daily-logs/${log.id}`} className="block">
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {new Date(log.logDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {totalWorkforce} pax
                          {log.createdBy && ` - ${log.createdBy.firstName} ${log.createdBy.lastName}`}
                        </p>
                      </div>
                      <Badge className={DAILY_LOG_STATUS_COLORS[log.status as DailyLogStatus] ?? ""}>{log.status}</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No daily logs" description="Start recording daily site activities." />
          )}
          <Link href={`/sites/${siteId}/daily-logs/new`}>
            <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />New Daily Log</Button>
          </Link>
        </TabsContent>

        {/* Resources Tab — Equipment + Materials */}
        <TabsContent value="resources" className="mt-4 space-y-6">
          {/* Equipment Section */}
          <div className="space-y-4">
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
          </div>

          {/* Materials Section */}
          <div className="space-y-4">
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
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </h3>
            <Button size="sm" onClick={() => setAddUserDialogOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add User
            </Button>
          </div>

          {siteUsersLoading ? <CardsSkeleton count={3} /> : siteUsers.length > 0 ? (
            <div className="space-y-2">
              {siteUsers.map((su: any) => {
                const user = su.user ?? su;
                const displayName = user.firstName
                  ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                  : user.email ?? "Unknown";
                return (
                  <div key={su.id ?? user.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {user.email && <span>{user.email}</span>}
                        {user.role && <Badge variant="outline" className="text-[10px]">{user.role}</Badge>}
                        {su.siteRole && <Badge variant="secondary" className="text-[10px]">{su.siteRole}</Badge>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => { setRemovingUser(su); setRemoveDialogOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No team members" description="Add users to this site to get started." />
          )}
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User to Site</DialogTitle>
            <DialogDescription>Select a user to assign to this site.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Role (optional)</label>
              <Select value={selectedSiteRole} onValueChange={setSelectedSiteRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SITE_MANAGER">Site Manager</SelectItem>
                  <SelectItem value="SITE_ENGINEER">Site Engineer</SelectItem>
                  <SelectItem value="FOREMAN">Foreman</SelectItem>
                  <SelectItem value="WORKER">Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignUser} disabled={!selectedUserId || assignUser.isPending}>
              {assignUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove User Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={(open) => { setRemoveDialogOpen(open); if (!open) setRemovingUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this user from the site? They will lose access to site data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveUser} disabled={removeUser.isPending}>
              {removeUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
