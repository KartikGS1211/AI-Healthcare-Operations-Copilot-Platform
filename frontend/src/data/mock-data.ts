import type {
  ActivityItem,
  AnalyticsActivity,
  ChartDataPoint,
  DrugInteraction,
  Medicine,
  Patient,
  StatMetric,
  SummarySection,
  TimelineEvent,
} from "@/types";

export const dashboardKPIs: StatMetric[] = [
  {
    title: "Prescriptions Processed",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: "prescription",
  },
  {
    title: "Reports Analysed",
    value: "1,923",
    change: "+8.2%",
    trend: "up",
    icon: "report",
  },
  {
    title: "Drug Interactions Detected",
    value: "156",
    change: "-3.1%",
    trend: "down",
    icon: "alert",
  },
  {
    title: "AI Summaries Generated",
    value: "4,102",
    change: "+18.7%",
    trend: "up",
    icon: "summary",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    title: "Prescription analyzed",
    description: "Patient: Sarah Mitchell — 4 medicines extracted",
    timestamp: "2 min ago",
    type: "prescription",
  },
  {
    id: "2",
    title: "Drug interaction alert",
    description: "Warfarin + Aspirin — Medium risk detected",
    timestamp: "15 min ago",
    type: "alert",
  },
  {
    id: "3",
    title: "Medical summary generated",
    description: "Patient: James Chen — Cardiology report",
    timestamp: "32 min ago",
    type: "summary",
  },
  {
    id: "4",
    title: "Report uploaded",
    description: "MRI scan report — Orthopedics department",
    timestamp: "1 hr ago",
    type: "report",
  },
  {
    id: "5",
    title: "Prescription analyzed",
    description: "Patient: Emily Rodriguez — 6 medicines extracted",
    timestamp: "2 hrs ago",
    type: "prescription",
  },
];

export const weeklyReportData: ChartDataPoint[] = [
  { name: "Mon", reports: 42, prescriptions: 38 },
  { name: "Tue", reports: 58, prescriptions: 45 },
  { name: "Wed", reports: 51, prescriptions: 52 },
  { name: "Thu", reports: 67, prescriptions: 48 },
  { name: "Fri", reports: 73, prescriptions: 61 },
  { name: "Sat", reports: 28, prescriptions: 22 },
  { name: "Sun", reports: 19, prescriptions: 15 },
];

export const monthlyPrescriptionData: ChartDataPoint[] = [
  { name: "Jan", value: 420 },
  { name: "Feb", value: 380 },
  { name: "Mar", value: 510 },
  { name: "Apr", value: 470 },
  { name: "May", value: 590 },
  { name: "Jun", value: 620 },
];

export const extractedMedicines: Medicine[] = [
  {
    id: "1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    duration: "90 days",
    purpose: "Type 2 diabetes management",
    usageInstructions: "Take with meals to reduce gastrointestinal side effects.",
    sideEffects: ["Nausea", "Diarrhea", "Vitamin B12 deficiency (long-term)"],
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "90 days",
    purpose: "Hypertension control",
    usageInstructions: "Take at the same time each morning. Monitor blood pressure regularly.",
    sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia"],
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    duration: "90 days",
    purpose: "Cholesterol management",
    usageInstructions: "Take in the evening for optimal efficacy. Avoid grapefruit juice.",
    sideEffects: ["Muscle pain", "Liver enzyme elevation", "Headache"],
  },
  {
    id: "4",
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    duration: "Ongoing",
    purpose: "Cardiovascular protection",
    usageInstructions: "Take with food to minimize stomach irritation.",
    sideEffects: ["Bleeding risk", "Stomach upset", "Bruising"],
  },
];

export const drugInteractions: DrugInteraction[] = [
  {
    id: "1",
    medicines: ["Lisinopril", "Aspirin"],
    summary:
      "Combined use may increase risk of renal impairment and reduce antihypertensive efficacy in some patients.",
    riskLevel: "medium",
    recommendedAction:
      "Monitor renal function and blood pressure. Consider alternative antiplatelet if bleeding risk is elevated.",
  },
  {
    id: "2",
    medicines: ["Atorvastatin", "Metformin"],
    summary: "No significant interaction detected at standard doses.",
    riskLevel: "low",
    recommendedAction: "Continue current regimen. Routine monitoring recommended.",
  },
];

export const patientSummarySections: SummarySection[] = [
  {
    title: "Medical Conditions",
    items: [
      "Type 2 Diabetes Mellitus (diagnosed 2018)",
      "Essential Hypertension (diagnosed 2016)",
      "Hyperlipidemia (diagnosed 2019)",
      "Mild osteoarthritis — bilateral knees",
    ],
  },
  {
    title: "Previous Procedures",
    items: [
      "Coronary angiography — 2021 (no significant stenosis)",
      "Colonoscopy — 2023 (normal findings)",
      "Cataract surgery — right eye, 2020",
    ],
  },
  {
    title: "Current Medications",
    items: [
      "Metformin 500mg BID",
      "Lisinopril 10mg daily",
      "Atorvastatin 20mg nightly",
      "Aspirin 81mg daily",
    ],
  },
  {
    title: "Allergies",
    items: ["Penicillin (rash)", "Sulfa drugs (hives)", "No known food allergies"],
  },
  {
    title: "Key Clinical Findings",
    items: [
      "HbA1c: 7.2% (last 3 months)",
      "BP: 128/82 mmHg (controlled)",
      "LDL: 98 mg/dL (at target)",
      "eGFR: 72 mL/min/1.73m² (stable)",
    ],
  },
];

