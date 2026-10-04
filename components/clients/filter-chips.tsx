"use client";

import { CircleX } from "lucide-react";

import { filterKey, filterLabel, type ClientFilter } from "@/lib/clients/filters";
import type { TeamMember } from "@/lib/data/types";

export function FilterChips({
  filters,
  team,
  onRemove,
  onClear,
}: {
  filters: ClientFilter[];
  team: TeamMember[];
  onRemove: (filter: ClientFilter) => void;
  onClear: () => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters" role="group">
      <ul className="contents">
        {filters.map((filter) => {
          const label = filterLabel(filter, team);
          return (
            <li
              key={filterKey(filter)}
              className="flex h-[23px] items-center gap-1.5 rounded-full border border-warning/20 pr-1 pl-2.5 text-meta font-medium text-warning animate-in fade-in-0 zoom-in-95 duration-150 ease-out"
            >
              {label}
              <button
                type="button"
                aria-label={`Remove filter: ${label}`}
                onClick={() => onRemove(filter)}
                className="relative flex size-4 items-center justify-center rounded-full text-warning/80 transition-[color,background-color] duration-100 hover:bg-warning/10 hover:text-warning after:absolute after:-inset-1"
              >
                <CircleX className="size-2.5" strokeWidth={2.5} />
              </button>
            </li>
          );
        })}
      </ul>
      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-xs px-1 text-meta text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
