import {
  AlertTriangle,
  Brain,
  FileText,
  Pill,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { StatMetric } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  prescription: Pill,
  report: FileText,
  alert: AlertTriangle,
  summary: Brain,
  patients: Users,
};

interface StatCardProps {
  metric: StatMetric;
  className?: string;
}

export function StatCard({ metric, className }: StatCardProps) {
  const Icon = iconMap[metric.icon] ?? FileText;
  const TrendIcon =
    metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : null;

  return (
    <Card className={cn("shadow-sm transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
            {metric.change && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  metric.trend === "up" && "text-accent",
                  metric.trend === "down" && "text-destructive",
                  metric.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
                <span>{metric.change} from last month</span>
              </div>
            )}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
