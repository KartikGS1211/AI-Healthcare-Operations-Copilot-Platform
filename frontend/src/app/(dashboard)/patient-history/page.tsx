"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Timeline } from "@/components/dashboard/timeline";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import {
  patientSummarySections,
  patientTimeline,
} from "@/data/mock-data";

export default function PatientHistoryPage() {
  const [hasUpload, setHasUpload] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleUpload = () => {
    setHasUpload(true);
    setProcessing(true);
    setShowResults(false);

    setTimeout(() => {
      setProcessing(false);
      setShowResults(true);
      toast.success("Medical summary generated successfully.");
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Patient History Intelligence
        </h2>
        <p className="mt-2 text-muted-foreground">
          Upload medical reports for AI-powered clinical summarization and timeline
          generation.
        </p>
      </div>

      <UploadZone
        accept=".pdf"
        supportedFormats={["PDF", "Medical Reports"]}
        onUploadComplete={handleUpload}
      />

      {processing && <AIProcessing message="Generating Medical Summary..." />}

      {!hasUpload && !processing && <EmptyState type="reports" />}

      {showResults && (
        <>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>AI Generated Summary</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Patient: Robert Anderson · MRN-2024-8471
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {patientSummarySections.map((section) => (
                  <SummaryCard key={section.title} section={section} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Clinical Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Past diagnoses, treatments, and hospital visits
              </p>
            </CardHeader>
            <CardContent>
              <Timeline events={patientTimeline} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
