"use client";

import { motion } from "framer-motion";
import { FileText, Pill, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { InteractionAlert } from "@/components/dashboard/interaction-alert";
import { useAuthStore } from "@/store/auth-store";
import { recentActivity, drugInteractions } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const patientKPIs = [
  { title: "Reports Uploaded", value: 12, change: "+2 this month", trend: "up" as const, icon: "report" },
  { title: "Active Medicines", value: 4, change: "Stable", trend: "neutral" as const, icon: "prescription" },
  { title: "AI Findings", value: 8, change: "+3 new", trend: "up" as const, icon: "summary" },
  { title: "Health Insights", value: 5, change: "Updated", trend: "neutral" as const, icon: "patients" },
];

export default function PatientDashboardPage() {
  const user = useAuthStore((s) => s.user);

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
        {patientKPIs.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed items={recentActivity.slice(0, 4)} title="Recent Updates" />

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Health Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {drugInteractions.slice(0, 1).map((interaction) => (
              <InteractionAlert key={interaction.id} interaction={interaction} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: FileText, label: "My Reports", count: 12 },
          { icon: Sparkles, label: "AI Summaries", count: 8 },
          { icon: Pill, label: "Medicines", count: 4 },
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
