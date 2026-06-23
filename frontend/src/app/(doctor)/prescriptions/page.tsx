"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { MedicineCard } from "@/components/dashboard/medicine-card";
import { MedicineTable } from "@/components/dashboard/medicine-table";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { EmptyState } from "@/components/dashboard/empty-state";
import { patientService } from "@/services/patient.service";
import { reportService } from "@/services/report.service";
import { prescriptionService } from "@/services/prescription.service";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiPrescription } from "@/types";

export default function PrescriptionsPage() {
  const [patientId, setPatientId] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [medicines, setMedicines] = useState<ApiPrescription[] | null>(null);

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
    setMedicines(null);

    try {
      const report = await reportService.upload({
        patient_id: Number(patientId),
        report_type: "prescription",
        file,
      });

      const extracted = await prescriptionService.extract(report.id);
      setMedicines(extracted);
      toast.success("Prescription analyzed", {
        description: `${extracted.length} medicines extracted.`,
      });
    } catch {
      toast.error("Extraction failed", { description: "Could not process prescription." });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-accent/5 p-6 backdrop-blur-sm md:p-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Prescription Intelligence
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Extract medicines, dosages, and clinical instructions from prescription reports.
        </p>
      </div>

      <div className="max-w-md space-y-2">
        <Label>Target Patient</Label>
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

      <UploadZone onUploadComplete={handleUpload} />

      {processing && <AIProcessing message="Extracting Medicines..." />}

      {!medicines && !processing && (
        <EmptyState
          type="prescription"
          onAction={() =>
            document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
          }
        />
      )}

      {medicines && (
        <>
          <MedicineTable medicines={medicines} />
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Medicine Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={{
                    id: String(medicine.id),
                    name: medicine.medicine_name,
                    dosage: medicine.dosage,
                    frequency: medicine.frequency,
                    duration: medicine.duration,
                    purpose: medicine.purpose || "Prescribed medication",
                    usageInstructions: medicine.instructions || "Use as directed",
                    sideEffects: medicine.side_effects
                      ? medicine.side_effects.split(",").map((s) => s.trim())
                      : [],
                  }}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
