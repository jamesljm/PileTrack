"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import { UserRole, UserStatus } from "@piletrack/shared";
import type { User, ApiResponse } from "@piletrack/shared";
import { format } from "date-fns";

const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => api.get<ApiResponse<User>>(`/admin/users/${userId}`),
    enabled: !!userId,
  });

  const user = data?.data;

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone ?? "",
          role: user.role as UserRole,
          status: user.status as UserStatus,
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserFormValues) =>
      api.patch<ApiResponse<User>>(`/admin/users/${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({
        title: "User updated",
        description: "User details have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete<void>(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
      router.push("/admin/users");
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () =>
      api.post<ApiResponse<{ message: string }>>(
        `/admin/users/${userId}/reset-password`,
      ),
    onSuccess: () => {
      toast({
        title: "Password reset",
        description: "A password reset email has been sent to the user.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: UpdateUserFormValues) {
    await updateMutation.mutateAsync(values);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit User</h1>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">User Not Found</h1>
        </div>
        <p className="text-muted-foreground">
          The requested user could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>
                Update user information and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="user@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+852 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={UserRole.ADMIN}>
                                Admin
                              </SelectItem>
                              <SelectItem value={UserRole.SUPERVISOR}>
                                Supervisor
                              </SelectItem>
                              <SelectItem value={UserRole.WORKER}>
                                Worker
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={UserStatus.ACTIVE}>
                                Active
                              </SelectItem>
                              <SelectItem value={UserStatus.INACTIVE}>
                                Inactive
                              </SelectItem>
                              <SelectItem value={UserStatus.SUSPENDED}>
                                Suspended
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline" className="mt-1">
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 mt-1"
                      : user.status === "SUSPENDED"
                        ? "bg-red-100 text-red-800 mt-1"
                        : "bg-gray-100 text-gray-800 mt-1"
                  }
                >
                  {user.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="text-sm font-medium">
                  {user.lastLoginAt
                    ? format(new Date(user.lastLoginAt), "dd MMM yyyy HH:mm")
                    : "Never"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {format(new Date(user.createdAt), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-sm font-medium">
                  {format(new Date(user.updatedAt), "dd MMM yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => resetPasswordMutation.mutate()}
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Reset Password
              </Button>

              <Separator />

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete User"
        description={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
