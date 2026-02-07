"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EquipmentCategory, EquipmentCondition, EquipmentStatus } from "@piletrack/shared";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_STATUS_COLORS,
} from "@/lib/constants";
import { useState } from "react";

const equipmentFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(50),
  category: z.nativeEnum(EquipmentCategory),
  status: z.nativeEnum(EquipmentStatus).optional(),
  condition: z.nativeEnum(EquipmentCondition).optional(),
  serialNumber: z.string().max(100).optional(),
  manufacturer: z.string().max(200).optional(),
  model: z.string().max(200).optional(),
  yearOfManufacture: z.coerce.number().int().min(1900).max(2100).optional(),
  serviceIntervalHours: z.coerce.number().min(0).optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  dailyRate: z.coerce.number().min(0).optional(),
  insuranceExpiry: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

interface EquipmentFormProps {
  defaultValues?: Partial<EquipmentFormValues>;
  onSubmit: (data: EquipmentFormValues) => Promise<void>;
  isLoading?: boolean;
  isUpdate?: boolean;
}

export function EquipmentForm({
  defaultValues,
  onSubmit,
  isLoading,
  isUpdate,
}: EquipmentFormProps) {
  const [financialOpen, setFinancialOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: "",
      code: "",
      category: EquipmentCategory.GENERAL,
      condition: EquipmentCondition.GOOD,
      serialNumber: "",
      manufacturer: "",
      model: "",
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
              <FormControl><Input placeholder="Equipment name" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="code" render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl><Input placeholder="EQ-001" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                <SelectContent>
                  {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          {isUpdate && (
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(EquipmentStatus).map(([key, value]) => (
                      <SelectItem key={key} value={value}>{value.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField control={form.control} name="manufacturer" render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl><Input placeholder="Manufacturer" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="model" render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl><Input placeholder="Model" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="serialNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl><Input placeholder="Serial number" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="yearOfManufacture" render={({ field }) => (
          <FormItem>
            <FormLabel>Year of Manufacture</FormLabel>
            <FormControl>
              <Input type="number" placeholder="2024" className="min-h-[44px]" {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Service Configuration Section */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setServiceOpen(!serviceOpen)}
          >
            Service Configuration
            <ChevronDown className={`h-5 w-5 transition-transform ${serviceOpen ? "rotate-180" : ""}`} />
          </button>
          {serviceOpen && (
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField control={form.control} name="condition" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(EQUIPMENT_CONDITION_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="serviceIntervalHours" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Interval (Hours)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 250" className="min-h-[44px]" {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="insuranceExpiry" render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Expiry</FormLabel>
                  <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}
        </div>

        {/* Financial Details Section */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 min-h-[48px] text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => setFinancialOpen(!financialOpen)}
          >
            Financial Details
            <ChevronDown className={`h-5 w-5 transition-transform ${financialOpen ? "rotate-180" : ""}`} />
          </button>
          {financialOpen && (
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" className="min-h-[44px]" {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dailyRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Rate</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" className="min-h-[44px]" {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          )}
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
          {isUpdate ? "Update Equipment" : "Create Equipment"}
        </Button>
      </form>
    </Form>
  );
}
