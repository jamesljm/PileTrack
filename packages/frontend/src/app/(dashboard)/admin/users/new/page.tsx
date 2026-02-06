"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { UserForm } from "@/components/forms/user-form";
import { useCreateUser } from "@/queries/use-users";
import type { UserFormValues } from "@/components/forms/user-form";

export default function AdminCreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateUser();

  async function onSubmit(values: UserFormValues) {
    await createMutation.mutateAsync(values as Parameters<typeof createMutation.mutateAsync>[0]);
    toast({
      title: "User created",
      description: "The new user has been created successfully.",
    });
    router.push("/admin/users");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create User</h1>
          <p className="text-muted-foreground">
            Add a new user to the system
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Fill in the details for the new user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm onSubmit={onSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
