import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6" aria-busy="true" aria-label="Loading client">
      <Skeleton className="h-4 w-20" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-sm" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
