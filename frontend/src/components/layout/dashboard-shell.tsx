"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar, type SidebarNavItem } from "./sidebar";
import { Navbar } from "./navbar";
import { PageTransition } from "./page-transition";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: readonly SidebarNavItem[];
  pageTitles: Record<string, string>;
  settingsHref?: string;
}

export function DashboardShell({
  children,
  navItems,
  pageTitles,
  settingsHref,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Dashboard";

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        navItems={navItems}
      />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 lg:hidden">
          <div className="h-full">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              navItems={navItems}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        <Navbar
          title={title}
          settingsHref={settingsHref}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
