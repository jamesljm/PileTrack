"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  control: any;
  siteId?: string;
}

export function ContiguousBoredPileForm({ control }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={control} name="pileId" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile ID</FormLabel>
            <FormControl><Input placeholder="e.g. CBP-01" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="wallSectionId" render={({ field }) => (
          <FormItem>
            <FormLabel>Wall Section ID</FormLabel>
            <FormControl><Input placeholder="e.g. WS-A" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="panelId" render={({ field }) => (
          <FormItem>
            <FormLabel>Panel ID</FormLabel>
            <FormControl><Input placeholder="e.g. P-01" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="pileSpacing" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile Spacing (m)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="diameter" render={({ field }) => (
          <FormItem>
            <FormLabel>Diameter (mm)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="depth" render={({ field }) => (
          <FormItem>
            <FormLabel>Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="concreteGrade" render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Grade</FormLabel>
            <FormControl><Input placeholder="e.g. G35" {...field} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="concreteVolume" render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Volume (m³)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="slumpTest" render={({ field }) => (
          <FormItem>
            <FormLabel>Slump Test (mm)</FormLabel>
            <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="finalDepth" render={({ field }) => (
          <FormItem>
            <FormLabel>Final Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} value={field.value ?? ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField control={control} name="reinforcementCage" render={({ field }) => (
        <FormItem>
          <FormLabel>Reinforcement Cage</FormLabel>
          <FormControl><Input placeholder="e.g. 12H25 + H10@200" {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="isSecant" render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Secant Pile (overlapping)</FormLabel>
          </div>
        </FormItem>
      )} />
      <FormField control={control} name="guideWallDetails" render={({ field }) => (
        <FormItem>
          <FormLabel>Guide Wall Details</FormLabel>
          <FormControl><Input placeholder="Guide wall details..." {...field} value={field.value ?? ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
