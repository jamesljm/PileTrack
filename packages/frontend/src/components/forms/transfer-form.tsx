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
import type { SiteSummary, Equipment, Material } from "@piletrack/shared";

const transferFormSchema = z.object({
  fromSiteId: z.string().uuid("Select source site"),
  toSiteId: z.string().uuid("Select destination site"),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z
        .object({
          type: z.enum(["equipment", "material"]),
          equipmentId: z.string().optional(),
          materialId: z.string().optional(),
          quantity: z.coerce.number().int().positive("Quantity must be positive").optional(),
        })
        .superRefine((item, ctx) => {
          if (item.type === "equipment" && !item.equipmentId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Select equipment",
              path: ["equipmentId"],
            });
          }
          if (item.type === "material" && !item.materialId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Select material",
              path: ["materialId"],
            });
          }
          if (item.type === "material" && (!item.quantity || item.quantity < 1)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Quantity must be positive",
              path: ["quantity"],
            });
          }
        }),
    )
    .min(1, "At least one item is required"),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

interface TransferFormProps {
  sites: SiteSummary[];
  equipment: Equipment[];
  materials: Material[];
  defaultFromSiteId?: string;
  onFromSiteChange?: (siteId: string) => void;
  onSubmit: (data: TransferFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function TransferForm({
  sites,
  equipment,
  materials,
  defaultFromSiteId,
  onFromSiteChange,
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

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleFromSiteChange = (siteId: string) => {
    form.setValue("fromSiteId", siteId);
    replace([{ type: "equipment", equipmentId: "", quantity: 1 }]);
    onFromSiteChange?.(siteId);
  };

  const handleTypeChange = (index: number, newType: "equipment" | "material") => {
    form.setValue(`items.${index}.type`, newType);
    form.setValue(`items.${index}.equipmentId`, "");
    form.setValue(`items.${index}.materialId`, "");
    form.setValue(`items.${index}.quantity`, newType === "equipment" ? 1 : undefined);
  };

  const handleSubmit = async (data: TransferFormValues) => {
    const normalized = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        quantity: item.type === "equipment" ? 1 : item.quantity!,
      })),
    };
    await onSubmit(normalized);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="fromSiteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Site</FormLabel>
                <Select onValueChange={handleFromSiteChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-[44px]">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-[44px]">
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Transfer Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px]"
              onClick={() => append({ type: "equipment", equipmentId: "", quantity: 1 })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
          {fields.map((field, index) => {
            const itemType = form.watch(`items.${index}.type`);
            return (
              <div key={field.id} className="flex items-end gap-2 p-3 border rounded-md flex-wrap">
                <FormField
                  control={form.control}
                  name={`items.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="w-[130px]">
                      <FormLabel className="text-xs">Type</FormLabel>
                      <Select
                        onValueChange={(val) => handleTypeChange(index, val as "equipment" | "material")}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="min-h-[44px]">
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
                {itemType === "equipment" ? (
                  <FormField
                    control={form.control}
                    name={`items.${index}.equipmentId`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[180px]">
                        <FormLabel className="text-xs">Equipment</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="min-h-[44px]">
                              <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipment.map((eq) => (
                              <SelectItem key={eq.id} value={eq.id}>
                                {eq.name} ({eq.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name={`items.${index}.materialId`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[180px]">
                          <FormLabel className="text-xs">Material</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="min-h-[44px]">
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materials.map((mat) => (
                                <SelectItem key={mat.id} value={mat.id}>
                                  {mat.name} ({mat.code}) — stock: {mat.currentStock} {mat.unit}
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
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormLabel className="text-xs">Qty</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} className="min-h-[44px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-h-[44px]">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Transfer
        </Button>
      </form>
    </Form>
  );
}
