"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIProcessingProps {
  message: string;
}

export function AIProcessing({ message }: AIProcessingProps) {
  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="font-medium">{message}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Our AI is analyzing medical data securely...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
