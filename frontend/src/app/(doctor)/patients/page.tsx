"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PatientCard } from "@/components/dashboard/patient-card";
import { TableSkeleton } from "@/components/dashboard/loading-skeleton";
import { patientService } from "@/services/patient.service";
import { mockPatients } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "male",
    phone: "",
  });

  const { data: patients, isLoading, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: patientService.getAll,
    retry: false,
  });

  const list = patients ?? mockPatients.map((p) => ({
    id: Number(p.id),
    full_name: p.name,
    age: p.age,
    gender: p.gender,
    phone: p.phone ?? "",
    created_at: new Date().toISOString(),
  }));

  const filtered = list.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    try {
      await patientService.create({
        full_name: form.full_name,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
      });
      toast.success("Patient added successfully");
      setOpen(false);
      refetch();
    } catch {
      toast.error("Failed to add patient");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patient Management</h2>
          <p className="text-muted-foreground">
            Search, filter, and manage patient records.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Add Patient</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm({ ...form, gender: v ?? "male" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleCreate}>
                Create Patient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <PatientCard patient={patient} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
