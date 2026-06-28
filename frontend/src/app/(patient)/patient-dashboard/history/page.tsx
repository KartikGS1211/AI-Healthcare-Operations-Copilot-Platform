"use client";

import { useQuery } from "@tanstack/react-query";
import { Timeline } from "@/components/dashboard/timeline";
import { patientService } from "@/services/patient.service";
import { reportService } from "@/services/report.service";
import { TableSkeleton } from "@/components/dashboard/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientHistoryPage() {
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

  const isLoading = isPatientLoading || isReportsLoading;

  const timelineEvents = (reports ?? []).map((report) => ({
    id: String(report.id),
    date: new Date(report.uploaded_at).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    title: `${report.report_type.toUpperCase()} Report Uploaded`,
    description: report.summary || `File: ${report.file_name}`,
    category: "report" as const,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Medical History</h2>
        <p className="text-muted-foreground">
          Your complete medical timeline and visit history.
        </p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : timelineEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No medical history or reports found.
            </p>
          ) : (
            <Timeline events={timelineEvents} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

