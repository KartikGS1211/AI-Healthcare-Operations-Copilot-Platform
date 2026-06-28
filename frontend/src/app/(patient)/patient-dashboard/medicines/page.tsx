"use client";

import { useQuery } from "@tanstack/react-query";
import { MedicineCard } from "@/components/dashboard/medicine-card";
import { MedicineTable } from "@/components/dashboard/medicine-table";
import { patientService } from "@/services/patient.service";
import { prescriptionService } from "@/services/prescription.service";
import { TableSkeleton } from "@/components/dashboard/loading-skeleton";

const getMedicineDetails = (name: string) => {
  const normalized = name.toLowerCase();
  if (
    normalized.includes("amoxicillin") ||
    normalized.includes("penicillin") ||
    normalized.includes("clarithromycin") ||
    normalized.includes("azithromycin")
  ) {
    return {
      purpose: "Bacterial Infection treatment",
      sideEffects: ["Diarrhea", "Nausea", "Stomach upset"],
    };
  }
  if (normalized.includes("paracetamol") || normalized.includes("acetaminophen")) {
    return {
      purpose: "Pain relief and Fever reduction",
      sideEffects: ["Liver dysfunction (if high dose)", "Allergic reaction"],
    };
  }
  if (normalized.includes("metformin")) {
    return {
      purpose: "Type 2 Diabetes management",
      sideEffects: ["Nausea", "Metallic taste", "Diarrhea"],
    };
  }
  if (normalized.includes("amlodipine") || normalized.includes("lisinopril")) {
    return {
      purpose: "High Blood Pressure treatment",
      sideEffects: ["Dizziness", "Headache", "Swelling (edema)"],
    };
  }
  if (normalized.includes("aspirin")) {
    return {
      purpose: "Blood thinner and Pain reliever",
      sideEffects: ["Stomach irritation", "Increased bleeding risk"],
    };
  }
  if (normalized.includes("warfarin")) {
    return {
      purpose: "Blood clot prevention",
      sideEffects: ["Increased bleeding risk", "Bruising", "Nausea"],
    };
  }
  return {
    purpose: "Prescribed health medication",
    sideEffects: ["Mild headache", "Dry mouth", "Drowsiness"],
  };
};

export default function PatientMedicinesPage() {
  const { data: patient, isLoading: isPatientLoading } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: patientService.getMe,
    retry: false,
  });

  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useQuery({
    queryKey: ["patient-prescriptions", patient?.id],
    queryFn: () => prescriptionService.getByPatient(patient!.id),
    enabled: !!patient?.id,
    retry: false,
  });

  const isLoading = isPatientLoading || isPrescriptionsLoading;

  const mappedMedicines = (prescriptions ?? []).map((m) => {
    const details = getMedicineDetails(m.medicine_name);
    return {
      id: String(m.id),
      name: m.medicine_name,
      dosage: m.dosage || "As prescribed",
      frequency: m.frequency || "As prescribed",
      duration: m.duration || "As prescribed",
      purpose: details.purpose,
      usageInstructions: `Take ${m.dosage || "as directed"} ${m.frequency || "daily"} for ${m.duration || "course"}.`,
      sideEffects: details.sideEffects,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Medicines</h2>
        <p className="text-muted-foreground">
          Active medications with dosage, purpose, and instructions.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : !prescriptions || prescriptions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg bg-card">
          No prescribed medicines found.
        </p>
      ) : (
        <>
          <MedicineTable medicines={prescriptions} />

          <div className="grid gap-4 md:grid-cols-2">
            {mappedMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

