import { Skeleton } from "@/components/ui/skeleton";

import { COLUMNS } from "./columns";

// Deterministic widths so the skeleton doesn't shift between renders.
const WIDTHS = [72, 58, 84, 64, 76, 90, 60, 70, 80, 66];

export function ClientsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-6" aria-busy="true" aria-label="Loading clients">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-[33px] w-[100px] rounded-sm" />
          <Skeleton className="h-[33px] w-[112px] rounded-sm" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-[33px] w-[132px] rounded-sm" />
          <Skeleton className="h-[33px] w-[112px] rounded-sm" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-[33px] w-[480px] rounded-sm" />
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex h-thead items-center border-b border-border bg-sidebar">
          {COLUMNS.map((c) => (
            <div
              key={c.id}
              className={c.id === "name" ? "px-4" : "flex-1 px-2"}
              style={c.width ? { width: c.width, flex: "none" } : undefined}
            >
              <Skeleton className="h-2.5 w-14" />
            </div>
          ))}
        </div>
        {WIDTHS.map((w, row) => (
          <div key={row} className="flex h-row items-center border-b border-border last:border-b-0">
            {COLUMNS.map((c, col) => (
              <div
                key={c.id}
                className={c.id === "name" ? "flex items-center gap-2.5 px-4" : "flex-1 px-2"}
                style={c.width ? { width: c.width, flex: "none" } : undefined}
              >
                {c.id === "name" && <Skeleton className="size-6 shrink-0" />}
                <Skeleton
                  className={c.id === "stage" ? "h-[21px] w-16 rounded-full" : "h-3"}
                  style={c.id === "stage" ? undefined : { width: `${((w + col * 7) % 40) + 45}%` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
