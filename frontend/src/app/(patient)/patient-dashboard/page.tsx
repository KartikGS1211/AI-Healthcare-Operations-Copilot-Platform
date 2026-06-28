"use client";

import { motion } from "framer-motion";
import { FileText, Pill, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { InteractionAlert } from "@/components/dashboard/interaction-alert";
import { useAuthStore } from "@/store/auth-store";
import { patientService } from "@/services/patient.service";
import { DashboardSkeleton } from "@/components/dashboard/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function PatientDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ["patient-dashboard"],
    queryFn: patientService.getDashboard,
    retry: false,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const kpis = data?.kpis ?? [];
  const recentUpdates = data?.recent_updates ?? [];
  const healthAlerts = data?.health_alerts ?? [];

  const reportsCount = kpis.find((k: any) => k.title === "Reports Uploaded")?.value ?? 0;
  const summariesCount = kpis.find((k: any) => k.title === "AI Findings")?.value ?? 0;
  const medicinesCount = kpis.find((k: any) => k.title === "Active Medicines")?.value ?? 0;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome, {user?.name}
        </h2>
        <p className="text-muted-foreground">
          Your personal health dashboard with AI-powered insights.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric: any) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed items={recentUpdates.slice(0, 4)} title="Recent Updates" />

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Health Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No health alerts or drug interactions detected.</p>
            ) : (
              healthAlerts.slice(0, 2).map((interaction: any) => (
                <InteractionAlert key={interaction.id} interaction={interaction} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: FileText, label: "My Reports", count: reportsCount },
          { icon: Sparkles, label: "AI Summaries", count: summariesCount },
          { icon: Pill, label: "Medicines", count: medicinesCount },
        ].map((item) => (
          <Card key={item.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

