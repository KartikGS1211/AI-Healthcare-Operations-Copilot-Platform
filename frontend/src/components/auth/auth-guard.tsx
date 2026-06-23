"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
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
    if (ready && (!user || !token)) {
      router.replace("/login");
    }
  }, [user, token, ready, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-10 rounded-lg" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return children;
}
