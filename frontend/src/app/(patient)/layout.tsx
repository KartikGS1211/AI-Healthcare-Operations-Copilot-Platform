"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { RoleGuard } from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PATIENT_NAV_ITEMS, PATIENT_PAGE_TITLES } from "@/lib/constants";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRole="patient">
        <DashboardShell
          navItems={PATIENT_NAV_ITEMS}
          pageTitles={PATIENT_PAGE_TITLES}
          settingsHref="/patient-dashboard/settings"
        >
          {children}
        </DashboardShell>
      </RoleGuard>
    </AuthGuard>
  );
}
