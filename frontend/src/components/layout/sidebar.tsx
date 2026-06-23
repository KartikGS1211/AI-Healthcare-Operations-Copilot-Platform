"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { APP_SHORT_NAME } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navItems: readonly SidebarNavItem[];
}

export function Sidebar({ collapsed, onToggle, navItems }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("You have been logged out");
    router.replace("/login");
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Activity className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {APP_SHORT_NAME}
            </p>
            <p className="truncate text-xs text-muted-foreground">Healthcare AI</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/patient-dashboard" &&
              pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className="relative block"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary shadow-sm shadow-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Separator className="mb-3" />
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-2 backdrop-blur-sm",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user?.initials ?? "?"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {user?.role}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
