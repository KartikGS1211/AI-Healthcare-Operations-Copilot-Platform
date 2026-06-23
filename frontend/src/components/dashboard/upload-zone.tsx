"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Image, FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface UploadZoneProps {
  accept?: string;
  supportedFormats?: string[];
  onUploadComplete?: (file: File) => void;
  className?: string;
}

export function UploadZone({
  accept = ".jpg,.jpeg,.png,.pdf",
  supportedFormats = ["JPG", "PNG", "PDF"],
  onUploadComplete,
  className,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const simulateUpload = useCallback(
    (file: File) => {
      setFileName(file.name);
      setUploading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            onUploadComplete?.(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    },
    [onUploadComplete]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      simulateUpload(files[0]);
    },
    [simulateUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <Card className={cn("overflow-hidden border-border/50 bg-card/80 shadow-sm backdrop-blur-sm", className)}>
      <CardContent className="p-0">
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          animate={
            isDragging
              ? { boxShadow: "0 0 30px rgba(59, 130, 246, 0.25)" }
              : { boxShadow: "0 0 0px rgba(59, 130, 246, 0)" }
          }
          className={cn(
            "relative flex flex-col items-center justify-center border-2 border-dashed p-10 transition-colors md:p-14",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <motion.div
            animate={isDragging ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ repeat: isDragging ? Infinity : 0, duration: 1.5 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/20"
          >
            <Upload className="h-8 w-8 text-primary" />
          </motion.div>
          <h3 className="mb-1 text-lg font-semibold">Drag and drop your file here</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            or click to browse from your device
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {supportedFormats.map((fmt) => (
              <span
                key={fmt}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
              >
                {fmt === "PDF" ? (
                  <FileText className="h-3 w-3" />
                ) : (
                  <Image className="h-3 w-3" />
                )}
                {fmt}
              </span>
            ))}
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <span className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80">
              <FileUp className="h-4 w-4" />
              Choose File
            </span>
          </label>
        </motion.div>

        {(uploading || progress === 100) && fileName && (
          <div className="border-t bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="truncate font-medium">{fileName}</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
