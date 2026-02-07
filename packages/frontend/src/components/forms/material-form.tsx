"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const materialFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(50),
  unit: z.string().min(1, "Unit is required").max(20),
  currentStock: z.coerce.number().min(0, "Stock must be non-negative"),
  minimumStock: z.coerce.number().min(0, "Minimum stock must be non-negative"),
  category: z.string().max(100).optional(),
  supplier: z.string().max(200).optional(),
  unitPrice: z.coerce.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
});

type MaterialFormValues = z.infer<typeof materialFormSchema>;

interface MaterialFormProps {
  defaultValues?: Partial<MaterialFormValues>;
  onSubmit: (data: MaterialFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function MaterialForm({
  defaultValues,
  onSubmit,
  isLoading,
}: MaterialFormProps) {
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      name: "",
      code: "",
      unit: "",
      currentStock: 0,
      minimumStock: 0,
      category: "",
      supplier: "",
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="Material name" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="code" render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl><Input placeholder="MAT-001" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <FormField control={form.control} name="unit" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs md:text-sm">Unit</FormLabel>
              <FormControl><Input placeholder="kg" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="currentStock" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs md:text-sm">Current</FormLabel>
              <FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="minimumStock" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs md:text-sm">Minimum</FormLabel>
              <FormControl><Input type="number" step="0.01" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl><Input placeholder="Category" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="supplier" render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl><Input placeholder="Supplier name" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="unitPrice" render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" className="min-h-[44px]" {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl><Textarea placeholder="Additional notes..." className="min-h-[80px]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-h-[44px]">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {defaultValues ? "Update Material" : "Create Material"}
        </Button>
      </form>
    </Form>
  );
}
