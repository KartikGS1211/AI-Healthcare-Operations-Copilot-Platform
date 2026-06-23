"use client";

import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { analyticsService } from "@/services/analytics.service";
import {
  analyticsActivity,
  analyticsKPIs,
  interactionCategories,
  prescriptionTrends,
  reportAnalysisTrends,
  topMedicinesChart,
} from "@/data/mock-data";
import type { AnalyticsActivity } from "@/types";

const activityColumns = [
  { key: "patient", header: "Patient" },
  { key: "action", header: "Action" },
  {
    key: "status",
    header: "Status",
    render: (row: AnalyticsActivity) => <StatusBadge status={row.status} />,
  },
  { key: "timestamp", header: "Timestamp" },
];

export default function AnalyticsPage() {
  const { data: overview } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: analyticsService.getOverview,
    retry: false,
  });

  const { data: topMeds } = useQuery({
    queryKey: ["top-medicines"],
    queryFn: () => analyticsService.getTopMedicines(),
  });

  const { data: recentReports } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => analyticsService.getRecentReports(),
  });

  const kpis = overview
    ? [
        {
          title: "Total Patients",
          value: overview.total_patients,
          change: "+14.2%",
          trend: "up" as const,
          icon: "patients",
        },
        {
          title: "Reports Uploaded",
          value: overview.total_reports,
          change: "+9.8%",
          trend: "up" as const,
          icon: "report",
        },
        {
          title: "Prescriptions",
          value: overview.total_prescriptions,
          change: "+18.7%",
          trend: "up" as const,
          icon: "prescription",
        },
        {
          title: "Interactions",
          value: overview.total_interactions,
          change: "-2.4%",
          trend: "down" as const,
          icon: "interactions",
        },
      ]
    : analyticsKPIs;

  const topMedsData = topMeds && topMeds.length > 0
    ? topMeds.map((m) => ({ name: m.medicine_name, value: m.count }))
    : topMedicinesChart;

  const activities: AnalyticsActivity[] = recentReports && recentReports.length > 0
    ? recentReports.map((report, idx) => ({
        id: String(report.id),
        patient: `Patient #${report.patient_id}`,
        action: `Report Upload (${report.report_type})`,
        status: "completed" as const,
        timestamp: new Date(report.uploaded_at).toLocaleDateString(),
      }))
    : analyticsActivity;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics Center</h2>
        <p className="text-muted-foreground">
          Healthcare operational insights and platform performance metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart
          title="Weekly Reports"
          description="Reports processed per week"
          data={reportAnalysisTrends}
          type="line"
          dataKeys={["uploaded", "analyzed"]}
          animated
        />
        <AnalyticsChart
          title="Medicine Trends"
          description="Top prescribed medicines"
          data={topMedsData}
          type="bar"
          dataKeys={["value"]}
          animated
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart
          title="Interaction Trends"
          description="Prescriptions vs interaction alerts"
          data={prescriptionTrends}
          type="multi-bar"
          dataKeys={["prescriptions", "interactions"]}
          animated
        />
        <AnalyticsChart
          title="Report Analytics"
          description="Distribution by category"
          data={interactionCategories}
          type="pie"
          animated
        />
      </div>

      <DataTable<AnalyticsActivity>
        title="Recent Activity"
        columns={activityColumns}
        data={activities}
      />
    </div>
  );
}
