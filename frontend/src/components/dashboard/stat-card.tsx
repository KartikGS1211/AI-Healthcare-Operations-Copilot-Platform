"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  FileText,
  Pill,
  TrendingDown,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import type { StatMetric } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  prescription: Pill,
  report: FileText,
  alert: AlertTriangle,
  summary: Brain,
  patients: Users,
  interactions: AlertTriangle,
};

function AnimatedValue({ value }: { value: string | number }) {
  const numeric = typeof value === "string" ? parseInt(value.replace(/,/g, ""), 10) : value;
  const [display, setDisplay] = useState(0);
  const isNumeric = !Number.isNaN(numeric) && typeof value !== "string" || /^\d/.test(String(value));

  useEffect(() => {
    if (!isNumeric) return;
    const target = typeof value === "string" ? parseInt(value.replace(/,/g, ""), 10) : value;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, isNumeric]);

  if (!isNumeric) return <>{value}</>;
  return <>{display.toLocaleString()}</>;
}

interface StatCardProps {
  metric: StatMetric;
  className?: string;
}

export function StatCard({ metric, className }: StatCardProps) {
  const Icon = iconMap[metric.icon] ?? FileText;
  const TrendIcon =
    metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Upload;

  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover">
      <Card
        className={cn(
          "border-border/50 bg-card/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
              <p className="text-3xl font-bold tracking-tight">
                {metric.animate !== false ? (
                  <AnimatedValue value={metric.value} />
                ) : (
                  metric.value
                )}
              </p>
              {metric.change && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    metric.trend === "up" && "text-emerald-600 dark:text-emerald-400",
                    metric.trend === "down" && "text-destructive",
                    metric.trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {metric.trend && metric.trend !== "neutral" && (
                    <TrendIcon className="h-3.5 w-3.5" />
                  )}
                  <span>{metric.change} from last month</span>
                </div>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
