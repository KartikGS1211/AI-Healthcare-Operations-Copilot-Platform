import {
  BarChart3,
  BookOpen,
  Brain,
  FileText,
  GitBranch,
  History,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldAlert,
  Stethoscope,
  Users,
} from "lucide-react";

export const APP_NAME = "AI Healthcare Operations Copilot";
export const APP_SHORT_NAME = "HealthCopilot";

export const DOCTOR_NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Patients", href: "/patients", icon: Users },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Prescriptions", href: "/prescriptions", icon: Pill },
  { title: "Interactions", href: "/interactions", icon: ShieldAlert },
  { title: "Knowledge Base", href: "/knowledge", icon: BookOpen },
  { title: "Workflow", href: "/workflow", icon: GitBranch },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
] as const;

export const PATIENT_NAV_ITEMS = [
  { title: "Dashboard", href: "/patient-dashboard", icon: LayoutDashboard },
  { title: "My Reports", href: "/patient-dashboard/reports", icon: FileText },
  { title: "AI Summaries", href: "/patient-dashboard/summaries", icon: Brain },
  { title: "Medicines", href: "/patient-dashboard/medicines", icon: Pill },
  { title: "History", href: "/patient-dashboard/history", icon: History },
  { title: "Settings", href: "/patient-dashboard/settings", icon: Settings },
] as const;

export const DOCTOR_PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/patients": "Patient Management",
  "/reports": "Report Intelligence",
  "/prescriptions": "Prescription Intelligence",
  "/interactions": "Drug Interaction Center",
  "/knowledge": "Knowledge Center",
  "/workflow": "Workflow Analysis",
  "/analytics": "Analytics Center",
  "/settings": "Settings",
};

export const PATIENT_PAGE_TITLES: Record<string, string> = {
  "/patient-dashboard": "Patient Dashboard",
  "/patient-dashboard/reports": "My Reports",
  "/patient-dashboard/summaries": "AI Summaries",
  "/patient-dashboard/medicines": "My Medicines",
  "/patient-dashboard/history": "Medical History",
  "/patient-dashboard/settings": "Settings",
};

export const WORKFLOW_STEPS = [
  { id: "ocr", label: "OCR Extraction" },
  { id: "summary", label: "AI Summary" },
  { id: "prescription", label: "Prescription Extraction" },
  { id: "interactions", label: "Drug Interaction Analysis" },
  { id: "knowledge", label: "Knowledge Retrieval" },
] as const;

export const LOADING_MESSAGES: Record<string, string> = {
  ocr: "Running OCR...",
  summary: "Generating Summary...",
  prescription: "Extracting Medicines...",
  interactions: "Detecting Interactions...",
  knowledge: "Searching Knowledge...",
  workflow: "Running Workflow...",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getRoleRedirect(role: string): string {
  return role === "patient" ? "/patient-dashboard" : "/dashboard";
}

export { Stethoscope };
