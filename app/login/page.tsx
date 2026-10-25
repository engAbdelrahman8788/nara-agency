import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Workspace sign in",
  description: "Authorized access to NARA client and agency workspaces.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) redirect("/dashboard");

  return <LoginView />;
}
