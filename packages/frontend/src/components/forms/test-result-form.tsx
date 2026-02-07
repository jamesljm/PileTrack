"use client";

import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { TEST_TYPE_LABELS } from "@/lib/constants";

const testResultFormSchema = z.object({
  testType: z.string().min(1, "Test type is required"),
  testDate: z.string().min(1, "Date is required"),
  pileId: z.string().max(50).optional(),
  conductedBy: z.string().max(200).optional(),
  status: z.string().optional(),
  remarks: z.string().max(5000).optional(),
  // PIT fields
  pitWaveSpeed: z.coerce.number().optional(),
  pitPileLength: z.coerce.number().optional(),
  pitDefectDepth: z.coerce.number().optional(),
  pitIntegrity: z.string().optional(),
  // Cube test fields
  cubeSampleId: z.string().optional(),
  cubeAge: z.coerce.number().int().optional(),
  cubeCrushStrength: z.coerce.number().optional(),
  cubeDesignStrength: z.coerce.number().optional(),
  // Static load test fields
  staticMaxLoad: z.coerce.number().optional(),
  staticMaxSettlement: z.coerce.number().optional(),
  staticResidualSettlement: z.coerce.number().optional(),
  staticDesignLoad: z.coerce.number().optional(),
  // Dynamic load test fields
  dynamicMaxLoad: z.coerce.number().optional(),
  dynamicMaxDisplacement: z.coerce.number().optional(),
  dynamicEnergyTransferred: z.coerce.number().optional(),
  dynamicCapacity: z.coerce.number().optional(),
  // Generic key-value
  genericResults: z.string().optional(),
});

type TestResultFormValues = z.infer<typeof testResultFormSchema>;

interface TestResultFormProps {
  defaultValues?: Partial<TestResultFormValues>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  isUpdate?: boolean;
}

export function TestResultForm({
  defaultValues,
  onSubmit,
  isLoading,
  isUpdate,
}: TestResultFormProps) {
  const form = useForm<TestResultFormValues>({
    resolver: zodResolver(testResultFormSchema),
    defaultValues: {
      testType: "",
      testDate: new Date().toISOString().split("T")[0],
      pileId: "",
      conductedBy: "",
      status: "PENDING",
      remarks: "",
      genericResults: "",
      ...defaultValues,
    },
  });

  const testType = form.watch("testType");

  const handleFormSubmit = async (values: TestResultFormValues) => {
    let results: Record<string, unknown> = {};

    switch (values.testType) {
      case "PIT":
        results = {
          waveSpeed: values.pitWaveSpeed || undefined,
          pileLength: values.pitPileLength || undefined,
          defectDepth: values.pitDefectDepth || undefined,
          integrity: values.pitIntegrity || undefined,
        };
        break;
      case "CUBE_TEST":
        results = {
          sampleId: values.cubeSampleId || undefined,
          age: values.cubeAge || undefined,
          crushStrength: values.cubeCrushStrength || undefined,
          designStrength: values.cubeDesignStrength || undefined,
        };
        break;
      case "STATIC_LOAD_TEST":
        results = {
          maxLoad: values.staticMaxLoad || undefined,
          maxSettlement: values.staticMaxSettlement || undefined,
          residualSettlement: values.staticResidualSettlement || undefined,
          designLoad: values.staticDesignLoad || undefined,
        };
        break;
      case "DYNAMIC_LOAD_TEST":
        results = {
          maxLoad: values.dynamicMaxLoad || undefined,
          maxDisplacement: values.dynamicMaxDisplacement || undefined,
          energyTransferred: values.dynamicEnergyTransferred || undefined,
          capacity: values.dynamicCapacity || undefined,
        };
        break;
      default:
        if (values.genericResults) {
          try {
            results = JSON.parse(values.genericResults);
          } catch {
            results = { notes: values.genericResults };
          }
        }
    }

    await onSubmit({
      testType: values.testType,
      testDate: values.testDate,
      pileId: values.pileId || undefined,
      conductedBy: values.conductedBy || undefined,
      status: values.status || "PENDING",
      results,
      remarks: values.remarks || undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
        {/* Test Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField control={form.control} name="testType" render={({ field }) => (
            <FormItem>
              <FormLabel>Test Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select test type" /></SelectTrigger></FormControl>
                <SelectContent>
                  {Object.entries(TEST_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="testDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Test Date</FormLabel>
              <FormControl><Input type="date" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField control={form.control} name="pileId" render={({ field }) => (
            <FormItem>
              <FormLabel>Pile ID</FormLabel>
              <FormControl><Input placeholder="e.g. P-01" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="conductedBy" render={({ field }) => (
            <FormItem>
              <FormLabel>Conducted By</FormLabel>
              <FormControl><Input placeholder="Tester / Lab name" className="min-h-[44px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Conditional Result Fields */}
        {testType === "PIT" && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Pile Integrity Test Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormField control={form.control} name="pitWaveSpeed" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Wave Speed (m/s)</FormLabel>
                  <FormControl>
                    <Input type="number" step={1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="pitPileLength" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Pile Length (m)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="pitDefectDepth" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Defect Depth (m)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="pitIntegrity" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Integrity Rating</FormLabel>
                  <FormControl><Input placeholder="e.g. Good" className="min-h-[44px]" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {testType === "CUBE_TEST" && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Cube Test Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormField control={form.control} name="cubeSampleId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Sample ID</FormLabel>
                  <FormControl><Input placeholder="CS-01" className="min-h-[44px]" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="cubeAge" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Age (days)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="cubeCrushStrength" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Crush Strength (MPa)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="cubeDesignStrength" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Design Strength (MPa)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {testType === "STATIC_LOAD_TEST" && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Static Load Test Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormField control={form.control} name="staticMaxLoad" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Max Load (kN)</FormLabel>
                  <FormControl>
                    <Input type="number" step={1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="staticMaxSettlement" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Max Settlement (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="staticResidualSettlement" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Residual (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="staticDesignLoad" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Design Load (kN)</FormLabel>
                  <FormControl>
                    <Input type="number" step={1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {testType === "DYNAMIC_LOAD_TEST" && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Dynamic Load Test Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormField control={form.control} name="dynamicMaxLoad" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Max Load (kN)</FormLabel>
                  <FormControl>
                    <Input type="number" step={1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="dynamicMaxDisplacement" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Max Disp. (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="dynamicEnergyTransferred" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Energy (kJ)</FormLabel>
                  <FormControl>
                    <Input type="number" step={0.1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="dynamicCapacity" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Capacity (kN)</FormLabel>
                  <FormControl>
                    <Input type="number" step={1} className="min-h-[44px]" {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {testType && !["PIT", "CUBE_TEST", "STATIC_LOAD_TEST", "DYNAMIC_LOAD_TEST"].includes(testType) && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Test Results</h3>
            <FormField control={form.control} name="genericResults" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Results (JSON or free text)</FormLabel>
                <FormControl><Textarea placeholder='{"key": "value"} or free text notes...' className="min-h-[100px] font-mono text-xs" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}

        {/* Status */}
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PASS">Pass</SelectItem>
                <SelectItem value="FAIL">Fail</SelectItem>
                <SelectItem value="INCONCLUSIVE">Inconclusive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Remarks */}
        <FormField control={form.control} name="remarks" render={({ field }) => (
          <FormItem>
            <FormLabel>Remarks</FormLabel>
            <FormControl><Textarea placeholder="Additional notes..." className="min-h-[80px]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-h-[44px]">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdate ? "Update Test Result" : "Create Test Result"}
        </Button>
      </form>
    </Form>
  );
}
