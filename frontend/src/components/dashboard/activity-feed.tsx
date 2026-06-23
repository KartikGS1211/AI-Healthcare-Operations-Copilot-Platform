"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Pill,
  Sparkles,
  Upload,
  AlertTriangle,
  GitBranch,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/types";

const activityIcons = {
  prescription: Pill,
  report: FileText,
  summary: Sparkles,
  alert: AlertTriangle,
  workflow: GitBranch,
};

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
}

export function ActivityFeed({ items, title = "Recent Activity" }: ActivityFeedProps) {
  return (
    <Card className="border-border/50 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {items.map((item) => {
            const Icon = activityIcons[item.type] ?? Upload;
            return (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.timestamp}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
