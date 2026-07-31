"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "abhi abhi";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  // Show "Xm Ys ago" for under 2 minutes — helps distinguish same-minute uploads
  if (diffMins < 2) {
    const remSecs = diffSecs % 60;
    return remSecs > 0 ? `${diffMins}m ${remSecs}s ago` : `${diffMins}m ago`;
  }
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  // Older than a week — show actual date
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
}

export function ActivityFeed({
  items,
  title = "Recent Activity",
}: ActivityFeedProps) {
  // Tick every 30 seconds so relative times stay fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

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
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span
                  className="shrink-0 text-xs text-muted-foreground"
                  title={new Date(item.timestamp).toLocaleString()}
                >
                  {getRelativeTime(item.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
