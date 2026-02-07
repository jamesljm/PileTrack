"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CONCRETE_GRADES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const cdFormSchema = z.object({
  doNumber: z.string().min(1, "DO Number is required").max(50),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  supplier: z.string().min(1, "Supplier is required").max(200),
  batchPlant: z.string().max(200).optional(),
  truckNumber: z.string().max(50).optional(),
  concreteGrade: z.string().min(1, "Concrete grade is required").max(20),
  volume: z.number().positive("Volume must be positive"),
  slumpRequired: z.number().min(0).optional(),
  slumpActual: z.number().min(0).optional(),
  batchTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  pourStartTime: z.string().optional(),
  pourEndTime: z.string().optional(),
  temperature: z.number().optional(),
  cubesTaken: z.number().int().min(0).optional(),
  rejected: z.boolean().default(false),
  rejectionReason: z.string().max(2000).optional(),
  remarks: z.string().max(5000).optional(),
});

type CDFormValues = z.infer<typeof cdFormSchema>;

interface ConcreteDeliveryFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<CDFormValues>;
}

export function ConcreteDeliveryForm({ onSubmit, isLoading, defaultValues }: ConcreteDeliveryFormProps) {
  const form = useForm<CDFormValues>({
    resolver: zodResolver(cdFormSchema),
    defaultValues: {
      doNumber: defaultValues?.doNumber ?? "",
      deliveryDate: defaultValues?.deliveryDate ?? new Date().toISOString().split("T")[0],
      supplier: defaultValues?.supplier ?? "",
      concreteGrade: defaultValues?.concreteGrade ?? "",
      rejected: false,
      remarks: defaultValues?.remarks ?? "",
    },
  });

  const isRejected = form.watch("rejected");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v))} className="space-y-4 md:space-y-6">
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Delivery Order Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField control={form.control} name="doNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>DO Number</FormLabel>
                <FormControl><Input placeholder="e.g. DO-001" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="deliveryDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="supplier" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl><Input placeholder="e.g. Lafarge" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="batchPlant" render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Plant</FormLabel>
                <FormControl><Input placeholder="Plant name" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="truckNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Truck Number</FormLabel>
                <FormControl><Input placeholder="e.g. WKL 1234" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Concrete Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField control={form.control} name="concreteGrade" render={({ field }) => (
              <FormItem>
                <FormLabel>Concrete Grade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {CONCRETE_GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="volume" render={({ field }) => (
              <FormItem>
                <FormLabel>Volume (m³)</FormLabel>
                <FormControl><Input type="number" step="0.1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="slumpRequired" render={({ field }) => (
              <FormItem>
                <FormLabel>Slump Required (mm)</FormLabel>
                <FormControl><Input type="number" step="1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="slumpActual" render={({ field }) => (
              <FormItem>
                <FormLabel>Slump Actual (mm)</FormLabel>
                <FormControl><Input type="number" step="1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="temperature" render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature (°C)</FormLabel>
                <FormControl><Input type="number" step="0.1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cubesTaken" render={({ field }) => (
              <FormItem>
                <FormLabel>Cubes Taken</FormLabel>
                <FormControl><Input type="number" step="1" onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-semibold">Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FormField control={form.control} name="batchTime" render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Time</FormLabel>
                <FormControl><Input type="time" className="min-h-[44px]" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="arrivalTime" render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Time</FormLabel>
                <FormControl><Input type="time" className="min-h-[44px]" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pourStartTime" render={({ field }) => (
              <FormItem>
                <FormLabel>Pour Start</FormLabel>
                <FormControl><Input type="time" className="min-h-[44px]" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pourEndTime" render={({ field }) => (
              <FormItem>
                <FormLabel>Pour End</FormLabel>
                <FormControl><Input type="time" className="min-h-[44px]" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <FormField control={form.control} name="rejected" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Delivery Rejected</FormLabel>
            </div>
          </FormItem>
        )} />

        {isRejected && (
          <FormField control={form.control} name="rejectionReason" render={({ field }) => (
            <FormItem>
              <FormLabel>Rejection Reason</FormLabel>
              <FormControl><Textarea placeholder="Reason for rejection..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}

        <FormField control={form.control} name="remarks" render={({ field }) => (
          <FormItem>
            <FormLabel>Remarks</FormLabel>
            <FormControl><Textarea placeholder="Additional notes..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-3 sticky bottom-0 bg-background py-3 -mx-3 px-3 md:relative md:mx-0 md:px-0 md:py-0 border-t md:border-0">
          <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none min-h-[44px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Delivery
          </Button>
        </div>
      </form>
    </Form>
  );
}
