"use client";

import * as React from "react";
import { toast } from "sonner";

import { parseAsk } from "@/lib/clients/ask";
import {
  applyFilters,
  filterKey,
  filterLabel,
  upsertFilters,
  type ClientFilter,
} from "@/lib/clients/filters";
import { DEFAULT_SORT, sortClients, type SortKey, type SortState } from "@/lib/clients/sort";
import { STAGE_LABELS, type ClientRow, type TeamMember } from "@/lib/data/types";

import { AskBar } from "./ask-bar";
import { ClientsEmptyState, ClientsTable } from "./clients-table";
import { ClientsToolbar, SortControl } from "./clients-toolbar";
import type { ColumnId, Density } from "./columns";
import { FilterChips } from "./filter-chips";
import type { RowActionHandlers } from "./row-actions";
import { VIEWS, type ViewId } from "./views";

type Props = {
  clients: ClientRow[];
  team: TeamMember[];
  /** ISO date, resolved on the server so SSR and hydration agree. */
  today: string;
};

export function ClientsView({ clients, team, today }: Props) {
  const [viewId, setViewId] = React.useState<ViewId>("all");
  const [filters, setFilters] = React.useState<ClientFilter[]>([]);
  const [sort, setSort] = React.useState<SortState>(DEFAULT_SORT);
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<ColumnId>>(new Set());
  const [density, setDensity] = React.useState<Density>("comfortable");

  const visible = React.useMemo(
    () => sortClients(applyFilters(clients, filters, today), sort),
    [clients, filters, sort, today],
  );

  const onAsk = (query: string) => {
    const result = parseAsk(query, team);
    setFilters((current) => upsertFilters(current, result.filters));
    if (!result.understood) {
      toast("Searching for that text", {
        description: "Try “renewals this month”, “stage = proposal”, “owner = Sarah” or “no contact in 14 days”.",
      });
    }
  };

  const onHeaderSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, direction: s.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" },
    );

  const onViewChange = (id: ViewId) => {
    setViewId(id);
    setFilters(VIEWS.find((v) => v.id === id)?.filters ?? []);
  };

  const clearFilters = () => {
    setFilters([]);
    setViewId("all");
  };

  const handlers: RowActionHandlers = {
    onSummarize: (client) => {
      toast.promise(new Promise<string>((resolve) => setTimeout(() => resolve(client.aiSummary), 900)), {
        loading: `Summarizing ${client.name}…`,
        success: (summary) => ({
          message: `${client.name} · ${STAGE_LABELS[client.stage]}`,
          description: summary,
        }),
      });
    },
    onAddNote: (client) => toast(`Add note for ${client.name}`, { description: "Notes are coming soon." }),
    onAddTask: (client) => toast(`Add task for ${client.name}`, { description: "Tasks are coming soon." }),
  };

  const onNewClient = () => toast("New client", { description: "Client creation is coming soon." });

  return (
    <div className="flex flex-1 flex-col gap-5 p-6">
      <h1 className="sr-only">Clients</h1>

      <ClientsToolbar
        viewId={viewId}
        onViewChange={onViewChange}
        hiddenColumns={hiddenColumns}
        onToggleColumn={(id) =>
          setHiddenColumns((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          })
        }
        density={density}
        onDensityChange={setDensity}
        exportCount={visible.length}
        onExport={() => exportCsv(visible)}
        onImport={() => toast("Import from CSV", { description: "Importing is coming soon." })}
        onNewClient={onNewClient}
      />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SortControl sort={sort} onChange={setSort} />
          <AskBar onAsk={onAsk} />
        </div>
        <FilterChips
          filters={filters}
          team={team}
          onRemove={(filter) => setFilters((fs) => fs.filter((f) => filterKey(f) !== filterKey(filter)))}
          onClear={clearFilters}
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} of {clients.length} clients shown
        {filters.length > 0 && `, filtered by ${filters.map((f) => filterLabel(f, team)).join(", ")}`}
      </p>

      <ClientsTable
        clients={visible}
        today={today}
        sort={sort}
        onSortChange={onHeaderSort}
        hiddenColumns={hiddenColumns}
        density={density}
        handlers={handlers}
        emptyState={
          <ClientsEmptyState
            variant={clients.length === 0 ? "no-clients" : "no-results"}
            onClearFilters={clearFilters}
            onNewClient={onNewClient}
          />
        }
      />
    </div>
  );
}

function exportCsv(rows: ClientRow[]) {
  const header = ["Client", "Company", "Stage", "Last contact", "Renewal date", "Owner", "AI summary"];
  const escape = (v: string) => `"${v.replaceAll('"', '""')}"`;
  const lines = rows.map((c) =>
    [c.name, c.company, STAGE_LABELS[c.stage], c.lastContactAt, c.renewalDate ?? "", c.owner.name, c.aiSummary]
      .map(escape)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "threadline-clients.csv" });
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${rows.length} ${rows.length === 1 ? "client" : "clients"}`);
}
