"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends object> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T extends object>({
  title,
  columns,
  data,
  className,
}: DataTableProps<T>) {
  return (
    <Card className={cn("shadow-sm", className)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : "p-0"}>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((col) => (
                  <TableHead key={String(col.key)} className="font-semibold">
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    completed: "bg-accent/15 text-accent border-accent/30",
    processing: "bg-primary/15 text-primary border-primary/30",
    warning: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <Badge variant="outline" className={cn("capitalize", variants[status])}>
      {status}
    </Badge>
  );
}
