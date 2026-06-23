"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== allowedRole) {
      router.replace("/unauthorized");
    }
  }, [user, allowedRole, router]);

  if (!user || user.role !== allowedRole) {
    return null;
  }

  return children;
}
