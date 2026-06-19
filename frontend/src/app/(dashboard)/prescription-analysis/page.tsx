"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { MedicineCard } from "@/components/dashboard/medicine-card";
import { InteractionAlert } from "@/components/dashboard/interaction-alert";
import { AIProcessing } from "@/components/dashboard/ai-processing";
import { EmptyState } from "@/components/dashboard/empty-state";
import { DataTable } from "@/components/dashboard/data-table";
import {
  drugInteractions,
  extractedMedicines,
} from "@/data/mock-data";
import type { Medicine } from "@/types";

export default function PrescriptionAnalysisPage() {
  const [hasUpload, setHasUpload] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleUpload = () => {
    setHasUpload(true);
    setProcessing(true);
    setShowResults(false);
    toast.info("Upload started", { description: "Processing your prescription..." });

    setTimeout(() => {
      setProcessing(false);
      setShowResults(true);
      toast.success("Prescription analyzed successfully.", {
        description: "4 medicines extracted with interaction analysis.",
      });
    }, 2500);
  };

  const medicineColumns = [
    { key: "name", header: "Medicine Name" },
    { key: "dosage", header: "Dosage" },
    { key: "frequency", header: "Frequency" },
    { key: "duration", header: "Duration" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          AI Prescription Analysis
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Upload prescriptions and receive AI-powered medicine insights and
          interaction alerts.
        </p>
      </div>

      <UploadZone
        supportedFormats={["JPG", "PNG", "PDF"]}
        onUploadComplete={handleUpload}
      />

      {processing && (
        <AIProcessing message="Analyzing Prescription..." />
      )}

      {!hasUpload && !processing && (
        <EmptyState
          type="prescription"
          onAction={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
        />
      )}

      {showResults && (
        <>
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Extracted Medicines</h3>
            <DataTable<Medicine>
              title=""
              columns={medicineColumns}
              data={extractedMedicines}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Medicine Explanations</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {extractedMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Drug Interactions</h3>
              <span
                className="text-sm text-muted-foreground"
                onClick={() =>
                  toast.warning("Potential drug interaction detected.", {
                    description: "Review medium-risk interaction below.",
                  })
                }
              >
                {drugInteractions.length} interactions found
              </span>
            </div>
            {processing ? (
              <AIProcessing message="Checking Drug Interactions..." />
            ) : (
              <div className="space-y-4">
                {drugInteractions.map((interaction) => (
                  <InteractionAlert
                    key={interaction.id}
                    interaction={interaction}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
