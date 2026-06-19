"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import {
  analyticsActivity,
  analyticsKPIs,
  interactionCategories,
  prescriptionTrends,
  reportAnalysisTrends,
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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Healthcare operational insights and platform performance metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsKPIs.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart
          title="Prescription Trends"
          description="Monthly prescriptions and interaction alerts"
          data={prescriptionTrends}
          type="multi-bar"
          dataKeys={["prescriptions", "interactions"]}
        />
        <AnalyticsChart
          title="Report Analysis Trends"
          description="Reports uploaded vs analyzed per week"
          data={reportAnalysisTrends}
          type="line"
          dataKeys={["uploaded", "analyzed"]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyticsChart
          title="Drug Interaction Categories"
          description="Distribution by therapeutic class"
          data={interactionCategories}
          type="pie"
          className="lg:col-span-1"
        />
        <div className="lg:col-span-2">
          <DataTable<AnalyticsActivity>
            title="Recent Activity"
            columns={activityColumns}
            data={analyticsActivity}
          />
        </div>
      </div>
    </div>
  );
}
