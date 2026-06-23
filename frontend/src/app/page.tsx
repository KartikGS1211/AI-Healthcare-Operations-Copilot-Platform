"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getRoleRedirect } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      if (user) {
        router.replace(getRoleRedirect(user.role));
      } else {
        router.replace("/login");
      }
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        const currentUser = useAuthStore.getState().user;
        router.replace(
          currentUser ? getRoleRedirect(currentUser.role) : "/login"
        );
      });
      return unsub;
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
