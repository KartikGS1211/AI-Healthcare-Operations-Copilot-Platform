import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DrugInteraction, RiskLevel } from "@/types";

const riskConfig: Record<
  RiskLevel,
  { label: string; icon: React.ElementType; className: string; badge: string }
> = {
  low: {
    label: "Low Risk",
    icon: ShieldCheck,
    className: "border-accent/30 bg-accent/5",
    badge: "bg-accent/15 text-accent border-accent/30",
  },
  moderate: {
    label: "Moderate Risk",
    icon: ShieldAlert,
    className: "border-[var(--warning)]/40 bg-[var(--warning)]/10",
    badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  medium: {
    label: "Moderate Risk",
    icon: ShieldAlert,
    className: "border-[var(--warning)]/40 bg-[var(--warning)]/10",
    badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  critical: {
    label: "Critical Risk",
    icon: ShieldX,
    className: "border-destructive bg-destructive/10",
    badge: "bg-destructive text-destructive-foreground border-destructive",
  },
  high: {
    label: "High Risk",
    icon: ShieldX,
    className: "border-destructive/40 bg-destructive/5",
    badge: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

interface InteractionAlertProps {
  interaction: DrugInteraction;
}

export function InteractionAlert({ interaction }: InteractionAlertProps) {
  const level = interaction.riskLevel === "medium" ? "moderate" : interaction.riskLevel;
  const config = riskConfig[level] ?? riskConfig.low;
  const Icon = config.icon;

  return (
    <Card className={cn("shadow-sm", config.className)}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                interaction.riskLevel === "high" && "bg-destructive/15 text-destructive",
                (interaction.riskLevel === "moderate" || interaction.riskLevel === "medium") &&
                  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
                interaction.riskLevel === "critical" && "bg-destructive/20 text-destructive",
                interaction.riskLevel === "low" && "bg-accent/15 text-accent"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Drug Interaction Detected</span>
                <Badge variant="outline" className={config.badge}>
                  {config.label}
                </Badge>
              </div>
              <p className="mb-2 text-sm font-medium">
                {interaction.medicines.join(" + ")}
              </p>
              <p className="text-sm text-muted-foreground">{interaction.summary}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border bg-background/60 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recommended Action
          </p>
          <p className="text-sm">{interaction.recommendedAction}</p>
        </div>
      </CardContent>
    </Card>
  );
}
