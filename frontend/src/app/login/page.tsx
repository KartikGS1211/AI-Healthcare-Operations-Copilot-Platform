"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getRoleRedirect } from "@/lib/constants";
import { LoginForm } from "@/components/auth/login-form";
import { APP_NAME, APP_SHORT_NAME } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setReady(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => setReady(true));
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (ready && user) {
      router.replace(getRoleRedirect(user.role));
    }
  }, [user, ready, router]);

  if (!ready || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Access your AI-powered healthcare operations dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
