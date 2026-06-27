"use client";

import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { analyticsService } from "@/services/analytics.service";

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

  const { data: weeklyTrends } = useQuery({
    queryKey: ["weekly-trends"],
    queryFn: () => analyticsService.getWeeklyTrends(),
  });

  const { data: reportDistribution } = useQuery({
    queryKey: ["report-distribution"],
    queryFn: () => analyticsService.getReportDistribution(),
  });


  const kpis = [
    {
      title: "Total Patients",
      value: overview?.total_patients ?? 0,
      change: overview ? "+14.2%" : "",
      trend: overview ? ("up" as const) : ("neutral" as const),
      icon: "patients",
    },
    {
      title: "Reports Uploaded",
      value: overview?.total_reports ?? 0,
      change: overview ? "+9.8%" : "",
      trend: overview ? ("up" as const) : ("neutral" as const),
      icon: "report",
    },
    {
      title: "Prescriptions",
      value: overview?.total_prescriptions ?? 0,
      change: overview ? "+18.7%" : "",
      trend: overview ? ("up" as const) : ("neutral" as const),
      icon: "prescription",
    },
    {
      title: "Interactions",
      value: overview?.total_interactions ?? 0,
      change: overview ? "-2.4%" : "",
      trend: overview ? ("down" as const) : ("neutral" as const),
      icon: "interactions",
    },
  ];

  const topMedsData = topMeds
    ? topMeds.map((m) => ({ name: m.medicine_name, value: m.count }))
    : [];

  const weeklyTrendsData = weeklyTrends ?? [];

  const prescriptionTrendsData = weeklyTrends ?? [];

  const reportDistributionData = reportDistribution ?? [];

  const activities: AnalyticsActivity[] = recentReports
    ? recentReports.map((report, idx) => ({
        id: String(report.id),
        patient: `Patient #${report.patient_id}`,
        action: `Report Upload (${report.report_type})`,
        status: "completed" as const,
        timestamp: new Date(report.uploaded_at).toLocaleDateString(),
      }))
    : [];



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
          data={weeklyTrendsData}
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
          data={prescriptionTrendsData}
          type="multi-bar"
          dataKeys={["prescriptions", "interactions"]}
          animated
        />
        <AnalyticsChart
          title="Report Analytics"
          description="Distribution by category"
          data={reportDistributionData}
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
