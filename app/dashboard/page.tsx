import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "NARA client and agency workspace — live campaign performance, reporting, and support in one place.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) redirect("/login");

  return (
    <DashboardShell
      role={session.role}
      viewer={{ name: session.name, email: session.email }}
    />
  );
}
