export type RiskLevel = "low" | "medium" | "high";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface StatMetric {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
  usageInstructions: string;
  sideEffects: string[];
}

export interface DrugInteraction {
  id: string;
  medicines: string[];
  summary: string;
  riskLevel: RiskLevel;
  recommendedAction: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "prescription" | "report" | "summary" | "alert";
}

export interface SummarySection {
  title: string;
  items: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "diagnosis" | "treatment" | "visit";
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  mrn: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  recentReports: string[];
}

export interface AnalyticsActivity {
  id: string;
  patient: string;
  action: string;
  status: "completed" | "processing" | "failed" | "warning";
  timestamp: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}
