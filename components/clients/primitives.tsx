"use client";

import Image from "next/image";
import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { STAGE_LABELS, type AvatarColor, type Stage, type TeamMember } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const AVATAR_BG: Record<AvatarColor, string> = {
  teal: "bg-avatar-teal",
  violet: "bg-avatar-violet",
  blue: "bg-avatar-blue",
  orange: "bg-avatar-orange",
  pink: "bg-avatar-pink",
};

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ClientAvatar({
  name,
  color,
  className,
}: {
  name: string;
  color: AvatarColor;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-xs text-2xs font-semibold tracking-[0.02em] text-white",
        AVATAR_BG[color],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

export function OwnerBadge({ owner }: { owner: TeamMember }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      {owner.avatarUrl ? (
        <Image
          src={owner.avatarUrl}
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0 rounded-xs object-cover outline outline-1 -outline-offset-1 outline-black/10"
        />
      ) : (
        <span className="size-6 shrink-0 rounded-xs bg-stage-prospect-bg" aria-hidden />
      )}
      <span className="truncate text-foreground">{owner.name}</span>
    </span>
  );
}

const STAGE_STYLES: Record<Stage, string> = {
  active: "bg-stage-active-bg text-stage-active-fg",
  renewal: "bg-stage-renewal-bg text-stage-renewal-fg",
  prospect: "bg-stage-prospect-bg text-stage-prospect-fg",
  proposal: "bg-stage-proposal-bg text-stage-proposal-fg",
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={cn(
        "inline-flex h-[21px] items-center rounded-full px-2 text-label font-semibold",
        STAGE_STYLES[stage],
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}

/**
 * Single-line text that ellipsizes, with a tooltip that only opens when the
 * text is actually cut off. The full string stays in the DOM for screen readers.
 */
export function TruncatedText({ text, className }: { text: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <Tooltip
      open={open}
      onOpenChange={(next) => {
        const el = ref.current;
        setOpen(next && !!el && el.scrollWidth > el.clientWidth);
      }}
    >
      <TooltipTrigger asChild>
        <span ref={ref} className={cn("block min-w-0 truncate", className)}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
