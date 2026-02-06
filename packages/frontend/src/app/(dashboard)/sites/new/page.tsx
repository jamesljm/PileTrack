"use client";

import { useRouter } from "next/navigation";
import { SiteForm } from "@/components/forms/site-form";
import { useCreateSite } from "@/queries/use-sites";
import { toast } from "@/components/ui/use-toast";
import type { SiteFormValues } from "@/components/forms/site-form";

export default function NewSitePage() {
  const router = useRouter();
  const createSite = useCreateSite();

  const handleSubmit = async (data: SiteFormValues) => {
    try {
      await createSite.mutateAsync(data as any);
      toast({ title: "Site created", description: "The site has been created successfully." });
      router.push("/sites");
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create site.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Create New Site</h1><p className="text-muted-foreground">Add a new construction site</p></div>
      <SiteForm onSubmit={handleSubmit} isLoading={createSite.isPending} />
    </div>
  );
}
