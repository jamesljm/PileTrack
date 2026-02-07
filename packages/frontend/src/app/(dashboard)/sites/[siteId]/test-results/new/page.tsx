"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TestResultForm } from "@/components/forms/test-result-form";
import { useCreateTestResult } from "@/queries/use-test-results";
import { toast } from "@/components/ui/use-toast";

export default function NewTestResultPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const router = useRouter();
  const createTestResult = useCreateTestResult();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createTestResult.mutateAsync({ ...data, siteId } as any);
      toast({ title: "Test result created", description: "The test result has been saved successfully." });
      router.push(`/sites/${siteId}/test-results`);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Failed to create test result.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg md:text-2xl font-bold">New Test Result</h1>
      <TestResultForm onSubmit={handleSubmit} isLoading={createTestResult.isPending} />
    </div>
  );
}
