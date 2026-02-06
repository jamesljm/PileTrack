"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user } = useAuthStore();
  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground">Your account details</p></div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1">{user.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">First Name:</span> <span className="font-medium">{user.firstName}</span></div>
            <div><span className="text-muted-foreground">Last Name:</span> <span className="font-medium">{user.lastName}</span></div>
            <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{user.email}</span></div>
            <div><span className="text-muted-foreground">Role:</span> <span className="font-medium">{user.role}</span></div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
