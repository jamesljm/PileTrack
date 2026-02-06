"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Loader2, Save, RefreshCw, Database, Bell, Shield, Globe } from "lucide-react";
import type { ApiResponse } from "@piletrack/shared";

interface SystemSettings {
  general: {
    appName: string;
    companyName: string;
    timezone: string;
    dateFormat: string;
    defaultLanguage: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    activityApprovalAlerts: boolean;
    lowStockAlerts: boolean;
    equipmentServiceAlerts: boolean;
    transferAlerts: boolean;
    dailyDigest: boolean;
  };
  sync: {
    syncIntervalSeconds: number;
    maxRetryAttempts: number;
    batchSize: number;
    autoSync: boolean;
  };
  security: {
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireSpecialCharacters: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    mfaEnabled: boolean;
  };
}

const generalSettingsSchema = z.object({
  appName: z.string().min(1, "App name is required").max(100),
  companyName: z.string().min(1, "Company name is required").max(200),
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  defaultLanguage: z.string().min(1, "Default language is required"),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  activityApprovalAlerts: z.boolean(),
  lowStockAlerts: z.boolean(),
  equipmentServiceAlerts: z.boolean(),
  transferAlerts: z.boolean(),
  dailyDigest: z.boolean(),
});

const syncSettingsSchema = z.object({
  syncIntervalSeconds: z.coerce.number().int().min(10).max(3600),
  maxRetryAttempts: z.coerce.number().int().min(1).max(10),
  batchSize: z.coerce.number().int().min(10).max(500),
  autoSync: z.boolean(),
});

const securitySettingsSchema = z.object({
  sessionTimeoutMinutes: z.coerce.number().int().min(5).max(1440),
  maxLoginAttempts: z.coerce.number().int().min(3).max(10),
  passwordMinLength: z.coerce.number().int().min(6).max(32),
  requireSpecialCharacters: z.boolean(),
  requireNumbers: z.boolean(),
  requireUppercase: z.boolean(),
  mfaEnabled: z.boolean(),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
type SyncSettingsValues = z.infer<typeof syncSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;

function GeneralSettingsCard({ settings }: { settings?: SystemSettings["general"] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    values: settings ?? {
      appName: "PileTrack",
      companyName: "",
      timezone: "Asia/Hong_Kong",
      dateFormat: "dd/MM/yyyy",
      defaultLanguage: "en",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: GeneralSettingsValues) =>
      api.patch<ApiResponse<SystemSettings>>("/admin/settings/general", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings saved", description: "General settings have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <div>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic application settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="appName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl><Input placeholder="Company Ltd." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="timezone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Asia/Hong_Kong">Asia/Hong Kong (HKT)</SelectItem>
                      <SelectItem value="Asia/Shanghai">Asia/Shanghai (CST)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                      <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dateFormat" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="dd MMM yyyy">DD MMM YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="defaultLanguage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Language</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh-HK">Chinese (Traditional)</SelectItem>
                      <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save General Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function NotificationSettingsCard({ settings }: { settings?: SystemSettings["notifications"] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    values: settings ?? {
      emailNotifications: true,
      pushNotifications: true,
      activityApprovalAlerts: true,
      lowStockAlerts: true,
      equipmentServiceAlerts: true,
      transferAlerts: true,
      dailyDigest: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: NotificationSettingsValues) =>
      api.patch<ApiResponse<SystemSettings>>("/admin/settings/notifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings saved", description: "Notification settings have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    },
  });

  const switchFields: Array<{
    name: keyof NotificationSettingsValues;
    label: string;
    description: string;
  }> = [
    { name: "emailNotifications", label: "Email Notifications", description: "Send notification emails to users" },
    { name: "pushNotifications", label: "Push Notifications", description: "Send browser push notifications" },
    { name: "activityApprovalAlerts", label: "Activity Approval Alerts", description: "Notify supervisors of pending approvals" },
    { name: "lowStockAlerts", label: "Low Stock Alerts", description: "Alert when material stock falls below minimum" },
    { name: "equipmentServiceAlerts", label: "Equipment Service Alerts", description: "Alert when equipment service is due" },
    { name: "transferAlerts", label: "Transfer Alerts", description: "Notify about transfer status changes" },
    { name: "dailyDigest", label: "Daily Digest", description: "Send a daily summary email to administrators" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure system-wide notification preferences</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            {switchFields.map((sf) => (
              <FormField
                key={sf.name}
                control={form.control}
                name={sf.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{sf.label}</FormLabel>
                      <FormDescription>{sf.description}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Notification Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SyncSettingsCard({ settings }: { settings?: SystemSettings["sync"] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<SyncSettingsValues>({
    resolver: zodResolver(syncSettingsSchema),
    values: settings ?? {
      syncIntervalSeconds: 30,
      maxRetryAttempts: 3,
      batchSize: 50,
      autoSync: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SyncSettingsValues) =>
      api.patch<ApiResponse<SystemSettings>>("/admin/settings/sync", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings saved", description: "Sync settings have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <div>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>Configure offline sync behavior</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="syncIntervalSeconds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sync Interval (seconds)</FormLabel>
                  <FormControl><Input type="number" min={10} max={3600} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormDescription>Time between automatic syncs</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="maxRetryAttempts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Retry Attempts</FormLabel>
                  <FormControl><Input type="number" min={1} max={10} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormDescription>Retries before marking as failed</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="batchSize" render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Size</FormLabel>
                  <FormControl><Input type="number" min={10} max={500} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormDescription>Records per sync batch</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="autoSync" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto Sync</FormLabel>
                  <FormDescription>Automatically sync when connection is restored</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Sync Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SecuritySettingsCard({ settings }: { settings?: SystemSettings["security"] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    values: settings ?? {
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialCharacters: true,
      requireNumbers: true,
      requireUppercase: true,
      mfaEnabled: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SecuritySettingsValues) =>
      api.patch<ApiResponse<SystemSettings>>("/admin/settings/security", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings saved", description: "Security settings have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <div>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure authentication and security policies</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="sessionTimeoutMinutes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Timeout (minutes)</FormLabel>
                  <FormControl><Input type="number" min={5} max={1440} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="maxLoginAttempts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Login Attempts</FormLabel>
                  <FormControl><Input type="number" min={3} max={10} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="passwordMinLength" render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Password Length</FormLabel>
                  <FormControl><Input type="number" min={6} max={32} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="requireSpecialCharacters" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Special Characters</FormLabel>
                  <FormDescription>Passwords must contain at least one special character</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="requireNumbers" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Numbers</FormLabel>
                  <FormDescription>Passwords must contain at least one number</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="requireUppercase" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Uppercase</FormLabel>
                  <FormDescription>Passwords must contain at least one uppercase letter</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="mfaEnabled" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Multi-Factor Authentication</FormLabel>
                  <FormDescription>Require MFA for all users (TOTP-based)</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Security Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function AdminSettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => api.get<ApiResponse<SystemSettings>>("/admin/settings"),
  });

  const settings = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide application settings
          </p>
        </div>
        <FormSkeleton />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide application settings
        </p>
      </div>

      <GeneralSettingsCard settings={settings?.general} />
      <NotificationSettingsCard settings={settings?.notifications} />
      <SyncSettingsCard settings={settings?.sync} />
      <SecuritySettingsCard settings={settings?.security} />
    </div>
  );
}
