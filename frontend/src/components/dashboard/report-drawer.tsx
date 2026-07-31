"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  User,
  Clock,
  Tag,
  Brain,
  AlignLeft,
  ExternalLink,
} from "lucide-react";
import { reportService } from "@/services/report.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ReportDrawerProps {
  reportId: number | null;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  lab: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  prescription: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  radiology: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  discharge: "bg-green-500/10 text-green-400 border-green-500/20",
  "drug report": "bg-red-500/10 text-red-400 border-red-500/20",
  "opd report": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "patient report": "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

function getTypeColor(type: string) {
  return (
    TYPE_COLORS[type.toLowerCase()] ??
    "bg-primary/10 text-primary border-primary/20"
  );
}

export function ReportDrawer({ reportId, onClose }: ReportDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ["report-detail", reportId],
    queryFn: () => reportService.getById(reportId!),
    enabled: reportId !== null,
    staleTime: 30_000,
  });

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Trap focus inside drawer
  useEffect(() => {
    if (reportId !== null) drawerRef.current?.focus();
  }, [reportId]);

  const formattedDate = report
    ? new Date(report.uploaded_at).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <AnimatePresence>
      {reportId !== null && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/50 bg-background shadow-2xl outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Report Details</p>
                  <p className="text-xs text-muted-foreground">
                    ID #{reportId}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {isLoading ? (
                <DrawerSkeleton />
              ) : report ? (
                <div className="space-y-5">
                  {/* Type badge */}
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Type</span>
                    <Badge
                      variant="outline"
                      className={`ml-auto text-xs font-medium ${getTypeColor(report.report_type)}`}
                    >
                      {report.report_type.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Patient */}
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Patient ID
                    </span>
                    <span className="ml-auto text-xs font-medium">
                      #{report.patient_id}
                    </span>
                  </div>

                  {/* Upload time */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Uploaded
                    </span>
                    <span className="ml-auto text-xs font-medium">
                      {formattedDate}
                    </span>
                  </div>

                  {/* File name */}
                  <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      File
                    </p>
                    <p className="break-all text-xs text-foreground">
                      {report.file_name}
                    </p>
                  </div>

                  {/* AI Summary */}
                  {report.summary ? (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-3">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Brain className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs font-semibold text-primary">
                          AI Summary
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/80">
                        {report.summary}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-3">
                      <div className="mb-1 flex items-center gap-1.5">
                        <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">
                          AI Summary
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Not generated yet. Open the report to generate one.
                      </p>
                    </div>
                  )}

                  {/* Extracted Text Preview */}
                  {report.extracted_text && (
                    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                      <div className="mb-2 flex items-center gap-1.5">
                        <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">
                          Extracted Text Preview
                        </p>
                      </div>
                      <p className="line-clamp-6 text-xs leading-relaxed text-foreground/70">
                        {report.extracted_text}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  Report not found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 px-5 py-3">
              <Link href="/reports">
                <Button className="w-full gap-2" onClick={onClose}>
                  <ExternalLink className="h-4 w-4" />
                  View Full Report
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[60, 40, 50, 100, 160, 120].map((w, i) => (
        <div
          key={i}
          className="h-4 rounded bg-muted/50"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}
