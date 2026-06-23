"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { APP_NAME, APP_SHORT_NAME } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md space-y-6"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{APP_SHORT_NAME}</h1>
            <p className="text-sm text-muted-foreground">{APP_NAME}</p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/80 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Register as a doctor or patient to access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
