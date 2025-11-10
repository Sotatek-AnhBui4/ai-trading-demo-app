"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Repeat,
  History,
  Settings,
  User,
  Brain,
  Activity,
  Monitor,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "AI Signals",
    href: "/signals",
    icon: TrendingUp,
    badge: "Real-time",
  },
  {
    name: "AI Recommendations",
    href: "/recommendations",
    icon: Brain,
    badge: "New",
  },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Exchange", href: "/exchange", icon: Repeat },
  { name: "History", href: "/history", icon: History },
];

const tradingFlow = [
  {
    name: "Execution Monitor",
    href: "/execution",
    icon: Activity,
    badge: "New",
  },
  {
    name: "Post-Trade Monitor",
    href: "/monitoring",
    icon: Monitor,
    badge: "New",
  },
];

const systemMenu = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-smooth",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5" />
          {item.name}
        </div>
        {item.badge && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded font-semibold",
              isActive
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Brokk AI Trading</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
        {/* Main Menu */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navigation.map(renderNavItem)}
        </div>

        <Separator className="my-4" />

        {/* Trading Flow */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Trading Flow
          </p>
          {tradingFlow.map(renderNavItem)}
        </div>

        <Separator className="my-4" />

        {/* System */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            System
          </p>
          {systemMenu.map(renderNavItem)}
        </div>
      </nav>

      {/* Footer - Disclaimer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          No guaranteed profits. Results are probabilistic. Not financial
          advice.
        </p>
      </div>
    </div>
  );
}
