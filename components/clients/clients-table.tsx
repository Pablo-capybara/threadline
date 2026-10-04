"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX, Users } from "lucide-react";

import { SparkleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { isRenewalSoon } from "@/lib/clients/filters";
import type { SortKey, SortState } from "@/lib/clients/sort";
import { formatDate } from "@/lib/date";
import type { ClientRow } from "@/lib/data/types";
import { cn } from "@/lib/utils";

import { COLUMNS, type ColumnId, type Density } from "./columns";
import { ClientAvatar, OwnerBadge, StageBadge, TruncatedText } from "./primitives";
import { RowActions, type RowActionHandlers } from "./row-actions";

type Props = {
  clients: ClientRow[];
  today: string;
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  hiddenColumns: Set<ColumnId>;
  density: Density;
  handlers: RowActionHandlers;
  emptyState: React.ReactNode;
};

const cellPad = (id: ColumnId) => (id === "name" ? "px-4" : "px-2");

export function ClientsTable({
  clients,
  today,
  sort,
  onSortChange,
  hiddenColumns,
  density,
  handlers,
  emptyState,
}: Props) {
  const router = useRouter();
  const columns = COLUMNS.filter((c) => !hiddenColumns.has(c.id));
  const rowRefs = React.useRef<(HTMLTableRowElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Keep the roving tab stop inside the list when filtering shrinks it.
  const tabStop = Math.min(activeIndex, Math.max(clients.length - 1, 0));

  const open = (client: ClientRow, newTab = false) => {
    const href = `/clients/${client.id}`;
    if (newTab) window.open(href, "_blank", "noopener");
    else router.push(href);
  };

  const focusRow = (index: number) => {
    const next = Math.max(0, Math.min(clients.length - 1, index));
    setActiveIndex(next);
    rowRefs.current[next]?.focus();
  };

  const onRowKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, index: number) => {
    if (e.target !== e.currentTarget) return; // let buttons inside the row handle their own keys
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusRow(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusRow(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusRow(0);
        break;
      case "End":
        e.preventDefault();
        focusRow(clients.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        open(clients[index], e.metaKey || e.ctrlKey);
        break;
    }
  };

  const minWidth = columns.reduce((sum, c) => sum + (c.width ?? 220), 0);

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-background">
      <table
        className="w-full table-fixed border-collapse text-left text-body"
        style={{ minWidth }}
        aria-label="Clients"
        aria-rowcount={clients.length + 1}
      >
        <colgroup>
          {columns.map((c) => (
            <col key={c.id} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr className="h-thead border-b border-border bg-sidebar">
            {columns.map((column) => {
              const active = sort.key === column.id;
              const ariaSort = active
                ? sort.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none";
              const Icon = !active ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cn("p-0 font-medium", cellPad(column.id))}
                >
                  <button
                    type="button"
                    onClick={() => onSortChange(column.id)}
                    className={cn(
                      "group/sort relative flex h-6 max-w-full items-center rounded-xs text-label font-medium uppercase text-muted-foreground",
                      "transition-colors duration-150 hover:text-foreground",
                      active && "text-foreground",
                    )}
                  >
                    <span className="truncate">{column.label}</span>
                    {/* Absolutely placed so it never steals width from the label */}
                    <Icon
                      aria-hidden
                      strokeWidth={2}
                      className={cn(
                        "absolute left-full ml-1 size-3 shrink-0 transition-opacity duration-150",
                        active ? "opacity-100" : "opacity-0 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60",
                      )}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyState}</td>
            </tr>
          ) : (
            clients.map((client, index) => (
              <tr
                key={client.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                tabIndex={index === tabStop ? 0 : -1}
                aria-rowindex={index + 2}
                onFocus={(e) => {
                  if (e.target === e.currentTarget) setActiveIndex(index);
                }}
                onKeyDown={(e) => onRowKeyDown(e, index)}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button, a")) return;
                  open(client, e.metaKey || e.ctrlKey);
                }}
                className={cn(
                  "group/row cursor-pointer border-b border-border last:border-b-0",
                  // No row transition: hover and arrow-key focus are high-frequency.
                  "hover:bg-surface-hover",
                  "outline-none focus-visible:bg-surface-hover focus-visible:shadow-[inset_2px_0_0_var(--ring)]",
                  density === "compact" ? "h-row-compact" : "h-row",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "overflow-hidden",
                      cellPad(column.id),
                      column.id === "aiSummary" && "relative overflow-visible",
                    )}
                  >
                    <Cell column={column.id} client={client} today={today} />
                    {column.id === columns[columns.length - 1].id && (
                      <RowActions
                        client={client}
                        tabbable={index === tabStop}
                        handlers={handlers}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ column, client, today }: { column: ColumnId; client: ClientRow; today: string }) {
  switch (column) {
    case "name":
      return (
        <span className="flex min-w-0 items-center gap-2.5">
          <ClientAvatar name={client.name} color={client.avatarColor} />
          <Link
            href={`/clients/${client.id}`}
            tabIndex={-1}
            className="truncate font-medium text-foreground"
          >
            {client.name}
          </Link>
        </span>
      );
    case "company":
      return <span className="block truncate text-muted-foreground">{client.company}</span>;
    case "stage":
      return <StageBadge stage={client.stage} />;
    case "lastContactAt":
      return (
        <time dateTime={client.lastContactAt} className="whitespace-nowrap text-muted-foreground tabular-nums">
          {formatDate(client.lastContactAt)}
        </time>
      );
    case "renewalDate": {
      if (!client.renewalDate) {
        return (
          <span className="font-semibold text-muted-foreground">
            <span aria-hidden>—</span>
            <span className="sr-only">No renewal date</span>
          </span>
        );
      }
      const soon = isRenewalSoon(client.renewalDate, today);
      return (
        <time
          dateTime={client.renewalDate}
          className={cn(
            "whitespace-nowrap tabular-nums",
            soon ? "text-warning" : "text-muted-foreground",
          )}
        >
          {formatDate(client.renewalDate)}
          {soon && <span className="sr-only"> (renews within 30 days)</span>}
        </time>
      );
    }
    case "owner":
      return <OwnerBadge owner={client.owner} />;
    case "aiSummary":
      return (
        <span className="flex min-w-0 items-center gap-1.5 text-subtle-foreground">
          <SparkleIcon width={12} height={12} className="shrink-0" />
          <span className="sr-only">AI summary: </span>
          <TruncatedText text={client.aiSummary} />
        </span>
      );
  }
}

export function ClientsEmptyState({
  variant,
  onClearFilters,
  onNewClient,
}: {
  variant: "no-results" | "no-clients";
  onClearFilters: () => void;
  onNewClient: () => void;
}) {
  const noResults = variant === "no-results";
  const Icon = noResults ? SearchX : Users;
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-9 items-center justify-center rounded-md border border-border bg-sidebar text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-foreground">
          {noResults ? "No clients match these filters" : "No clients yet"}
        </p>
        <p className="max-w-xs text-muted-foreground text-pretty">
          {noResults
            ? "Remove a filter, or ask Threadline something different."
            : "Add your first client to start tracking the relationship."}
        </p>
      </div>
      {noResults ? (
        <Button size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      ) : (
        <Button variant="primary" onClick={onNewClient}>
          New Client
        </Button>
      )}
    </div>
  );
}
