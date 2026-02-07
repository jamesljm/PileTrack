"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityType } from "@piletrack/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_TYPE_LABELS, CONCRETE_GRADES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const pileFormSchema = z.object({
  pileId: z.string().min(1, "Pile ID is required").max(50),
  pileType: z.nativeEnum(ActivityType),
  gridRef: z.string().max(50).optional(),
  designLength: z.number().positive().optional(),
  designDiameter: z.number().positive().optional(),
  cutOffLevel: z.number().optional(),
  platformLevel: z.number().optional(),
  concreteGrade: z.string().max(20).optional(),
  concreteVolume: z.number().positive().optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  remarks: z.string().max(5000).optional(),
});

type PileFormValues = z.infer<typeof pileFormSchema>;

interface PileFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<PileFormValues>;
}

export function PileForm({ onSubmit, isLoading, defaultValues }: PileFormProps) {
  const form = useForm<PileFormValues>({
    resolver: zodResolver(pileFormSchema),
    defaultValues: {
      pileId: defaultValues?.pileId ?? "",
      pileType: defaultValues?.pileType ?? ActivityType.BORED_PILING,
      gridRef: defaultValues?.gridRef ?? "",
      remarks: defaultValues?.remarks ?? "",
    },
  });

  const handleSubmit = async (values: PileFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Pile ID & Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField control={form.control} name="pileId" render={({ field }) => (
              <FormItem>
                <FormLabel>Pile ID</FormLabel>
                <FormControl><Input placeholder="e.g. BP-01" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pileType" render={({ field }) => (
              <FormItem>
                <FormLabel>Pile Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="gridRef" render={({ field }) => (
              <FormItem>
                <FormLabel>Grid Reference</FormLabel>
                <FormControl><Input placeholder="e.g. A1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Design Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField control={form.control} name="designLength" render={({ field }) => (
              <FormItem>
                <FormLabel>Design Length (m)</FormLabel>
                <FormControl><Input type="number" step="0.1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="designDiameter" render={({ field }) => (
              <FormItem>
                <FormLabel>Design Diameter (mm)</FormLabel>
                <FormControl><Input type="number" step="1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cutOffLevel" render={({ field }) => (
              <FormItem>
                <FormLabel>Cut-off Level (mPD)</FormLabel>
                <FormControl><Input type="number" step="0.01" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="platformLevel" render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Level (mPD)</FormLabel>
                <FormControl><Input type="number" step="0.01" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="concreteGrade" render={({ field }) => (
              <FormItem>
                <FormLabel>Concrete Grade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {CONCRETE_GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="concreteVolume" render={({ field }) => (
              <FormItem>
                <FormLabel>Concrete Volume (m³)</FormLabel>
                <FormControl><Input type="number" step="0.1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <FormField control={form.control} name="remarks" render={({ field }) => (
          <FormItem>
            <FormLabel>Remarks</FormLabel>
            <FormControl><Textarea placeholder="Additional notes..." className="min-h-[80px]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-3 sticky bottom-0 bg-background py-3 -mx-3 px-3 md:relative md:mx-0 md:px-0 md:py-0 border-t md:border-0">
          <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none min-h-[44px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Pile
          </Button>
        </div>
      </form>
    </Form>
  );
}
