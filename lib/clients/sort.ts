import { STAGES, type ClientRow } from "@/lib/data/types";

export type SortKey =
  | "name"
  | "company"
  | "stage"
  | "lastContactAt"
  | "renewalDate"
  | "owner"
  | "aiSummary";

export type SortDirection = "asc" | "desc";
export type SortState = { key: SortKey; direction: SortDirection };

export const SORT_LABELS: Record<SortKey, string> = {
  name: "Client",
  company: "Company",
  stage: "Stage",
  lastContactAt: "Last contact",
  renewalDate: "Renewal date",
  owner: "Owner",
  aiSummary: "AI summary",
};

export const DEFAULT_SORT: SortState = { key: "renewalDate", direction: "asc" };

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function value(client: ClientRow, key: SortKey): string | number | null {
  switch (key) {
    case "stage":
      return STAGES.indexOf(client.stage);
    case "owner":
      return client.owner.name;
    default:
      return client[key];
  }
}

/** Stable sort; empty values (e.g. no renewal date) always sink to the bottom. */
export function sortClients(clients: ClientRow[], { key, direction }: SortState): ClientRow[] {
  const sign = direction === "asc" ? 1 : -1;
  return clients
    .map((client, index) => ({ client, index }))
    .sort((a, b) => {
      const va = value(a.client, key);
      const vb = value(b.client, key);
      if (va === null || vb === null) {
        if (va === vb) return a.index - b.index;
        return va === null ? 1 : -1;
      }
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : collator.compare(String(va), String(vb));
      return cmp !== 0 ? cmp * sign : a.index - b.index;
    })
    .map(({ client }) => client);
}
