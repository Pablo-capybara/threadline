import type { ClientFilter } from "@/lib/clients/filters";

export type ViewId = "all" | "renewing-soon" | "needs-attention";

/** Saved views apply a starting set of filters; chips can refine them further. */
export const VIEWS: { id: ViewId; label: string; filters: ClientFilter[] }[] = [
  { id: "all", label: "All Clients", filters: [] },
  { id: "renewing-soon", label: "Renewing soon", filters: [{ kind: "renewal-within", days: 30 }] },
  { id: "needs-attention", label: "Needs attention", filters: [{ kind: "no-contact", days: 14 }] },
];
