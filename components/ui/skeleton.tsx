import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-xs bg-stage-prospect-bg", className)}
      {...props}
    />
  );
}

export { Skeleton };
