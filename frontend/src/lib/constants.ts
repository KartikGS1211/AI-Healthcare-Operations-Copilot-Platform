import {
  LayoutDashboard,
  FileSearch,
  History,
  Stethoscope,
  BarChart3,
  Settings,
} from "lucide-react";

export const APP_NAME = "AI Healthcare Operations Copilot";
export const APP_SHORT_NAME = "HealthCopilot";

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Prescription Analysis", href: "/prescription-analysis", icon: FileSearch },
  { title: "Patient History", href: "/patient-history", icon: History },
  { title: "Doctor Dashboard", href: "/doctor-dashboard", icon: Stethoscope },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
] as const;

export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/prescription-analysis": "Prescription Analysis",
  "/patient-history": "Patient History",
  "/doctor-dashboard": "Doctor Dashboard",
  "/analytics": "Analytics",
  "/settings": "Settings",
};
