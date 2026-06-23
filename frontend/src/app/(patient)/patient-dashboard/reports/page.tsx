"use client";

import { UploadZone } from "@/components/dashboard/upload-zone";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockReports = [
  { id: 1, name: "Blood Test Results.pdf", type: "Lab", date: "Jun 1, 2026" },
  { id: 2, name: "Chest X-Ray.png", type: "Radiology", date: "May 15, 2026" },
  { id: 3, name: "Prescription Scan.jpg", type: "Prescription", date: "Apr 28, 2026" },
];

export default function PatientReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Reports</h2>
        <p className="text-muted-foreground">Upload and view your medical reports.</p>
      </div>

      <UploadZone
        onUploadComplete={() =>
          toast.success("Report uploaded", { description: "Your report is being processed." })
        }
      />

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Uploaded Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-muted-foreground">{report.date}</p>
              </div>
              <Badge variant="outline">{report.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
