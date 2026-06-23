"use client";

import { MedicineCard } from "@/components/dashboard/medicine-card";
import { MedicineTable } from "@/components/dashboard/medicine-table";
import { extractedMedicines } from "@/data/mock-data";

export default function PatientMedicinesPage() {
  const apiMedicines = extractedMedicines.map((m, i) => ({
    id: i + 1,
    report_id: 1,
    medicine_name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    duration: m.duration,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Medicines</h2>
        <p className="text-muted-foreground">
          Active medications with dosage, purpose, and instructions.
        </p>
      </div>

      <MedicineTable medicines={apiMedicines} />

      <div className="grid gap-4 md:grid-cols-2">
        {extractedMedicines.map((medicine) => (
          <MedicineCard key={medicine.id} medicine={medicine} />
        ))}
      </div>
    </div>
  );
}
