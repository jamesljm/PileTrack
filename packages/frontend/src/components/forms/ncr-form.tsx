"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NCRCategory, NCRPriority } from "@piletrack/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { NCR_CATEGORY_LABELS, NCR_PRIORITY_LABELS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const ncrFormSchema = z.object({
  ncrNumber: z.string().max(50).optional(),
  title: z.string().min(1, "Title is required").max(300),
  category: z.nativeEnum(NCRCategory),
  priority: z.nativeEnum(NCRPriority),
  description: z.string().min(1, "Description is required").max(5000),
  pileId: z.string().uuid().optional().or(z.literal("")),
  assignedToId: z.string().uuid().optional().or(z.literal("")),
  dueDate: z.string().optional(),
  rootCause: z.string().max(5000).optional(),
  correctiveAction: z.string().max(5000).optional(),
  preventiveAction: z.string().max(5000).optional(),
});

type NCRFormValues = z.infer<typeof ncrFormSchema>;

interface NCRFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<NCRFormValues>;
}

export function NCRForm({ onSubmit, isLoading, defaultValues }: NCRFormProps) {
  const form = useForm<NCRFormValues>({
    resolver: zodResolver(ncrFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      category: defaultValues?.category ?? NCRCategory.WORKMANSHIP,
      priority: defaultValues?.priority ?? NCRPriority.MEDIUM,
      description: defaultValues?.description ?? "",
      ncrNumber: defaultValues?.ncrNumber ?? "",
      rootCause: defaultValues?.rootCause ?? "",
      correctiveAction: defaultValues?.correctiveAction ?? "",
      preventiveAction: defaultValues?.preventiveAction ?? "",
      dueDate: defaultValues?.dueDate ?? "",
    },
  });

  const handleSubmit = async (values: NCRFormValues) => {
    const cleaned = { ...values };
    if (!cleaned.pileId) delete (cleaned as any).pileId;
    if (!cleaned.assignedToId) delete (cleaned as any).assignedToId;
    await onSubmit(cleaned);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">NCR Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="Brief description of non-conformance" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(NCR_CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="priority" render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(NCR_PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="Detailed description of the non-conformance..." className="min-h-[100px]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Investigation & Actions</h2>
          <FormField control={form.control} name="rootCause" render={({ field }) => (
            <FormItem>
              <FormLabel>Root Cause</FormLabel>
              <FormControl><Textarea placeholder="Root cause analysis..." className="min-h-[60px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="correctiveAction" render={({ field }) => (
            <FormItem>
              <FormLabel>Corrective Action</FormLabel>
              <FormControl><Textarea placeholder="Corrective action taken..." className="min-h-[60px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="preventiveAction" render={({ field }) => (
            <FormItem>
              <FormLabel>Preventive Action</FormLabel>
              <FormControl><Textarea placeholder="Preventive measures..." className="min-h-[60px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex gap-3 sticky bottom-0 bg-background py-3 -mx-3 px-3 md:relative md:mx-0 md:px-0 md:py-0 border-t md:border-0">
          <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none min-h-[44px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save NCR
          </Button>
        </div>
      </form>
    </Form>
  );
}
