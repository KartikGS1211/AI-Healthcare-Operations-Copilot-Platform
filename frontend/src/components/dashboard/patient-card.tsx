"use client";

import { motion } from "framer-motion";
import { Calendar, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ApiPatient, Patient } from "@/types";

interface PatientCardProps {
  patient: Patient | ApiPatient;
  onClick?: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const name = "full_name" in patient ? patient.full_name : patient.name;
  const id = patient.id;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400 }}>
      <Card
        className="cursor-pointer border-border/50 bg-card/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5"
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold">{name}</h3>
                <Badge variant="outline" className="capitalize">
                  {patient.gender}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Age {patient.age} · ID #{id}
              </p>
              {"phone" in patient && patient.phone && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {patient.phone}
                </p>
              )}
              {"created_at" in patient && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(patient.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
