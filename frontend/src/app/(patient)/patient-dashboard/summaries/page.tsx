"use client";

import { Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { patientSummarySections } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientSummariesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Summaries</h2>
          <p className="text-muted-foreground">
            AI-generated findings, conditions, and recommendations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Summary copied to clipboard")}
          >
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Summary downloaded")}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button
            size="sm"
            onClick={() => toast.info("Regenerating summary...", { description: "AI unavailable — using cached summary." })}
          >
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Latest AI Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {patientSummarySections.map((section) => (
            <SummaryCard key={section.title} section={section} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
