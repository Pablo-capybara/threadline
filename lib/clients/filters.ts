import { daysBetween, isSameMonth } from "@/lib/date";
import { STAGE_LABELS, type ClientRow, type Stage, type TeamMember } from "@/lib/data/types";

export type ClientFilter =
  | { kind: "renewal-this-month" }
  | { kind: "renewal-within"; days: number }
  | { kind: "stage"; stage: Stage }
  | { kind: "owner"; ownerId: string }
  | { kind: "no-contact"; days: number }
  | { kind: "text"; query: string };

/** Renewals at or under this many days out are highlighted. */
export const RENEWAL_SOON_DAYS = 30;

/**
 * Filters are keyed by kind: adding a filter of a kind that is already
 * applied replaces it, so "owner = Sarah" then "owner = James" swaps owners
 * instead of producing an empty AND.
 */
export function filterKey(filter: ClientFilter): string {
  return filter.kind === "renewal-within" ? "renewal-this-month" : filter.kind;
}

export function upsertFilters(current: ClientFilter[], next: ClientFilter[]): ClientFilter[] {
  const keys = new Set(next.map(filterKey));
  return [...current.filter((f) => !keys.has(filterKey(f))), ...next];
}

export function filterLabel(filter: ClientFilter, team: TeamMember[]): string {
  switch (filter.kind) {
    case "renewal-this-month":
      return "Renewal this month";
    case "renewal-within":
      return `Renewal in next ${filter.days} days`;
    case "stage":
      return `Stage: ${STAGE_LABELS[filter.stage]}`;
    case "owner":
      return `Owner: ${team.find((m) => m.id === filter.ownerId)?.name ?? "Unknown"}`;
    case "no-contact":
      return `No contact in ${filter.days}+ days`;
    case "text":
      return `“${filter.query}”`;
  }
}

export function matchesFilter(client: ClientRow, filter: ClientFilter, today: string): boolean {
  switch (filter.kind) {
    case "renewal-this-month":
      return client.renewalDate !== null && isSameMonth(client.renewalDate, today);
    case "renewal-within": {
      if (!client.renewalDate) return false;
      const days = daysBetween(today, client.renewalDate);
      return days >= 0 && days <= filter.days;
    }
    case "stage":
      return client.stage === filter.stage;
    case "owner":
      return client.ownerId === filter.ownerId;
    case "no-contact":
      return daysBetween(client.lastContactAt, today) >= filter.days;
    case "text": {
      const haystack = [client.name, client.company, client.owner.name, client.aiSummary]
        .join(" ")
        .toLowerCase();
      return searchTerms(filter.query).every((term) => haystack.includes(term));
    }
  }
}

const FILLER_WORDS = new Set([
  "ask", "threadline:", "threadline", "show", "find", "me", "all", "the", "a", "an",
  "client", "clients", "with", "who", "are", "is", "please", "list",
]);

function searchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term && !FILLER_WORDS.has(term));
}

export function applyFilters(clients: ClientRow[], filters: ClientFilter[], today: string) {
  return clients.filter((c) => filters.every((f) => matchesFilter(c, f, today)));
}

/** True when the renewal date is overdue or within the highlight window. */
export function isRenewalSoon(renewalDate: string | null, today: string): boolean {
  return renewalDate !== null && daysBetween(today, renewalDate) <= RENEWAL_SOON_DAYS;
}
