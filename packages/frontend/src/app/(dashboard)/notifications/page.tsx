"use client";

import { useNotifications, useMarkRead, useMarkAllRead } from "@/queries/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground">Stay updated on activities and alerts</p></div>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}><CheckCheck className="mr-2 h-4 w-4" />Mark All Read</Button>
      </div>
      {isLoading ? <TableSkeleton rows={5} cols={1} /> : data?.data?.length ? (
        <div className="space-y-3">
          {data.data.map((notification) => (
            <Card key={notification.id} className={notification.isRead ? "opacity-60" : ""} onClick={() => !notification.isRead && markRead.mutate(notification.id)}>
              <CardContent className="p-4 flex items-start gap-3 cursor-pointer">
                <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    {!notification.isRead && <Badge className="text-[10px]">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon={Bell} title="No notifications" description="You are all caught up." />}
    </div>
  );
}
