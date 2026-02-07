"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  control: any;
  siteId?: string;
}

export function JackInPilingForm({ control }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={control} name="pileId" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile ID</FormLabel>
            <FormControl><Input placeholder="e.g. JP-01" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="pileType" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="RC_SPUN">RC Spun</SelectItem>
                <SelectItem value="RC_SQUARE">RC Square</SelectItem>
                <SelectItem value="STEEL_H">Steel H</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="pileSection" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile Section</FormLabel>
            <FormControl><Input placeholder="e.g. 250mm dia" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="jackingForce" render={({ field }) => (
          <FormItem>
            <FormLabel>Jacking Force (kN)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="designCapacity" render={({ field }) => (
          <FormItem>
            <FormLabel>Design Capacity (kN)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="maxJackingForce" render={({ field }) => (
          <FormItem>
            <FormLabel>Max Jacking Force (kN)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="pileLength" render={({ field }) => (
          <FormItem>
            <FormLabel>Section Length (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="numberOfSections" render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Sections</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
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
        <FormField control={control} name="finalLoad" render={({ field }) => (
          <FormItem>
            <FormLabel>Final Load (kN)</FormLabel>
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
      </div>
      <FormField control={control} name="jointDetails" render={({ field }) => (
        <FormItem>
          <FormLabel>Joint Details</FormLabel>
          <FormControl><Textarea placeholder="Describe joint details..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="terminationCriteria" render={({ field }) => (
        <FormItem>
          <FormLabel>Termination Criteria</FormLabel>
          <FormControl><Textarea placeholder="Describe termination criteria..." className="min-h-[60px]" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
