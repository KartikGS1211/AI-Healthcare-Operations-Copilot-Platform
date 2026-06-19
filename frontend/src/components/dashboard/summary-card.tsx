import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SummarySection } from "@/types";

interface SummaryCardProps {
  section: SummarySection;
}

export function SummaryCard({ section }: SummaryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-primary"
            >
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
