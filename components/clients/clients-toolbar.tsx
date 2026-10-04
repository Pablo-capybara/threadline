"use client";

import { ArrowUpDown, ChevronDown, Download, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_LABELS, type SortKey, type SortState } from "@/lib/clients/sort";
import { cn } from "@/lib/utils";

import { COLUMNS, type ColumnId, type Density } from "./columns";
import { VIEWS, type ViewId } from "./views";

const chevron = <ChevronDown className="size-3 text-muted-foreground" strokeWidth={2} />;

export function ClientsToolbar({
  viewId,
  onViewChange,
  hiddenColumns,
  onToggleColumn,
  density,
  onDensityChange,
  exportCount,
  onExport,
  onImport,
  onNewClient,
}: {
  viewId: ViewId;
  onViewChange: (id: ViewId) => void;
  hiddenColumns: Set<ColumnId>;
  onToggleColumn: (id: ColumnId) => void;
  density: Density;
  onDensityChange: (density: Density) => void;
  exportCount: number;
  onExport: () => void;
  onImport: () => void;
  onNewClient: () => void;
}) {
  const view = VIEWS.find((v) => v.id === viewId) ?? VIEWS[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" aria-label={`View: ${view.label}`}>
              {view.label}
              {chevron}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Views</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={viewId} onValueChange={(v) => onViewChange(v as ViewId)}>
              {VIEWS.map((v) => (
                <DropdownMenuRadioItem key={v.id} value={v.id}>
                  {v.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="font-normal">
              View settings
              {chevron}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {COLUMNS.filter((c) => c.hideable).map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={!hiddenColumns.has(c.id)}
                onCheckedChange={() => onToggleColumn(c.id)}
                onSelect={(e) => e.preventDefault()}
              >
                {c.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={density}
              onValueChange={(d) => onDensityChange(d as Density)}
            >
              <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <ArrowUpDown className="size-3.5" strokeWidth={1.75} />
              Import / Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={onImport}>
              <Upload />
              Import from CSV…
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onExport} disabled={exportCount === 0}>
              <Download />
              Export {exportCount} {exportCount === 1 ? "client" : "clients"} as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="primary" onClick={onNewClient}>
          <Plus className="size-3.5" strokeWidth={2} />
          New Client
        </Button>
      </div>
    </div>
  );
}

const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[];

export function SortControl({
  sort,
  onChange,
}: {
  sort: SortState;
  onChange: (sort: SortState) => void;
}) {
  return (
    <div className="flex items-center gap-1 text-meta">
      <span className="text-muted-foreground">Sorted by</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "group -mx-1 flex items-center gap-0.5 rounded-xs px-1 py-0.5 font-semibold text-foreground outline-none",
            "transition-colors duration-150 hover:bg-surface-hover data-[state=open]:bg-surface-hover",
            "focus-visible:ring-2 focus-visible:ring-ring/40",
          )}
        >
          {SORT_LABELS[sort.key]}
          <span className="sr-only">
            , {sort.direction === "asc" ? "ascending" : "descending"}. Change sort
          </span>
          <ChevronDown
            aria-hidden
            className="size-2.5 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
            strokeWidth={2.5}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={sort.key}
            onValueChange={(key) => onChange({ ...sort, key: key as SortKey })}
          >
            {SORT_KEYS.map((key) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {SORT_LABELS[key]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sort.direction}
            onValueChange={(direction) =>
              onChange({ ...sort, direction: direction as SortState["direction"] })
            }
          >
            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
