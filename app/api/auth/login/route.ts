import { NextResponse, type NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionRole,
} from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Account = {
  email: string;
  password: string;
  name: string;
  role: SessionRole;
};

type AttemptBucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, AttemptBucket>();

function getAccounts(): Account[] {
  const accounts: Account[] = [];

  if (process.env.AUTH_CLIENT_EMAIL && process.env.AUTH_CLIENT_PASSWORD) {
    accounts.push({
      email: process.env.AUTH_CLIENT_EMAIL,
      password: process.env.AUTH_CLIENT_PASSWORD,
      name: process.env.AUTH_CLIENT_NAME || "NARA Client",
      role: "client",
    });
  }

  if (process.env.AUTH_ADMIN_EMAIL && process.env.AUTH_ADMIN_PASSWORD) {
    accounts.push({
      email: process.env.AUTH_ADMIN_EMAIL,
      password: process.env.AUTH_ADMIN_PASSWORD,
      name: process.env.AUTH_ADMIN_NAME || "NARA Admin",
      role: "admin",
    });
  }

  return accounts;
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return request.ip || forwarded?.split(",")[0]?.trim() || "local";
}

function isRateLimited(ip: string): boolean {
  const bucket = attempts.get(ip);
  if (!bucket) return false;
  if (Date.now() > bucket.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return bucket.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const bucket = attempts.get(ip);

  if (!bucket || now > bucket.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  bucket.count += 1;
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function isSecureRequest(request: NextRequest): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return forwardedProto === "https" || request.nextUrl.protocol === "https:";
}

function noStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return noStore(NextResponse.json({ error: "invalid" }, { status: 403 }));
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    const response = NextResponse.json({ error: "rate_limited" }, { status: 429 });
    response.headers.set("Retry-After", String(WINDOW_MS / 1000));
    return noStore(response);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noStore(NextResponse.json({ error: "invalid" }, { status: 400 }));
  }

  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase().slice(0, 320)
      : "";
  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password.slice(0, 512)
      : "";

  if (!email || !password) {
    recordFailure(ip);
    return noStore(NextResponse.json({ error: "invalid" }, { status: 401 }));
  }

  const accounts = getAccounts();
  if (accounts.length === 0) {
    console.error("No dashboard accounts are configured. Set AUTH_CLIENT_* and AUTH_ADMIN_* env variables.");
    return noStore(NextResponse.json({ error: "server" }, { status: 503 }));
  }

  let authenticated: Account | null = null;
  for (const account of accounts) {
    const emailMatches = safeEqual(account.email.trim().toLowerCase(), email);
    const passwordMatches = safeEqual(account.password, password);
    if (emailMatches && passwordMatches) authenticated = account;
  }

  if (!authenticated) {
    recordFailure(ip);
    return noStore(NextResponse.json({ error: "invalid" }, { status: 401 }));
  }

  attempts.delete(ip);

  try {
    const token = await createSessionToken({
      role: authenticated.role,
      email: authenticated.email,
      name: authenticated.name,
    });
    const response = NextResponse.json({ ok: true, role: authenticated.role });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecureRequest(request),
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return noStore(response);
  } catch {
    console.error("Session creation failed. Verify AUTH_SECRET is configured.");
    return noStore(NextResponse.json({ error: "server" }, { status: 500 }));
  }
}
