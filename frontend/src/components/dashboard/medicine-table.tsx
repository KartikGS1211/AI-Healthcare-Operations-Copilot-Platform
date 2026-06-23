import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiPrescription, Medicine } from "@/types";

interface MedicineTableProps {
  medicines: Medicine[] | ApiPrescription[];
  title?: string;
}

function isApiPrescription(
  item: Medicine | ApiPrescription
): item is ApiPrescription {
  return "medicine_name" in item;
}

export function MedicineTable({ medicines, title = "Medicines" }: MedicineTableProps) {
  return (
    <Card className="border-border/50 bg-card/80 shadow-sm backdrop-blur-sm">
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "" : "p-0"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((med) => (
              <TableRow key={isApiPrescription(med) ? med.id : med.id}>
                <TableCell className="font-medium">
                  {isApiPrescription(med) ? med.medicine_name : med.name}
                </TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.frequency}</TableCell>
                <TableCell>{med.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
