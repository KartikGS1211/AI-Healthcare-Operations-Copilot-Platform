"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  GitBranch,
  Pill,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardSkeleton } from "@/components/dashboard/loading-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { analyticsService } from "@/services/analytics.service";

import { staggerContainer, fadeInUp } from "@/lib/animations";

const quickActions = [
  { label: "Upload Report", href: "/reports", icon: Upload },
  { label: "Generate Summary", href: "/reports", icon: Sparkles },
  { label: "Analyze Prescription", href: "/prescriptions", icon: Pill },
  { label: "Run Workflow", href: "/workflow", icon: GitBranch },
];

export default function DoctorDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: () => analyticsService.getOverview(),
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

  const { data: monthlyTrends } = useQuery({
    queryKey: ["monthly-trends"],
    queryFn: () => analyticsService.getMonthlyTrends(),
  });

  const kpis = [
    {
      title: "Patients Processed",
      value: overview?.total_patients ?? 0,
      change: overview ? "+12.5%" : "",
      trend: overview ? ("up" as const) : ("neutral" as const),
      icon: "patients",
    },
    {
      title: "Reports Analyzed",
      value: overview?.total_reports ?? 0,
      change: overview ? "+8.2%" : "",
      trend: overview ? ("up" as const) : ("neutral" as const),
      icon: "report",
    },
    {
      title: "AI Summaries Generated",
      value: overview?.total_prescriptions ?? 0,
      change: overview ? "+18.7%" : "",
      trend: overview ? ("up" as const) : ("neutral" as const),
      icon: "summary",
    },
    {
      title: "Drug Interactions",
      value: overview?.total_interactions ?? 0,
      change: overview ? "-3.1%" : "",
      trend: overview ? ("down" as const) : ("neutral" as const),
      icon: "interactions",
    },
  ];

  const activities = recentReports
    ? recentReports.map((report) => ({
        id: String(report.id),
        title: "Report Uploaded",
        description: `${report.file_name} (${report.report_type})`,
        timestamp: report.uploaded_at, // raw ISO string → ActivityFeed computes relative time
        type: "report" as const,
      }))
    : [];

  const topMedsData = topMeds
    ? topMeds.map((m) => ({ name: m.medicine_name, value: m.count }))
    : [];

  const weeklyTrendsData = weeklyTrends ?? [];

  const monthlyTrendsData = monthlyTrends ?? [];

  if (isLoading && !overview) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your healthcare AI operations today.
        </p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {kpis.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed items={activities} />
        </div>

        <Card className="border-border/50 bg-card/80 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => toast.info(`Opening ${action.label}`)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto justify-start border-border/50 bg-background/50 py-3 backdrop-blur-sm",
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
          title="Weekly Analysis"
          description="Reports analyzed vs prescriptions processed"
          data={weeklyTrendsData}
          type="area"
          dataKeys={["reports", "prescriptions"]}
          animated
        />
        <AnalyticsChart
          title="Monthly Analysis"
          description="Total prescriptions processed per month"
          data={monthlyTrendsData}
          type="bar"
          dataKeys={["value"]}
          animated
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart
          title="Top Medicines"
          description="Most prescribed medicines"
          data={topMedsData}
          type="bar"
          dataKeys={["value"]}
          animated
        />
        <AnalyticsChart
          title="Interaction Trends"
          description="Drug interaction alerts over time"
          data={weeklyTrendsData}
          type="line"
          dataKeys={["interactions"]}
          animated
        />
      </div>
    </motion.div>
  );
}
