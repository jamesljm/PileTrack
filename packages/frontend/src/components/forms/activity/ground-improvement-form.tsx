"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  control: any;
  siteId?: string;
}

export function GroundImprovementForm({ control }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={control} name="method" render={({ field }) => (
          <FormItem>
            <FormLabel>Method</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="VIBRO_REPLACEMENT">Vibro Replacement</SelectItem>
                <SelectItem value="STONE_COLUMN">Stone Column</SelectItem>
                <SelectItem value="JGP">Jet Grouting (JGP)</SelectItem>
                <SelectItem value="DSM">Deep Soil Mixing (DSM)</SelectItem>
                <SelectItem value="COMPACTION_GROUTING">Compaction Grouting</SelectItem>
                <SelectItem value="CEMENT_MIXING">Cement Mixing</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="gridRef" render={({ field }) => (
          <FormItem>
            <FormLabel>Grid Reference</FormLabel>
            <FormControl><Input placeholder="e.g. A1" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="depth" render={({ field }) => (
          <FormItem>
            <FormLabel>Treatment Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="diameter" render={({ field }) => (
          <FormItem>
            <FormLabel>Column Diameter (mm)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="columnSpacing" render={({ field }) => (
          <FormItem>
            <FormLabel>Column Spacing (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="treatmentArea" render={({ field }) => (
          <FormItem>
            <FormLabel>Treatment Area (m²)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="injectionPressure" render={({ field }) => (
          <FormItem>
            <FormLabel>Injection Pressure (bar)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="injectionVolume" render={({ field }) => (
          <FormItem>
            <FormLabel>Injection Volume (litres)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField control={control} name="groutMix" render={({ field }) => (
        <FormItem>
          <FormLabel>Grout Mix</FormLabel>
          <FormControl><Input placeholder="e.g. 1:1 OPC:Water" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="fillMaterial" render={({ field }) => (
        <FormItem>
          <FormLabel>Fill Material</FormLabel>
          <FormControl><Input placeholder="e.g. Crushed Stone 20-40mm" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="remarks" render={({ field }) => (
        <FormItem>
          <FormLabel>Remarks</FormLabel>
          <FormControl><Textarea placeholder="Additional remarks..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
