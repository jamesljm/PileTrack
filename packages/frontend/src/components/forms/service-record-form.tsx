"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServiceType } from "@piletrack/shared";
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
import { Loader2 } from "lucide-react";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";

const serviceRecordFormSchema = z.object({
  serviceType: z.nativeEnum(ServiceType),
  serviceDate: z.string().min(1, "Service date is required"),
  description: z.string().min(1, "Description is required").max(2000),
  performedBy: z.string().min(1, "Performed by is required").max(200),
  cost: z.coerce.number().min(0).optional(),
  partsReplaced: z.string().max(2000).optional(),
  nextServiceDate: z.string().optional(),
  meterReading: z.coerce.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
});

type ServiceRecordFormValues = z.infer<typeof serviceRecordFormSchema>;

interface ServiceRecordFormProps {
  defaultValues?: Partial<ServiceRecordFormValues>;
  totalUsageHours?: number;
  onSubmit: (data: ServiceRecordFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ServiceRecordForm({
  defaultValues,
  totalUsageHours,
  onSubmit,
  isLoading,
}: ServiceRecordFormProps) {
  const form = useForm<ServiceRecordFormValues>({
    resolver: zodResolver(serviceRecordFormSchema),
    defaultValues: {
      serviceType: ServiceType.ROUTINE_MAINTENANCE,
      serviceDate: new Date().toISOString().split("T")[0],
      description: "",
      performedBy: "",
      meterReading: totalUsageHours ?? undefined,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the service performed..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="performedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Performed By</FormLabel>
                <FormControl>
                  <Input placeholder="Technician name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="partsReplaced"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parts Replaced</FormLabel>
              <FormControl>
                <Textarea placeholder="List parts replaced..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nextServiceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Service Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meterReading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter Reading (Hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Current hours"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log Service Record
        </Button>
      </form>
    </Form>
  );
}
