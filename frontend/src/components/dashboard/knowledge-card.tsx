"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RagSearchResult } from "@/types";

interface KnowledgeCardProps {
  result: RagSearchResult;
  index?: number;
}

export function KnowledgeCard({ result, index = 0 }: KnowledgeCardProps) {
  const confidence = Math.round((result.confidence ?? 0.85) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="border-border/50 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              {result.source ?? "Medical Evidence"}
            </CardTitle>
            <Badge variant="outline" className="shrink-0">
              {confidence}% confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.content}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Relevance</span>
              <span>{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
