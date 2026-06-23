"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { patientService } from "@/services/patient.service";
import { reportService } from "@/services/report.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ApiReport } from "@/types";

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

export default function ReportsPage() {
  const [patientId, setPatientId] = useState<string>("");
  const [reportType, setReportType] = useState("lab");
  const [processing, setProcessing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [result, setResult] = useState<ApiReport | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: patientService.getAll,
    retry: false,
  });

  async function handleUpload(file: File) {
    if (!patientId) {
      toast.error("Select a patient before uploading");
      return;
    }

    setProcessing(true);
    setResult(null);
    setSummary(null);

    try {
      const report = await reportService.upload({
        patient_id: Number(patientId),
        report_type: reportType,
        file,
      });
      setResult(report);
      toast.success("Report uploaded", { description: "OCR extraction complete." });

      // Start summarization
      setSummarizing(true);
      try {
        const summaryData = await reportService.summarize(report.id);
        setSummary(summaryData.summary);
        toast.success("Summary generated successfully");
      } catch {
        toast.error("Failed to generate AI summary");
      } finally {
        setSummarizing(false);
      }
    } catch {
      toast.error("Upload failed", { description: "Could not upload report." });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-accent/5 p-6 backdrop-blur-sm md:p-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Report Intelligence
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Upload medical reports for OCR extraction, metadata parsing, and AI analysis.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Patient</Label>
          <Select value={patientId} onValueChange={(v) => setPatientId(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {(patients ?? []).map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select value={reportType} onValueChange={(v) => setReportType(v ?? "lab")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lab">Lab Report</SelectItem>
              <SelectItem value="radiology">Radiology</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="discharge">Discharge Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <UploadZone onUploadComplete={handleUpload} />

      {processing && <AIProcessing message="Running OCR..." />}

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{result.report_type}</Badge>
                <Badge variant="outline">{result.file_name}</Badge>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  Extracted Text
                </p>
                <p className="max-h-48 overflow-y-auto rounded-lg bg-muted/50 p-3 text-sm">
                  {result.extracted_text || "No text extracted."}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {summarizing && <AIProcessing message="Generating AI summary..." />}
            {summary &&
              parseSummary(summary).map((section) => (
                <SummaryCard key={section.title} section={section} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
