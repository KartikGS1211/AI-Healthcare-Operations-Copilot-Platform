export type UserRole = "doctor" | "patient";

export type RiskLevel = "low" | "moderate" | "medium" | "high" | "critical";

export type SeverityLevel = RiskLevel;

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
  animate?: boolean;
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
  severity?: SeverityLevel;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "prescription" | "report" | "summary" | "alert" | "workflow";
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
  category: "diagnosis" | "treatment" | "visit" | "report" | "prescription";
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType?: string;
  mrn?: string;
  phone?: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  recentReports: string[];
}

export interface ApiPatient {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  phone: string;
  created_at: string;
}

export interface ApiReport {
  id: number;
  patient_id: number;
  file_name: string;
  file_path: string;
  report_type: string;
  extracted_text: string | null;
  summary: string | null;
  uploaded_at: string;
}

export interface ApiPrescription {
  id: number;
  report_id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose?: string;
  side_effects?: string;
  instructions?: string;
}

export interface ApiInteraction {
  id: number;
  patient_id: number;
  drug_1: string;
  drug_2: string;
  severity: string;
  mechanism: string;
  warning: string;
  recommendation: string;
}

export interface RagSearchResult {
  content: string;
  source?: string;
  confidence?: number;
  metadata?: Record<string, string>;
}

export interface WorkflowResult {
  summary?: string;
  medicines?: ApiPrescription[];
  interactions?: ApiInteraction[];
  evidence?: RagSearchResult[];
  status?: string;
}

export interface AnalyticsOverview {
  total_patients: number;
  total_reports: number;
  total_prescriptions: number;
  total_interactions: number;
}

export interface TopMedicine {
  medicine_name: string;
  count: number;
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

export type LoadingState =
  | "ocr"
  | "summary"
  | "prescription"
  | "interactions"
  | "knowledge"
  | "workflow";

export interface WorkflowStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed";
}
