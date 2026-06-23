"use client";

import { useState } from "react";
import { toast } from "sonner";
import { InteractionAlert } from "@/components/dashboard/interaction-alert";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { interactionService } from "@/services/interaction.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { DrugInteraction, RiskLevel } from "@/types";

const riskScore: Record<string, number> = {
  low: 25,
  moderate: 50,
  medium: 50,
  high: 75,
  critical: 95,
};

export default function InteractionsPage() {
  const [patientId, setPatientId] = useState("1");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<DrugInteraction[] | null>(null);

  async function analyze() {
    setAnalyzing(true);
    setResults(null);

    try {
      const data = await interactionService.analyzePatient(Number(patientId));
      const mapped: DrugInteraction[] = data.map((item) => ({
        id: String(item.id),
        medicines: [item.drug_1, item.drug_2],
        summary: item.warning || item.mechanism || "",
        riskLevel: (item.severity?.toLowerCase() || "low") as RiskLevel,
        recommendedAction: item.recommendation || "Monitor patient closely.",
      }));
      setResults(mapped);

      if (mapped.length > 0) {
        toast.warning("Drug interaction detected", {
          description: "Review interaction alerts below.",
        });
      } else {
        toast.success("No interactions detected", {
          description: "No drug conflicts found for this patient.",
        });
      }
    } catch {
      toast.error("Failed to analyze interactions", {
        description: "Verify that the patient exists and has active prescriptions.",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  const highestRisk = results && results.length > 0
    ? results.reduce(
        (max, item) =>
          (riskScore[item.riskLevel] ?? 0) > (riskScore[max] ?? 0) ? item.riskLevel : max,
        "low" as string
      )
    : "low";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Drug Interaction Center</h2>
        <p className="text-muted-foreground">
          Analyze patient medications for potential drug-drug interactions.
        </p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label>Patient ID</Label>
            <Input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
            />
          </div>
          <Button onClick={analyze} disabled={analyzing}>
            Analyze Interactions
          </Button>
        </CardContent>
      </Card>

      {analyzing && <AIProcessing message="Detecting Interactions..." />}

      {results && (
        <>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Risk Meter</CardTitle>
                <Badge
                  variant={
                    highestRisk === "high" || highestRisk === "critical"
                      ? "destructive"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {highestRisk} severity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={riskScore[highestRisk ?? "low"] ?? 25} className="h-3" />
              <p className="mt-2 text-sm text-muted-foreground">
                {results.length} interaction(s) detected for patient #{patientId}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {results.map((interaction) => (
              <InteractionAlert key={interaction.id} interaction={interaction} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
