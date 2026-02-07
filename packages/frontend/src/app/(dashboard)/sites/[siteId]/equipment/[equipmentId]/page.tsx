"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useEquipmentItem,
  useEquipmentServiceRecords,
  useCreateServiceRecord,
  useUpdateServiceRecord,
  useDeleteServiceRecord,
  useDeleteEquipment,
  useEquipmentUsage,
  useEquipmentUsageSummary,
  useEquipmentStats,
  useEquipmentSiteHistory,
} from "@/queries/use-equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_STATUS_COLORS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
  SERVICE_TYPE_LABELS,
  ACTIVITY_TYPE_LABELS,
} from "@/lib/constants";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ServiceTimeline } from "@/components/shared/service-timeline";
import { ServiceRecordForm } from "@/components/forms/service-record-form";
import type {
  EquipmentCategory,
  EquipmentStatus,
  EquipmentCondition,
  ServiceType,
  ServiceRecord,
  ActivityType,
} from "@piletrack/shared";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Wrench,
  DollarSign,
  Plus,
  Calendar,
  TrendingUp,
  AlertTriangle,
  ArrowRightLeft,
  Trash2,
  QrCode,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ siteId: string; equipmentId: string }>;
}) {
  const { siteId, equipmentId } = use(params);
  const router = useRouter();
  const { data, isLoading } = useEquipmentItem(equipmentId);
  const eq = data?.data;
  const site = (eq as any)?.site as
    | { id: string; name: string; code: string }
    | null
    | undefined;

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRecordDialogOpen, setDeleteRecordDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<ServiceRecord | null>(null);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  // Service records
  const { data: serviceData } = useEquipmentServiceRecords(equipmentId, {
    serviceType: serviceTypeFilter !== "all" ? serviceTypeFilter : undefined,
  });
  const serviceRecords = serviceData?.data ?? [];

  const createServiceRecord = useCreateServiceRecord(equipmentId);
  const updateServiceRecord = useUpdateServiceRecord(equipmentId);
  const deleteServiceRecord = useDeleteServiceRecord(equipmentId);
  const deleteEquipment = useDeleteEquipment();

  // Usage
  const { data: usageData } = useEquipmentUsage(equipmentId);
  const usageHistory = usageData?.data ?? [];

  const { data: usageSummaryData } = useEquipmentUsageSummary(equipmentId);
  const usageSummary = usageSummaryData?.data;

  // Stats
  const { data: statsData } = useEquipmentStats(equipmentId);
  const stats = statsData?.data;

  // Site history
  const { data: siteHistoryData } = useEquipmentSiteHistory(equipmentId);
  const siteHistory = siteHistoryData?.data ?? [];

  if (isLoading) return <FormSkeleton />;
  if (!eq)
    return (
      <p className="text-center py-12 text-muted-foreground">
        Equipment not found
      </p>
    );

  const handleCreateServiceRecord = async (formData: any) => {
    try {
      await createServiceRecord.mutateAsync(formData);
      setServiceDialogOpen(false);
      toast({
        title: "Service record created",
        description: "The service record has been logged successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create service record.",
        variant: "destructive",
      });
    }
  };

  const handleEditServiceRecord = async (formData: any) => {
    if (!editingRecord) return;
    try {
      await updateServiceRecord.mutateAsync({
        recordId: editingRecord.id,
        data: formData,
      });
      setEditDialogOpen(false);
      setEditingRecord(null);
      toast({
        title: "Service record updated",
        description: "The service record has been updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update service record.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteServiceRecord = async () => {
    if (!deletingRecord) return;
    try {
      await deleteServiceRecord.mutateAsync(deletingRecord.id);
      setDeleteRecordDialogOpen(false);
      setDeletingRecord(null);
      toast({
        title: "Service record deleted",
        description: "The service record has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete service record.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEquipment = async () => {
    try {
      await deleteEquipment.mutateAsync(equipmentId);
      toast({
        title: "Equipment deleted",
        description: "The equipment has been removed.",
      });
      router.push(`/sites/${siteId}/equipment`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete equipment.",
        variant: "destructive",
      });
    }
  };

  const qrCode = (eq as any).qrCode as string | undefined;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold truncate">{eq.name}</h1>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <span>{eq.code}</span>
            <span>-</span>
            <span>{EQUIPMENT_CATEGORY_LABELS[eq.category as EquipmentCategory]}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge className={`text-[10px] md:text-xs px-1.5 py-0 ${EQUIPMENT_STATUS_COLORS[eq.status as EquipmentStatus]}`}>
            {eq.status}
          </Badge>
          <Badge className={`text-[10px] md:text-xs px-1.5 py-0 ${EQUIPMENT_CONDITION_COLORS[(eq as any).condition as EquipmentCondition] ?? "bg-gray-100 text-gray-800"}`}>
            {EQUIPMENT_CONDITION_LABELS[(eq as any).condition as EquipmentCondition] ?? "Unknown"}
          </Badge>
        </div>
      </div>

      {/* Delete Equipment Button */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-destructive border-destructive/50 hover:bg-destructive/10"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete Equipment
        </Button>
      </div>

      {/* Delete Equipment Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Equipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{eq.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEquipment} disabled={deleteEquipment.isPending}>
              {deleteEquipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Record Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditingRecord(null); }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service Record</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <ServiceRecordForm
              totalUsageHours={(eq as any).totalUsageHours ?? 0}
              defaultValues={{
                serviceType: editingRecord.serviceType as any,
                serviceDate: editingRecord.serviceDate
                  ? new Date(editingRecord.serviceDate).toISOString().split("T")[0]
                  : undefined,
                description: editingRecord.description,
                performedBy: editingRecord.performedBy,
                cost: editingRecord.cost ?? undefined,
                partsReplaced: editingRecord.partsReplaced ?? undefined,
                nextServiceDate: editingRecord.nextServiceDate
                  ? new Date(editingRecord.nextServiceDate).toISOString().split("T")[0]
                  : undefined,
                meterReading: editingRecord.meterReading ?? undefined,
                notes: editingRecord.notes ?? undefined,
              }}
              onSubmit={handleEditServiceRecord}
              isLoading={updateServiceRecord.isPending}
              submitLabel="Update Service Record"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Service Record Dialog */}
      <Dialog open={deleteRecordDialogOpen} onOpenChange={(open) => { setDeleteRecordDialogOpen(open); if (!open) setDeletingRecord(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRecordDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteServiceRecord} disabled={deleteServiceRecord.isPending}>
              {deleteServiceRecord.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Card>
            <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Total Hours</p>
                  <p className="text-base md:text-lg font-bold">{stats.totalUsageHours.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Productive</p>
                  <p className="text-base md:text-lg font-bold">{stats.productiveHours.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Since Service</p>
                  <p className="text-base md:text-lg font-bold">{stats.daysSinceLastService ?? "N/A"}<span className="text-xs font-normal text-muted-foreground ml-0.5">d</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Cost</p>
                  <p className="text-base md:text-lg font-bold">${stats.totalServiceCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {stats?.isServiceOverdue && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-2.5 text-xs md:text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Service overdue based on usage hours
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-3">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-3">
          {site && (
            <Link href={`/sites/${site.id}`}>
              <div className="flex items-center gap-2 rounded-lg border p-3 active:bg-accent/50 transition-colors">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{site.name}</p>
                  <p className="text-xs text-muted-foreground">{site.code}</p>
                </div>
              </div>
            </Link>
          )}

          {/* QR Code Card */}
          <Card>
            <CardContent className="p-3 md:p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </h3>
              {qrCode ? (
                <div className="flex items-center gap-3">
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">{qrCode}</code>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No QR code assigned to this equipment.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <h3 className="text-sm font-semibold mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Serial Number:</span>{" "}
                <span className="font-medium">
                  {eq.serialNumber ?? "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Manufacturer:</span>{" "}
                <span className="font-medium">
                  {eq.manufacturer ?? "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Model:</span>{" "}
                <span className="font-medium">{eq.model ?? "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Year:</span>{" "}
                <span className="font-medium">
                  {eq.yearOfManufacture ?? "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Service:</span>{" "}
                <span className="font-medium">
                  {eq.lastServiceDate
                    ? new Date(eq.lastServiceDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Next Service:</span>{" "}
                <span className="font-medium">
                  {eq.nextServiceDate
                    ? new Date(eq.nextServiceDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Hours:</span>{" "}
                <span className="font-medium">
                  {(eq as any).totalUsageHours?.toFixed(1) ?? "0.0"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Service Interval:
                </span>{" "}
                <span className="font-medium">
                  {(eq as any).serviceIntervalHours
                    ? `${(eq as any).serviceIntervalHours} hrs`
                    : "N/A"}
                </span>
              </div>
              {eq.notes && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Notes:</span>{" "}
                  <span className="font-medium">{eq.notes}</span>
                </div>
              )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Info */}
          {((eq as any).purchasePrice ||
            (eq as any).dailyRate ||
            (eq as any).insuranceExpiry) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {(eq as any).purchaseDate && (
                  <div>
                    <span className="text-muted-foreground">
                      Purchase Date:
                    </span>{" "}
                    <span className="font-medium">
                      {new Date(
                        (eq as any).purchaseDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {(eq as any).purchasePrice != null && (
                  <div>
                    <span className="text-muted-foreground">
                      Purchase Price:
                    </span>{" "}
                    <span className="font-medium">
                      $
                      {(eq as any).purchasePrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                {(eq as any).dailyRate != null && (
                  <div>
                    <span className="text-muted-foreground">Daily Rate:</span>{" "}
                    <span className="font-medium">
                      $
                      {(eq as any).dailyRate.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                {(eq as any).insuranceExpiry && (
                  <div>
                    <span className="text-muted-foreground">
                      Insurance Expiry:
                    </span>{" "}
                    <span className="font-medium">
                      {new Date(
                        (eq as any).insuranceExpiry,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Service History */}
        <TabsContent value="service" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-[140px] md:w-48 h-9">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9">
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Log Service</span>
                  <span className="sm:hidden">Log</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Log Service Record</DialogTitle>
                </DialogHeader>
                <ServiceRecordForm
                  totalUsageHours={(eq as any).totalUsageHours ?? 0}
                  onSubmit={handleCreateServiceRecord}
                  isLoading={createServiceRecord.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          <ServiceTimeline
            records={serviceRecords}
            onEdit={(record) => {
              setEditingRecord(record);
              setEditDialogOpen(true);
            }}
            onDelete={(record) => {
              setDeletingRecord(record);
              setDeleteRecordDialogOpen(true);
            }}
          />
        </TabsContent>

        {/* Tab 3: Usage */}
        <TabsContent value="usage" className="space-y-3">
          {usageSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <Card>
                <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4 text-center">
                  <p className="text-[10px] md:text-xs text-muted-foreground">Total Hours</p>
                  <p className="text-base md:text-xl font-bold">{usageSummary.totalHours.toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4 text-center">
                  <p className="text-[10px] md:text-xs text-muted-foreground">Productive</p>
                  <p className="text-base md:text-xl font-bold text-green-600">{usageSummary.productiveHours.toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4 text-center">
                  <p className="text-[10px] md:text-xs text-muted-foreground">Downtime</p>
                  <p className="text-base md:text-xl font-bold text-red-600">{usageSummary.downtimeHours.toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2.5 md:pt-4 md:pb-4 md:px-4 text-center">
                  <p className="text-[10px] md:text-xs text-muted-foreground">Utilization</p>
                  <p className="text-base md:text-xl font-bold">{usageSummary.utilizationRate.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>
          )}

          {usageHistory.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">No usage records found.</p>
          ) : (
            <>
              {/* Mobile: card view */}
              <div className="md:hidden space-y-2">
                {usageHistory.map((entry, i) => (
                  <div key={i} className="rounded-lg border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {ACTIVITY_TYPE_LABELS[entry.activityType as ActivityType] ?? entry.activityType}
                      </Badge>
                      <span className="text-sm font-bold">{entry.hours.toFixed(1)}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(entry.activityDate).toLocaleDateString()}</span>
                      <span>-</span>
                      <span className="truncate">{entry.siteName}</span>
                      {entry.isDowntime && <Badge variant="destructive" className="text-[10px] px-1 py-0">DT</Badge>}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <Card className="hidden md:block">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Date</th>
                          <th className="text-left p-3 font-medium">Activity Type</th>
                          <th className="text-left p-3 font-medium">Site</th>
                          <th className="text-right p-3 font-medium">Hours</th>
                          <th className="text-center p-3 font-medium">Downtime</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usageHistory.map((entry, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="p-3">{new Date(entry.activityDate).toLocaleDateString()}</td>
                            <td className="p-3">
                              <Badge variant="outline">
                                {ACTIVITY_TYPE_LABELS[entry.activityType as ActivityType] ?? entry.activityType}
                              </Badge>
                            </td>
                            <td className="p-3">{entry.siteName}</td>
                            <td className="p-3 text-right font-medium">{entry.hours.toFixed(1)}</td>
                            <td className="p-3 text-center">
                              {entry.isDowntime ? (
                                <Badge variant="destructive" className="text-xs">Yes</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Tab 4: Site History */}
        <TabsContent value="sites" className="space-y-3">
          {siteHistory.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">No site assignment history.</p>
          ) : (
            <div className="relative space-y-0">
              <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-border" />
              {siteHistory.map((entry) => {
                const duration = entry.removedAt
                  ? Math.ceil((new Date(entry.removedAt).getTime() - new Date(entry.assignedAt).getTime()) / (1000 * 60 * 60 * 24))
                  : Math.ceil((Date.now() - new Date(entry.assignedAt).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={entry.id} className="relative pl-8 md:pl-10 pb-4">
                    <div className="absolute left-1.5 md:left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    <div className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{entry.site?.name ?? "Unknown Site"}</p>
                        {!entry.removedAt && (
                          <Badge className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0 shrink-0">Current</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.assignedAt).toLocaleDateString()}
                          {entry.removedAt && ` - ${new Date(entry.removedAt).toLocaleDateString()}`}
                        </span>
                        <span>{duration}d</span>
                        {entry.transferId && (
                          <span className="flex items-center gap-1"><ArrowRightLeft className="h-3 w-3" />Transfer</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
