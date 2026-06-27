import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AgentStep } from "@/hooks/useAgentStream";

interface AgentProgressProps {
  steps: AgentStep[];
}

const STEP_LABELS: Record<string, string> = {
  ocr: "Extracting text from document (OCR)",
  summary: "Generating clinical summary",
  prescription: "Extracting prescribed medications",
  interaction: "Analyzing drug-drug interactions & context",
};

export function AgentProgress({ steps }: AgentProgressProps) {
  if (steps.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        AI Analysis Progress
      </h3>
      <div className="space-y-4">
        {steps.map((stepItem) => {
          const label = STEP_LABELS[stepItem.step] || stepItem.step;
          const isRunning = stepItem.status === "running";
          const isDone = stepItem.status === "done";

          return (
            <div
              key={stepItem.step}
              className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0 dark:border-neutral-800"
            >
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {label}
              </span>
              <div className="flex items-center gap-2">
                {isRunning && (
                  <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </span>
                )}
                {isDone && (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
