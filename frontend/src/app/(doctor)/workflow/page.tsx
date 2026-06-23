"use client";

import { useState } from "react";
import { toast } from "sonner";
import { WorkflowStepper } from "@/components/dashboard/workflow-stepper";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { MedicineTable } from "@/components/dashboard/medicine-table";
import { InteractionAlert } from "@/components/dashboard/interaction-alert";
import { KnowledgeCard } from "@/components/dashboard/knowledge-card";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { workflowService } from "@/services/workflow.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowStep, WorkflowResult, RiskLevel } from "@/types";

function parseSummary(text: string): { title: string; items: string[] }[] {
  if (!text) return [];
  const sections: { title: string; items: string[] }[] = [];
  const headerRegex = /(Key Findings:|Patient Explanation:|Potential Concerns:|Recommendation:|Clinical Summary:)/gi;
  const parts = text.split(headerRegex);

  let currentTitle = "Summary";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    if (part.match(headerRegex)) {
      currentTitle = part.replace(":", "").trim();
    } else {
      const items = part
        .split("\n")
        .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter((line) => line.length > 0);
      if (items.length > 0) {
        sections.push({ title: currentTitle, items });
      }
    }
  }
  return sections;
}

export default function WorkflowPage() {
  const [reportId, setReportId] = useState("1");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(
    WORKFLOW_STEPS.map((s) => ({ ...s, status: "pending" as const }))
  );
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState<WorkflowResult | null>(null);

  async function runWorkflow() {
    setRunning(true);
    setComplete(false);
    setResult(null);
    setSteps(WORKFLOW_STEPS.map((s) => ({ ...s, status: "pending" as const })));

    try {
      const apiPromise = workflowService.analyze(Number(reportId));

      for (let i = 0; i < WORKFLOW_STEPS.length; i++) {
        setSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === i ? "running" : idx < i ? "completed" : "pending",
          }))
        );
        await new Promise((r) => setTimeout(r, 600));
      }

      const data = await apiPromise;

      setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" as const })));
      setResult(data);
      setComplete(true);
      toast.success("Workflow completed", { description: "All AI analysis steps finished." });
    } catch (error) {
      setSteps((prev) =>
        prev.map((s) => (s.status === "running" ? { ...s, status: "failed" as const } : s))
      );
      toast.error("Failed to run workflow", { description: "Make sure the backend is active and report ID exists." });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Workflow Analysis Center</h2>
        <p className="text-muted-foreground">
          Run end-to-end AI clinical workflow: OCR → Summary → Prescription → Interactions → RAG.
        </p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label>Report ID</Label>
            <Input
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              placeholder="Enter report ID"
            />
          </div>
          <Button onClick={runWorkflow} disabled={running}>
            Run Workflow
          </Button>
        </CardContent>
      </Card>

      {running && <AIProcessing message="Running Workflow..." />}

      <WorkflowStepper steps={steps} />

      {complete && result && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Results Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                {parseSummary(result.summary || "").map((section) => (
                  <SummaryCard key={section.title} section={section} />
                ))}
              </div>

              {result.medicines && result.medicines.length > 0 && (
                <MedicineTable
                  medicines={result.medicines}
                  title="Extracted Medicines"
                />
              )}

              {result.interactions && result.interactions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Interactions</h3>
                  {result.interactions.map((interaction) => (
                    <InteractionAlert
                      key={interaction.id}
                      interaction={{
                        id: String(interaction.id),
                        medicines: [interaction.drug_1, interaction.drug_2],
                        summary: interaction.warning || interaction.mechanism || "",
                        riskLevel: (interaction.severity?.toLowerCase() || "low") as RiskLevel,
                        recommendedAction: interaction.recommendation || "Monitor patient closely.",
                      }}
                    />
                  ))}
                </div>
              )}

              {result.evidence && result.evidence.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Evidence</h3>
                  {result.evidence.map((ev, i) => (
                    <KnowledgeCard key={i} result={ev} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

