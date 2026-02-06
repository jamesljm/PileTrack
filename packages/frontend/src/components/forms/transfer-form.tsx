"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { SiteSummary } from "@piletrack/shared";

const transferFormSchema = z.object({
  fromSiteId: z.string().uuid("Select source site"),
  toSiteId: z.string().uuid("Select destination site"),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        type: z.enum(["equipment", "material"]),
        equipmentId: z.string().optional(),
        materialId: z.string().optional(),
        quantity: z.coerce.number().int().positive("Quantity must be positive"),
      }),
    )
    .min(1, "At least one item is required"),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

interface TransferFormProps {
  sites: SiteSummary[];
  defaultFromSiteId?: string;
  onSubmit: (data: TransferFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function TransferForm({
  sites,
  defaultFromSiteId,
  onSubmit,
  isLoading,
}: TransferFormProps) {
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromSiteId: defaultFromSiteId ?? "",
      toSiteId: "",
      notes: "",
      items: [{ type: "equipment", equipmentId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromSiteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Site</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} ({site.code})
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
            name="toSiteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Site</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} ({site.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Transfer Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ type: "equipment", equipmentId: "", quantity: 1 })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-end gap-3 p-3 border rounded-md"
            >
              <FormField
                control={form.control}
                name={`items.${index}.type`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
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

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Transfer Request
        </Button>
      </form>
    </Form>
  );
}
