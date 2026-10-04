import {
  BarChart3,
  CircleHelp,
  FileText,
  ListChecks,
  Settings,
  SquareKanban,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { AtIcon, PlugsIcon } from "@/components/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon | typeof AtIcon;
};

export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "General",
    items: [
      { label: "Mentions", href: "/mentions", icon: AtIcon },
      { label: "Clients", href: "/clients", icon: Users },
      { label: "Pipeline", href: "/pipeline", icon: SquareKanban },
      { label: "Tasks", href: "/tasks", icon: ListChecks },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Notes", href: "/notes", icon: FileText },
      { label: "Digest", href: "/digest", icon: BarChart3 },
      { label: "Automations", href: "/automations", icon: Workflow },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Team", href: "/team", icon: Users },
      { label: "Integrations", href: "/integrations", icon: PlugsIcon },
    ],
  },
];

export const NAV_FOOTER: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & resources", href: "/help", icon: CircleHelp },
];

const ALL_ITEMS = [...NAV_GROUPS.flatMap((g) => g.items), ...NAV_FOOTER];

export function findNavItem(pathname: string) {
  return ALL_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}
