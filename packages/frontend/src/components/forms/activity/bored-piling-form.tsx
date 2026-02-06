"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface BoredPilingFormProps {
  control: Control<any>;
}

export function BoredPilingForm({ control }: BoredPilingFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="pileId" render={({ field }) => (
          <FormItem>
            <FormLabel>Pile ID</FormLabel>
            <FormControl><Input placeholder="BP-001" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="diameter" render={({ field }) => (
          <FormItem>
            <FormLabel>Diameter (mm)</FormLabel>
            <FormControl><Input type="number" placeholder="1200" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="depth" render={({ field }) => (
          <FormItem>
            <FormLabel>Total Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="startDepth" render={({ field }) => (
          <FormItem>
            <FormLabel>Start Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="finalDepth" render={({ field }) => (
          <FormItem>
            <FormLabel>Final Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={control} name="reinforcementCage" render={({ field }) => (
        <FormItem>
          <FormLabel>Reinforcement Cage Details</FormLabel>
          <FormControl><Input placeholder="e.g. T40-12 bars, 300mm spacing" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="concreteVolume" render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Volume (m3)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="concreteGrade" render={({ field }) => (
          <FormItem>
            <FormLabel>Concrete Grade</FormLabel>
            <FormControl><Input placeholder="C40" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="slumpTest" render={({ field }) => (
          <FormItem>
            <FormLabel>Slump Test (mm)</FormLabel>
            <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={control} name="casingDepth" render={({ field }) => (
          <FormItem>
            <FormLabel>Casing Depth (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="tremieLength" render={({ field }) => (
          <FormItem>
            <FormLabel>Tremie Length (m)</FormLabel>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="cutOffLevel" render={({ field }) => (
          <FormItem>
            <FormLabel>Cut-off Level (mPD)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="cubeTestRef" render={({ field }) => (
          <FormItem>
            <FormLabel>Cube Test Reference</FormLabel>
            <FormControl><Input placeholder="Optional" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="casingType" render={({ field }) => (
          <FormItem>
            <FormLabel>Casing Type</FormLabel>
            <FormControl><Input placeholder="Optional" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="socketRockLength" render={({ field }) => (
          <FormItem>
            <FormLabel>Socket Rock Length (m)</FormLabel>
            <FormDescription>Optional</FormDescription>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="groundwaterLevel" render={({ field }) => (
          <FormItem>
            <FormLabel>Groundwater Level (m)</FormLabel>
            <FormDescription>Optional</FormDescription>
            <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={control} name="boreholeLog" render={({ field }) => (
        <FormItem>
          <FormLabel>Borehole Log</FormLabel>
          <FormDescription>Optional</FormDescription>
          <FormControl><Textarea placeholder="Describe borehole log..." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
