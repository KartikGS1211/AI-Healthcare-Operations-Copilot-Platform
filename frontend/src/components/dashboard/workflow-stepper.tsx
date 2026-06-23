"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowStep } from "@/types";

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  title?: string;
}

export function WorkflowStepper({ steps, title = "AI Workflow Progress" }: WorkflowStepperProps) {
  return (
    <Card className="border-border/50 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={
                    step.status === "running"
                      ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }
                      : {}
                  }
                  transition={{ repeat: step.status === "running" ? Infinity : 0, duration: 1.5 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2",
                    step.status === "completed" && "border-emerald-500 bg-emerald-500/10 text-emerald-600",
                    step.status === "running" && "border-primary bg-primary/10 text-primary",
                    step.status === "failed" && "border-destructive bg-destructive/10 text-destructive",
                    step.status === "pending" && "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {step.status === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : step.status === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "my-1 h-full min-h-[24px] w-0.5",
                      step.status === "completed" ? "bg-emerald-500/50" : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="pb-4 pt-1">
                <p className="font-medium">{step.label}</p>
                <p className="text-sm capitalize text-muted-foreground">{step.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
