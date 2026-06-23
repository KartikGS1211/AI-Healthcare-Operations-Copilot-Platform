"use client";

import { Timeline } from "@/components/dashboard/timeline";
import { patientTimeline } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientHistoryPage() {
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
          <Timeline events={patientTimeline} />
        </CardContent>
      </Card>
    </div>
  );
}
