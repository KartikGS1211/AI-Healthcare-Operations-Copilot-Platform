"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Copy,
  Download,
  RefreshCw,
  User,
} from "lucide-react";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { samplePatient, sampleDischargeSummary } from "@/data/mock-data";

const dischargeSchema = z.object({
  diagnosis: z.string().min(3, "Diagnosis is required"),
  treatment: z.string().min(3, "Treatment details are required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().min(3, "Discharge instructions are required"),
});

type DischargeForm = z.infer<typeof dischargeSchema>;

export default function DoctorDashboardPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DischargeForm>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      diagnosis: "Acute exacerbation of Type 2 Diabetes Mellitus with hyperglycemia",
      treatment:
        "IV fluid resuscitation, insulin drip protocol, Metformin dose optimization",
      duration: "5 days (May 28 – Jun 2, 2026)",
      instructions:
        "Follow up with endocrinologist within 7 days. Daily fasting blood glucose monitoring.",
    },
  });

  const onGenerate = () => {
    setGenerating(true);
    setSummary(null);
    setTimeout(() => {
      setGenerating(false);
      setSummary(sampleDischargeSummary);
      toast.success("Discharge summary generated successfully.");
    }, 2500);
  };

  const copySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success("Copied to clipboard.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h2>
        <p className="text-muted-foreground">
          Clinical workspace for patient review and discharge documentation.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Patient Summary Panel</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border bg-muted/30 p-4">
              <div>
                <h3 className="text-lg font-semibold">{samplePatient.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {samplePatient.age} yrs · {samplePatient.gender} · Blood Type{" "}
                  {samplePatient.bloodType}
                </p>
              </div>
              <Badge variant="secondary">{samplePatient.mrn}</Badge>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Medical History
              </h4>
              <ul className="space-y-1.5">
                {samplePatient.conditions.map((c) => (
                  <li key={c} className="text-sm">
                    • {c}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Current Medications
              </h4>
              <ul className="space-y-1.5">
                {samplePatient.medications.map((m) => (
                  <li key={m} className="text-sm">
                    • {m}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {samplePatient.allergies.map((a) => (
                  <Badge key={a} variant="destructive" className="font-normal">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Recent Reports
              </h4>
              <ul className="space-y-1.5">
                {samplePatient.recentReports.map((r) => (
                  <li
                    key={r}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Discharge Summary Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onGenerate)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea id="diagnosis" rows={2} {...register("diagnosis")} />
                  {errors.diagnosis && (
                    <p className="text-xs text-destructive">{errors.diagnosis.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Given</Label>
                  <Textarea id="treatment" rows={3} {...register("treatment")} />
                  {errors.treatment && (
                    <p className="text-xs text-destructive">{errors.treatment.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Hospital Stay Duration</Label>
                  <Input id="duration" {...register("duration")} />
                  {errors.duration && (
                    <p className="text-xs text-destructive">{errors.duration.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Discharge Instructions</Label>
                  <Textarea id="instructions" rows={3} {...register("instructions")} />
                  {errors.instructions && (
                    <p className="text-xs text-destructive">
                      {errors.instructions.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={generating}>
                  Generate AI Summary
                </Button>
              </form>
            </CardContent>
          </Card>

          {generating && (
            <AIProcessing message="Generating Medical Summary..." />
          )}

          {summary && !generating && (
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Generated Discharge Summary</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copySummary}>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("PDF download would start here.")}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={onGenerate}>
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-muted/20 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
