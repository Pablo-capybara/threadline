import type { SortKey } from "@/lib/clients/sort";

export type ColumnId = SortKey;

export type Column = {
  id: ColumnId;
  label: string;
  /** Fixed width in px (from Figma). Omitted = takes the remaining space. */
  width?: number;
  hideable: boolean;
};

export const COLUMNS: Column[] = [
  { id: "name", label: "Client", width: 200, hideable: false },
  { id: "company", label: "Company", width: 160, hideable: true },
  { id: "stage", label: "Stage", width: 110, hideable: true },
  { id: "lastContactAt", label: "Last contact", width: 110, hideable: true },
  { id: "renewalDate", label: "Renewal date", width: 120, hideable: true },
  { id: "owner", label: "Owner", width: 140, hideable: true },
  { id: "aiSummary", label: "AI relationship summary", hideable: true },
];

export type Density = "comfortable" | "compact";
