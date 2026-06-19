"use client";

import Link from "next/link";
import {
  BarChart3,
  FileText,
  Pill,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  dashboardKPIs,
  monthlyPrescriptionData,
  recentActivity,
  weeklyReportData,
} from "@/data/mock-data";

const quickActions = [
  {
    label: "Upload Prescription",
    href: "/prescription-analysis",
    icon: Pill,
    toast: "Navigate to prescription upload",
  },
  {
    label: "Upload Patient Report",
    href: "/patient-history",
    icon: FileText,
    toast: "Navigate to patient reports",
  },
  {
    label: "Generate Summary",
    href: "/patient-history",
    icon: Sparkles,
    toast: "Ready to generate summary",
  },
  {
    label: "View Analytics",
    href: "/analytics",
    icon: BarChart3,
    toast: "Opening analytics",
  },
];

const activityIcons = {
  prescription: Pill,
  report: FileText,
  summary: Sparkles,
  alert: Upload,
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, Dr. Sharma
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your healthcare AI operations today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardKPIs.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item) => {
              const Icon = activityIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.timestamp}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => toast.info(action.toast)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto justify-start py-3"
                )}
              >
                <action.icon className="mr-2 h-4 w-4 text-primary" />
                {action.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart
          title="Weekly Report Analysis"
          description="Reports analyzed vs prescriptions processed"
          data={weeklyReportData}
          type="area"
          dataKeys={["reports", "prescriptions"]}
        />
        <AnalyticsChart
          title="Monthly Prescription Processing"
          description="Total prescriptions processed per month"
          data={monthlyPrescriptionData}
          type="bar"
          dataKeys={["value"]}
        />
      </div>
    </div>
  );
}
