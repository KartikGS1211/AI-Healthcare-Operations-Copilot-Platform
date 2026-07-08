import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { reportService } from "@/services/report.service";
import { interactionService } from "@/services/interaction.service";
import { patientService } from "@/services/patient.service";

interface NavbarProps {
  title: string;
  settingsHref?: string;
  onMenuClick?: () => void;
}

export function Navbar({
  title,
  settingsHref = "/settings",
  onMenuClick,
}: NavbarProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState<
    {
      id: string;
      title: string;
      desc: string;
      time: string;
      unread: boolean;
      timestamp: number;
    }[]
  >([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  // Load read notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("read_notification_ids");
    if (stored) {
      try {
        setReadIds(JSON.parse(stored));
      } catch {
        // Ignore
      }
    }
  }, []);

  // Fetch live notifications
  useEffect(() => {
    if (!user) return;

    let active = true;

    async function fetchNotifications() {
      try {
        const list: typeof notifications = [];

        if (user?.role === "doctor") {
          // Fetch reports
          const reports = await reportService.getAll();
          reports.forEach((report) => {
            list.push({
              id: `report-${report.id}`,
              title: `New ${report.report_type.toUpperCase()} Report`,
              desc: `Report parsed for Patient #${report.patient_id} (${report.file_name})`,
              time: formatRelativeTime(new Date(report.uploaded_at).getTime()),
              unread: !readIds.includes(`report-${report.id}`),
              timestamp: new Date(report.uploaded_at).getTime(),
            });
          });
        } else if (user?.role === "patient") {
          try {
            const me = await patientService.getMe();
            if (me?.id) {
              const [reports, interactions] = await Promise.all([
                reportService.getByPatient(me.id),
                interactionService.getByPatient(me.id),
              ]);

              reports.forEach((report) => {
                list.push({
                  id: `report-${report.id}`,
                  title: `Medical Report Processed`,
                  desc: `Your ${report.report_type} report (${report.file_name}) has been summarized.`,
                  time: formatRelativeTime(
                    new Date(report.uploaded_at).getTime(),
                  ),
                  unread: !readIds.includes(`report-${report.id}`),
                  timestamp: new Date(report.uploaded_at).getTime(),
                });
              });

              interactions.forEach((interaction) => {
                const ts = new Date(
                  interaction.created_at || Date.now(),
                ).getTime();
                list.push({
                  id: `interaction-${interaction.id}`,
                  title: `${interaction.severity.toUpperCase()} Interaction Warning`,
                  desc: `Potential conflict between ${interaction.drug_1} and ${interaction.drug_2}.`,
                  time: formatRelativeTime(ts),
                  unread: !readIds.includes(`interaction-${interaction.id}`),
                  timestamp: ts,
                });
              });
            }
          } catch (err) {
            console.error("Failed to load patient notifications", err);
          }
        }

        // Sort by timestamp desc (newest first)
        list.sort((a, b) => b.timestamp - a.timestamp);

        if (active) {
          setNotifications(list.slice(0, 15)); // Limit to most recent 15
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user, readIds]);

  function formatRelativeTime(timestamp: number) {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const unique = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(unique);
    localStorage.setItem("read_notification_ids", JSON.stringify(unique));
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (id: string) => {
    if (readIds.includes(id)) return;
    const updated = [...readIds, id];
    setReadIds(updated);
    localStorage.setItem("read_notification_ids", JSON.stringify(updated));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  function handleLogout() {
    logout();
    toast.success("You have been logged out");
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h1>
      </div>

      <div className="hidden max-w-sm flex-1 md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, reports..."
            className="h-9 border-border/50 bg-muted/40 pl-9 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive p-0 text-[10px] text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto space-y-1">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleNotificationClick(item.id)}
                    className="flex flex-col items-start gap-1 p-2 rounded-md transition-colors focus:bg-muted/80! focus:text-foreground! cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span
                        className={cn(
                          "font-medium text-xs text-foreground group-focus/dropdown-menu-item:text-foreground!",
                          item.unread &&
                            "text-primary group-focus/dropdown-menu-item:text-primary!",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground group-focus/dropdown-menu-item:text-muted-foreground!">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left line-clamp-2 group-focus/dropdown-menu-item:text-muted-foreground!">
                      {item.desc}
                    </p>
                    {item.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none">
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {user?.initials ?? "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={settingsHref} />}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={settingsHref} />}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
