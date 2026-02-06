"use client";

import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  filterOptions?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder,
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder ?? "Search..."}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>
        )}
        {filterOptions?.map((filter) => (
          <Select
            key={filter.key}
            value={
              (table.getColumn(filter.key)?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn(filter.key)
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