export const patientTimeline: TimelineEvent[] = [
  {
    id: "1",
    date: "Mar 15, 2026",
    title: "Endocrinology Follow-up",
    description: "Diabetes management review. Medication adjustment discussed.",
    category: "visit",
  },
  {
    id: "2",
    date: "Feb 28, 2026",
    title: "HbA1c Test",
    description: "Result: 7.2%. Improved from previous 7.8%.",
    category: "diagnosis",
  },
  {
    id: "3",
    date: "Jan 10, 2026",
    title: "Physical Therapy — Knee",
    description: "12-session program for osteoarthritis pain management.",
    category: "treatment",
  },
  {
    id: "4",
    date: "Nov 22, 2025",
    title: "Cardiology Consultation",
    description: "Annual cardiovascular risk assessment. Low-moderate risk category.",
    category: "visit",
  },
  {
    id: "5",
    date: "Sep 5, 2025",
    title: "Lipid Panel",
    description: "LDL reduced to 98 mg/dL following statin therapy.",
    category: "diagnosis",
  },
];

export const samplePatient: Patient = {
  id: "P-28471",
  name: "Robert Anderson",
  age: 62,
  gender: "Male",
  bloodType: "O+",
  mrn: "MRN-2024-8471",
  conditions: [
    "Type 2 Diabetes Mellitus",
    "Hypertension",
    "Hyperlipidemia",
    "Osteoarthritis (bilateral knees)",
  ],
  medications: [
    "Metformin 500mg BID",
    "Lisinopril 10mg daily",
    "Atorvastatin 20mg nightly",
    "Aspirin 81mg daily",
  ],
  allergies: ["Penicillin", "Sulfa drugs"],
  recentReports: [
    "HbA1c Lab Report — Feb 2026",
    "Echocardiogram — Jan 2026",
    "Annual Physical — Dec 2025",
  ],
};

export const analyticsKPIs: StatMetric[] = [
  { title: "Patients Processed", value: "8,421", change: "+14.2%", trend: "up", icon: "patients" },
  { title: "Reports Uploaded", value: "5,672", change: "+9.8%", trend: "up", icon: "report" },
  { title: "Summaries Generated", value: "4,102", change: "+18.7%", trend: "up", icon: "summary" },
  { title: "Drug Alerts", value: "312", change: "-2.4%", trend: "down", icon: "alert" },
];

export const prescriptionTrends: ChartDataPoint[] = [
  { name: "Jan", prescriptions: 420, interactions: 12 },
  { name: "Feb", prescriptions: 380, interactions: 8 },
  { name: "Mar", prescriptions: 510, interactions: 15 },
  { name: "Apr", prescriptions: 470, interactions: 11 },
  { name: "May", prescriptions: 590, interactions: 18 },
  { name: "Jun", prescriptions: 620, interactions: 14 },
];

export const reportAnalysisTrends: ChartDataPoint[] = [
  { name: "Week 1", uploaded: 120, analyzed: 115 },
  { name: "Week 2", uploaded: 145, analyzed: 140 },
  { name: "Week 3", uploaded: 132, analyzed: 128 },
  { name: "Week 4", uploaded: 168, analyzed: 162 },
];

export const interactionCategories: ChartDataPoint[] = [
  { name: "Cardiovascular", value: 45 },
  { name: "CNS", value: 28 },
  { name: "GI", value: 22 },
  { name: "Renal", value: 18 },
  { name: "Other", value: 12 },
];

export const analyticsActivity: AnalyticsActivity[] = [
  {
    id: "1",
    patient: "Sarah Mitchell",
    action: "Prescription Analysis",
    status: "completed",
    timestamp: "Jun 2, 2026 10:42 AM",
  },
  {
    id: "2",
    patient: "James Chen",
    action: "Medical Summary",
    status: "completed",
    timestamp: "Jun 2, 2026 10:15 AM",
  },
  {
    id: "3",
    patient: "Emily Rodriguez",
    action: "Drug Interaction Check",
    status: "warning",
    timestamp: "Jun 2, 2026 09:48 AM",
  },
  {
    id: "4",
    patient: "Michael Torres",
    action: "Report Upload",
    status: "processing",
    timestamp: "Jun 2, 2026 09:30 AM",
  },
  {
    id: "5",
    patient: "Lisa Park",
    action: "Discharge Summary",
    status: "completed",
    timestamp: "Jun 2, 2026 08:55 AM",
  },
  {
    id: "6",
    patient: "David Kim",
    action: "Report Analysis",
    status: "failed",
    timestamp: "Jun 2, 2026 08:20 AM",
  },
];

export const sampleDischargeSummary = `DISCHARGE SUMMARY

Patient: Robert Anderson
MRN: MRN-2024-8471
Admission Date: May 28, 2026
Discharge Date: Jun 2, 2026
Attending Physician: Dr. Priya Sharma, MD

DIAGNOSIS
Primary: Acute exacerbation of Type 2 Diabetes Mellitus with hyperglycemia (ICD-10: E11.65)
Secondary: Essential Hypertension (I10), Hyperlipidemia (E78.5)

TREATMENT GIVEN
- IV fluid resuscitation and insulin drip protocol for glycemic control
- Metformin dose optimization (increased to 1000mg BID)
- Continued Lisinopril 10mg daily and Atorvastatin 20mg nightly
- Nutritional counseling with diabetes educator
- Daily blood glucose monitoring

HOSPITAL STAY DURATION
5 days (May 28 – Jun 2, 2026)

DISCHARGE INSTRUCTIONS
1. Follow up with endocrinologist within 7 days
2. Check fasting blood glucose daily; log results
3. Continue all medications as prescribed
4. Low-carbohydrate diet; limit simple sugars
5. Light activity as tolerated; avoid strenuous exercise for 1 week
6. Return to ED if blood glucose >400 mg/dL, chest pain, or shortness of breath

Patient educated on medication changes and warning signs. Discharge medications reconciled with outpatient pharmacy.`;
