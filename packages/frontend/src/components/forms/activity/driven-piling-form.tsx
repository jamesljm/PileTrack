"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  control: any;
  siteId?: string;
}

export function DrivenPilingForm({ control }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={control} name="pileId" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile ID</FormLabel>
            <FormControl><Input placeholder="e.g. DP-01" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="pileType" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="PRECAST">Precast</SelectItem>
                <SelectItem value="STEEL_H">Steel H</SelectItem>
                <SelectItem value="STEEL_PIPE">Steel Pipe</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="pileSection" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile Section</FormLabel>
            <FormControl><Input placeholder="e.g. 300x300mm" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="hammerType" render={({ field }) => (
          <FormItem>
            <FormLabel>Hammer Type</FormLabel>
            <FormControl><Input placeholder="e.g. Diesel Hammer" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="hammerWeight" render={({ field }) => (
          <FormItem>
            <FormLabel>Hammer Weight (tonnes)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="dropHeight" render={({ field }) => (
          <FormItem>
            <FormLabel>Drop Height (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="designLength" render={({ field }) => (
          <FormItem>
            <FormLabel>Design Length (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="actualLength" render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Length (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="finalSet" render={({ field }) => (
          <FormItem>
            <FormLabel>Final Set (mm/10 blows)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="totalBlowCount" render={({ field }) => (
          <FormItem>
            <FormLabel>Total Blow Count</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="cutOffLevel" render={({ field }) => (
          <FormItem>
            <FormLabel>Cut-off Level (mPD)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="platformLevel" render={({ field }) => (
          <FormItem>
            <FormLabel>Platform Level (mPD)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="concreteGrade" render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Grade (if precast)</FormLabel>
            <FormControl><Input placeholder="e.g. G50" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="steelGrade" render={({ field }) => (
          <FormItem>
            <FormLabel>Steel Grade (if steel)</FormLabel>
            <FormControl><Input placeholder="e.g. S355" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </div>
  );
}
