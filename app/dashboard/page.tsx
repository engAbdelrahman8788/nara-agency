import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { DashboardRole } from "@/components/dashboard/types";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "NARA client and agency workspace — live campaign performance, reporting, and support in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { role?: string | string[] };
}) {
  const requestedRole = Array.isArray(searchParams?.role)
    ? searchParams?.role[0]
    : searchParams?.role;
  const initialRole: DashboardRole = requestedRole === "admin" ? "admin" : "client";

  return <DashboardShell initialRole={initialRole} />;
}
