"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { ThreadlineLogo } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { NAV_FOOTER, NAV_GROUPS, type NavItem } from "./nav";

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-sidebar shrink-0 flex-col justify-between border-r border-border bg-sidebar p-[18px]">
      <div className="flex flex-col gap-5">
        <WorkspaceSwitcher />

        <nav aria-label="Main" className="flex flex-col gap-[18px]">
          {NAV_GROUPS.map((group, i) => (
            <div key={group.label} className="flex flex-col gap-[18px]">
              {/* Figma puts a hairline above ADMIN only */}
              {i === NAV_GROUPS.length - 1 && <hr className="border-border" />}
              <div className="flex flex-col gap-1">
                <h2 className="text-label font-semibold uppercase text-subtle-foreground">
                  {group.label}
                </h2>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SidebarLink item={item} active={isActive(item.href)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <ul className="flex flex-col gap-1">
        {NAV_FOOTER.map((item) => (
          <li key={item.href}>
            <SidebarLink item={item} active={isActive(item.href)} flush />
          </li>
        ))}
      </ul>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
  flush = false,
}: {
  item: NavItem;
  active: boolean;
  /** Footer items in Figma have no horizontal padding and a 10px gap. */
  flush?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-[33px] w-full items-center rounded-sm border border-transparent text-body font-medium text-muted-foreground",
        "transition-[background-color,color,border-color] duration-150 ease-out",
        "hover:text-foreground",
        flush ? "gap-2.5 px-0" : "gap-2 px-2 hover:bg-black/[0.035]",
        active &&
          "rounded-md border-sidebar-active-border bg-sidebar-active text-black hover:bg-sidebar-active",
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.5} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function WorkspaceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group -mx-1 flex items-center justify-between rounded-sm px-1 py-1 text-left outline-none",
          "transition-colors duration-150 hover:bg-black/[0.035] focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
      >
        <span className="flex items-center gap-2.5">
          <ThreadlineLogo className="shrink-0" />
          <span className="text-title font-semibold text-title">Rally Softworks</span>
        </span>
        <ChevronRight
          className="size-3.5 text-muted-foreground transition-transform duration-200 ease-out group-data-[state=open]:rotate-90"
          strokeWidth={1.75}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[224px]">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuItem>
          <ThreadlineLogo width={16} height={16} />
          Rally Softworks
          <Check className="ml-auto !text-foreground" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast("Creating workspaces is coming soon")}>
          <Plus />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
