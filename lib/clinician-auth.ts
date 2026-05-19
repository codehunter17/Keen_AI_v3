/**
 * Clinician portal auth.
 *
 * Each clinician has a signed token of the form `<base64url(payload)>.<hex hmac>`
 * where payload = { tid: teacherId, iat: epoch_s, exp: epoch_s }.
 *
 * Token is signed with KEEN_CLINICIAN_SECRET (HMAC-SHA256). On the
 * `/api/clinician/auth?token=...` route we verify, set an HttpOnly cookie
 * scoped to /clinician, and redirect into the portal. The cookie reuses the
 * same token format so verification is identical for every request.
 *
 * Revocation: flip teacher.revoked=true in /admin/teachers — `verifyToken`
 * checks this on every request so revocation is instant.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CLINICIAN_COOKIE = "keen_clinician_token";
export const DEFAULT_TOKEN_TTL_DAYS = 365;

interface TokenPayload {
  tid: string; // teacherId
  iat: number; // issued-at epoch seconds
  exp: number; // expiration epoch seconds
}

function getSecret(): string {
  const s = process.env.KEEN_CLINICIAN_SECRET;
  if (!s) throw new Error("KEEN_CLINICIAN_SECRET env var is not set");
  return s;
}

function b64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLen), "base64");
}

function sign(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("hex");
}

export function mintToken(
  teacherId: string,
  ttlDays = DEFAULT_TOKEN_TTL_DAYS,
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    tid: teacherId,
    iat: now,
    exp: now + ttlDays * 24 * 60 * 60,
  };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = sign(payloadB64, getSecret());
  return `${payloadB64}.${sig}`;
}

export interface VerifiedClinician {
  teacherId: string;
  displayName: string;
  specialty: string;
  trustWeight: number;
}

export async function verifyToken(token: string): Promise<VerifiedClinician | null> {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  let expected: string;
  try {
    expected = sign(payloadB64, getSecret());
  } catch {
    return null;
  }

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }
  if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  if (typeof payload.tid !== "string" || !payload.tid) return null;

  const teacher = await prisma.keenTeacher.findUnique({
    where: { id: payload.tid },
    select: {
      id: true,
      displayName: true,
      specialty: true,
      trustWeight: true,
      revoked: true,
    },
  });
  if (!teacher || teacher.revoked) return null;

  return {
    teacherId: teacher.id,
    displayName: teacher.displayName,
    specialty: teacher.specialty,
    trustWeight: teacher.trustWeight,
  };
}

/** Read the cookie and verify it. Returns null if anonymous / revoked / expired. */
export async function getClinician(): Promise<VerifiedClinician | null> {
  const jar = await cookies();
  const tok = jar.get(CLINICIAN_COOKIE)?.value;
  if (!tok) return null;
  const verified = await verifyToken(tok);
  if (!verified) return null;
  // Best-effort lastSeenAt update — fire and forget.
  prisma.keenTeacher
    .update({
      where: { id: verified.teacherId },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => {
      // never crash on telemetry
    });
  return verified;
}
