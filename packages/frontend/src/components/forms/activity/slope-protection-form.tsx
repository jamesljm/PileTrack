"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  control: any;
  siteId?: string;
}

export function SlopeProtectionForm({ control }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={control} name="method" render={({ field }) => (
          <FormItem>
            <FormLabel>Method</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="SHOTCRETE">Shotcrete</SelectItem>
                <SelectItem value="GABION">Gabion</SelectItem>
                <SelectItem value="GEOTEXTILE">Geotextile</SelectItem>
                <SelectItem value="RIP_RAP">Rip-rap</SelectItem>
                <SelectItem value="SOIL_BIOENGINEERING">Soil Bioengineering</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="chainage" render={({ field }) => (
          <FormItem>
            <FormLabel>Chainage</FormLabel>
            <FormControl><Input placeholder="e.g. CH 0+100" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="length" render={({ field }) => (
          <FormItem>
            <FormLabel>Length (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="height" render={({ field }) => (
          <FormItem>
            <FormLabel>Height (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="thickness" render={({ field }) => (
          <FormItem>
            <FormLabel>Thickness (mm)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="coverArea" render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Area (m²)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField control={control} name="drainageDetails" render={({ field }) => (
        <FormItem>
          <FormLabel>Drainage Details</FormLabel>
          <FormControl><Textarea placeholder="Describe drainage provisions..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="surfacePrep" render={({ field }) => (
        <FormItem>
          <FormLabel>Surface Preparation</FormLabel>
          <FormControl><Textarea placeholder="Describe surface preparation..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
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
