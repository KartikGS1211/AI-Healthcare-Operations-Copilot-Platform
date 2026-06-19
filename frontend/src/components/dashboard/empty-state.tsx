import { BarChart3, FileSearch, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const presets = {
  prescription: {
    icon: FileSearch,
    title: "No Prescription Uploaded",
    description:
      "Upload a prescription image or PDF to receive AI-powered medicine insights and interaction alerts.",
    action: "Upload Prescription",
  },
  reports: {
    icon: FileText,
    title: "No Reports Available",
    description:
      "Upload patient medical reports to generate comprehensive AI summaries and clinical timelines.",
    action: "Upload Report",
  },
  analytics: {
    icon: BarChart3,
    title: "No Analytics Data",
    description:
      "Start processing prescriptions and reports to populate your healthcare operational insights.",
    action: "Go to Dashboard",
  },
} as const;

type EmptyStateType = keyof typeof presets;

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const preset = presets[type];
  const Icon = preset.icon;

  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-10 w-10 text-muted-foreground/60" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{preset.title}</h3>
        <p className="mb-6 max-w-md text-sm text-muted-foreground">{preset.description}</p>
        <Button onClick={onAction}>
          <Upload className="mr-2 h-4 w-4" />
          {preset.action}
        </Button>
      </CardContent>
    </Card>
  );
}
