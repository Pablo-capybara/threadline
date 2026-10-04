"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

import { findNavItem } from "./nav";

export type Crumb = { label: string; href?: string };

/** Derives "Workspace > Section [> Detail]" from the route. */
function useCrumbs(): Crumb[] {
  const pathname = usePathname();
  const item = findNavItem(pathname);
  const crumbs: Crumb[] = [{ label: "Workspace" }];
  if (item) {
    const isDetail = pathname !== item.href;
    crumbs.push({ label: item.label, href: isDetail ? item.href : undefined });
    if (isDetail) crumbs.push({ label: "Client" });
  }
  return crumbs;
}

export function Topbar() {
  const crumbs = useCrumbs();
  return (
    <header className="flex h-topbar shrink-0 items-center border-b border-border bg-background px-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-body">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <Fragment key={`${crumb.label}-${i}`}>
                {i > 0 && (
                  <li aria-hidden className="text-muted-foreground">
                    <ChevronRight className="size-3" strokeWidth={1.75} />
                  </li>
                )}
                <li>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={last ? "page" : undefined}
                      className={last ? "font-medium text-foreground" : "text-muted-foreground"}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
