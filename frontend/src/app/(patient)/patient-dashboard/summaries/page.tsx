"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientService } from "@/services/patient.service";
import { reportService } from "@/services/report.service";
import { TableSkeleton } from "@/components/dashboard/loading-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SummarySection } from "@/types";

const parseSummary = (text: string | null | undefined): SummarySection[] => {
  if (!text) return [];

  const sections: SummarySection[] = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let currentSection: SummarySection | null = null;

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (
      normalized.startsWith("key findings:") ||
      normalized.startsWith("patient explanation:") ||
      normalized.startsWith("potential concerns:") ||
      normalized.startsWith("recommendation:") ||
      normalized.startsWith("clinical summary:") ||
      (line.endsWith(":") && line.length < 30)
    ) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/:$/, ""),
        items: [],
      };
    } else {
      if (!currentSection) {
        currentSection = {
          title: "Clinical Summary",
          items: [],
        };
      }
      const cleanedLine = line.replace(/^[•\-\*\s]+/, "");
      currentSection.items.push(cleanedLine);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

export default function PatientSummariesPage() {
  const queryClient = useQueryClient();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const { data: patient, isLoading: isPatientLoading } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: patientService.getMe,
    retry: false,
  });

  const { data: reports, isLoading: isReportsLoading } = useQuery({
    queryKey: ["patient-reports", patient?.id],
    queryFn: () => reportService.getByPatient(patient!.id),
    enabled: !!patient?.id,
    retry: false,
  });

  useEffect(() => {
    if (reports && reports.length > 0 && selectedReportId === null) {
      // Find the first report that has a summary, or default to the first one
      const withSummary = reports.find((r) => r.summary);
      setSelectedReportId(withSummary ? withSummary.id : reports[0].id);
    }
  }, [reports, selectedReportId]);

  const selectedReport = reports?.find((r) => r.id === selectedReportId);
  const sections = parseSummary(selectedReport?.summary);

  const regenerateMutation = useMutation({
    mutationFn: (reportId: number) => reportService.summarize(reportId),
    onSuccess: () => {
      toast.success("AI Summary generated successfully");
      queryClient.invalidateQueries({
        queryKey: ["patient-reports", patient?.id],
      });
    },
    onError: () => {
      toast.error("Failed to generate AI summary", {
        description: "AI service might be offline or report content is empty.",
      });
    },
  });

  const handleCopy = () => {
    if (!selectedReport?.summary) {
      toast.error("No summary content to copy");
      return;
    }
    navigator.clipboard.writeText(selectedReport.summary);
    toast.success("Summary copied to clipboard");
  };

  const handleDownload = () => {
    if (!selectedReport?.summary) {
      toast.error("No summary content to download");
      return;
    }
    const blob = new Blob([selectedReport.summary], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `summary_${selectedReport.file_name.replace(/\.[^/.]+$/, "")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  };

  const handleRegenerate = () => {
    if (selectedReportId === null) return;
    toast.promise(regenerateMutation.mutateAsync(selectedReportId), {
      loading: "Regenerating AI Summary...",
      success: "Summary updated!",
      error: "Regeneration failed.",
    });
  };

  const isLoading = isPatientLoading || isReportsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Summaries</h2>
          <p className="text-muted-foreground">
            AI-generated findings, conditions, and recommendations.
          </p>
        </div>

        {reports && reports.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!selectedReport?.summary}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!selectedReport?.summary}
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button
              size="sm"
              onClick={handleRegenerate}
              disabled={
                selectedReportId === null || regenerateMutation.isPending
              }
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${regenerateMutation.isPending ? "animate-spin" : ""}`}
              />{" "}
              Regenerate
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : !reports || reports.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg bg-card">
          No medical reports found. Upload a report using a doctor account first
          to generate summaries.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">
              Select Report:
            </span>
            <Select
              value={String(selectedReportId ?? "")}
              onValueChange={(val) => setSelectedReportId(Number(val))}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a report to view" />
              </SelectTrigger>
              <SelectContent>
                {reports.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.file_name} ({r.report_type.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">
                Latest AI Summary for {selectedReport?.file_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedReport?.summary ? (
                <div className="py-12 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No summary generated yet for this report.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={regenerateMutation.isPending}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-1 ${regenerateMutation.isPending ? "animate-spin" : ""}`}
                    />{" "}
                    Generate AI Summary
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {sections.map((section) => (
                    <SummaryCard key={section.title} section={section} />
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
