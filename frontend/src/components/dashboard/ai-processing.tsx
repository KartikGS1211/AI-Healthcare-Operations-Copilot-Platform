"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIProcessingProps {
  message: string;
}

export function AIProcessing({ message }: AIProcessingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/20 bg-primary/5 shadow-sm backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-primary/20"
            />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 animate-pulse text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="font-medium">{message}</p>
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              Our AI is analyzing medical data securely...
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
