"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  Target,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Log In",
    href: "/log-in",
    icon: CalendarCheck,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card px-3 py-4">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-3 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Target className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Daily Focus</p>
          <p className="text-xs text-muted-foreground">Tracker</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      {/* Footer / User area */}
      <div className="flex items-center gap-3 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium">Stay focused!</p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </aside>
  );
}
