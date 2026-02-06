"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MicropilingFormProps {
  control: Control<any>;
}

export function MicropilingForm({ control }: MicropilingFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="pileId" render={({ field }) => (
          <FormItem><FormLabel>Pile ID</FormLabel><FormControl><Input placeholder="MP-001" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="diameter" render={({ field }) => (
          <FormItem><FormLabel>Diameter (mm)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="depth" render={({ field }) => (
          <FormItem><FormLabel>Total Depth (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="drillingMethod" render={({ field }) => (
          <FormItem><FormLabel>Drilling Method</FormLabel><FormControl><Input placeholder="Rotary, Percussive..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="groutPressure" render={({ field }) => (
          <FormItem><FormLabel>Grout Pressure (bar)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="groutVolume" render={({ field }) => (
          <FormItem><FormLabel>Grout Volume (litres)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={control} name="groutMixRatio" render={({ field }) => (
        <FormItem><FormLabel>Grout Mix Ratio</FormLabel><FormControl><Input placeholder="e.g. 0.45 w/c" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="reinforcementType" render={({ field }) => (
        <FormItem><FormLabel>Reinforcement Type</FormLabel><FormControl><Input placeholder="Steel bar, Self-drilling..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="bondLength" render={({ field }) => (
          <FormItem><FormLabel>Bond Length (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="freeLength" render={({ field }) => (
          <FormItem><FormLabel>Free Length (m)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={control} name="flushType" render={({ field }) => (
        <FormItem><FormLabel>Flush Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select flush type" /></SelectTrigger></FormControl>
            <SelectContent><SelectItem value="WATER">Water</SelectItem><SelectItem value="AIR">Air</SelectItem><SelectItem value="FOAM">Foam</SelectItem><SelectItem value="MUD">Mud</SelectItem></SelectContent>
          </Select><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="testLoad" render={({ field }) => (
          <FormItem><FormLabel>Test Load (kN) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="inclination" render={({ field }) => (
          <FormItem><FormLabel>Inclination (degrees) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={control} name="casingLength" render={({ field }) => (
        <FormItem><FormLabel>Casing Length (m) - Optional</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
      )} />
    </div>
  );
}
