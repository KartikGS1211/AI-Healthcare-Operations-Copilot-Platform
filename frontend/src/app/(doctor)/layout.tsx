"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { RoleGuard } from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DOCTOR_NAV_ITEMS, DOCTOR_PAGE_TITLES } from "@/lib/constants";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRole="doctor">
        <DashboardShell
          navItems={DOCTOR_NAV_ITEMS}
          pageTitles={DOCTOR_PAGE_TITLES}
          settingsHref="/settings"
        >
          {children}
        </DashboardShell>
      </RoleGuard>
    </AuthGuard>
  );
}
