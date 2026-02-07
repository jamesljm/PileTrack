"use client";

import { useState } from "react";
import { useSites } from "@/queries/use-sites";
import { SiteCard } from "@/components/cards/site-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardsSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Plus } from "lucide-react";
import { SiteStatus } from "@piletrack/shared";
import Link from "next/link";

export default function SitesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useSites({
    search: debouncedSearch || undefined,
    status: (status as SiteStatus) || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-2xl font-bold">Sites</h1>
        <Link href="/sites/new">
          <Button size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Site</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search sites..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[120px] sm:w-[160px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? <CardsSkeleton count={6} /> : data?.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.data.map((site) => (<SiteCard key={site.id} id={site.id} name={site.name} code={site.code} status={site.status} clientName={site.clientName} />))}
        </div>
      ) : <EmptyState title="No sites found" description="Try adjusting your search or filter criteria." />}
    </div>
  );
}
