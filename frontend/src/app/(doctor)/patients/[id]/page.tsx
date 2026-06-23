"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { patientService } from "@/services/patient.service";
import { reportService } from "@/services/report.service";
import { Timeline } from "@/components/dashboard/timeline";
import { CardGridSkeleton } from "@/components/dashboard/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPatients, patientTimeline } from "@/data/mock-data";

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const patientId = Number(id);

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientService.getById(patientId),
    retry: false,
  });

  const { data: reports } = useQuery({
    queryKey: ["patient-reports", patientId],
    queryFn: () => reportService.getByPatient(patientId),
    retry: false,
  });

  const fallback = mockPatients.find((p) => p.id === id);
  const display = patient ?? (fallback && {
    id: patientId,
    full_name: fallback.name,
    age: fallback.age,
    gender: fallback.gender,
    phone: fallback.phone ?? "",
    created_at: new Date().toISOString(),
  });

  const timelineEvents = reports && reports.length > 0
    ? reports.map((report) => ({
        id: String(report.id),
        date: new Date(report.uploaded_at).toLocaleDateString(),
        title: `${report.report_type.toUpperCase()} Report Uploaded`,
        description: `File: ${report.file_name}`,
        category: "report" as const,
      }))
    : patientTimeline;

  if (isLoading && !display) {
    return <CardGridSkeleton count={2} />;
  }

  if (!display) {
    return <p className="text-muted-foreground">Patient not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{display.full_name}</CardTitle>
            <Badge variant="outline" className="capitalize">{display.gender}</Badge>
            <Badge variant="secondary">Age {display.age}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Patient ID</p>
            <p className="font-medium">#{display.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{display.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reports</p>
            <p className="font-medium">{reports?.length ?? 0} uploaded</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Report History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(reports ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports uploaded yet.</p>
            ) : (
              reports?.map((report) => (
                <div key={report.id} className="rounded-lg border p-3">
                  <p className="font-medium">{report.file_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.report_type} · {new Date(report.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Medical Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={timelineEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
