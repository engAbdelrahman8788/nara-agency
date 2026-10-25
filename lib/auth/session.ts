export const SESSION_COOKIE = "nara_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionRole = "client" | "admin";

export type SessionPayload = {
  role: SessionRole;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
let cachedSecret: string | null = null;
let cachedKey: Promise<CryptoKey> | null = null;

// Demo fallback so preview deployments work without environment setup. Set
// AUTH_SECRET in production to rotate sessions to a private secret.
const FALLBACK_AUTH_SECRET = "nara-demo-fallback-session-secret-2026-rotate-me";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : FALLBACK_AUTH_SECRET;
}

async function getKey(): Promise<CryptoKey> {
  const secret = getSecret();

  if (!cachedKey || cachedSecret !== secret) {
    cachedSecret = secret;
    cachedKey = crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
  }

  return cachedKey;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): ArrayBuffer {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error("Invalid base64url value.");
  }

  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return buffer;
}

export async function createSessionToken(input: {
  role: SessionRole;
  email: string;
  name: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    role: input.role,
    email: input.email,
    name: input.name,
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await getKey(), encoder.encode(body));

  return `${body}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || token.length > 4_096) return null;

    const [body, signature] = token.split(".");
    if (!body || !signature) return null;

    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      base64UrlDecode(signature),
      encoder.encode(body),
    );
    if (!valid) return null;

    const payload = JSON.parse(decoder.decode(base64UrlDecode(body))) as Partial<SessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    if (
      typeof payload.exp !== "number" ||
      payload.exp <= now ||
      (payload.role !== "client" && payload.role !== "admin") ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
