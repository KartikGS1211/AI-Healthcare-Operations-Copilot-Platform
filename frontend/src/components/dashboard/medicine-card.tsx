import { AlertCircle, Clock, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Medicine } from "@/types";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Pill className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">{medicine.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {medicine.dosage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="mb-1 font-medium text-muted-foreground">Purpose</p>
          <p>{medicine.purpose}</p>
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1 font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Usage Instructions
          </p>
          <p>{medicine.usageInstructions}</p>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1 font-medium text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            Possible Side Effects
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {medicine.sideEffects.map((effect) => (
              <li key={effect}>
                <Badge variant="outline" className="font-normal">
                  {effect}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
