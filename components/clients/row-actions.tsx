"use client";

import { Check, File } from "lucide-react";

import { SparkleIcon } from "@/components/icons";
import type { ClientRow } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export type RowActionHandlers = {
  onSummarize: (client: ClientRow) => void;
  onAddNote: (client: ClientRow) => void;
  onAddTask: (client: ClientRow) => void;
};

/**
 * Floating pill shown on row hover / keyboard focus (Figma "hover-actions-bar").
 * Buttons are only tabbable for the row that owns keyboard focus, so Tab does
 * not walk through every hidden pill in the table.
 */
export function RowActions({
  client,
  tabbable,
  handlers,
}: {
  client: ClientRow;
  tabbable: boolean;
  handlers: RowActionHandlers;
}) {
  const actions = [
    { label: "Summarize", icon: <SparkleIcon width={12} height={12} />, run: handlers.onSummarize },
    { label: "Add note", icon: <File className="size-3" strokeWidth={1.75} />, run: handlers.onAddNote },
    { label: "Add task", icon: <Check className="size-3" strokeWidth={2} />, run: handlers.onAddTask },
  ];

  return (
    <div
      role="group"
      aria-label={`Actions for ${client.name}`}
      className={cn(
        "absolute top-1/2 right-[15px] flex h-8 items-center gap-1.5 rounded-md border border-floating-border bg-background px-2 shadow-float",
        // Entrance: fade + slight rise + scale from the right edge
        "pointer-events-none origin-right -translate-y-1/2 translate-x-1 scale-[0.97] opacity-0",
        "transition-[opacity,transform] duration-150 ease-out",
        "group-hover/row:pointer-events-auto group-hover/row:translate-x-0 group-hover/row:scale-100 group-hover/row:opacity-100",
        "group-focus-within/row:pointer-events-auto group-focus-within/row:translate-x-0 group-focus-within/row:scale-100 group-focus-within/row:opacity-100",
      )}
    >
      {actions.map((action, i) => (
        <div key={action.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="h-3 w-px bg-border" />}
          <button
            type="button"
            tabIndex={tabbable ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              action.run(client);
            }}
            className={cn(
              "relative flex items-center gap-1 whitespace-nowrap rounded-xs px-1.5 py-1 text-meta text-black",
              "transition-[background-color,transform] duration-100 ease-out hover:bg-surface-hover active:scale-[0.96]",
              "focus-visible:outline-offset-0",
              // Larger hit area than the visual chip
              "after:absolute after:-inset-y-1.5 after:inset-x-0",
            )}
          >
            {action.icon}
            {action.label}
          </button>
        </div>
      ))}
    </div>
  );
}
