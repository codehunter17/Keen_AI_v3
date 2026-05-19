/**
 * Token-to-cookie exchange.
 *
 * Clinician opens https://nutrimama-v3.vercel.app/api/clinician/auth?token=...
 * (link they got via WhatsApp). We verify, write an HttpOnly cookie, and redirect
 * them into the portal. Subsequent navigations are cookie-only — the token URL
 * is only ever used once.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CLINICIAN_COOKIE,
  DEFAULT_TOKEN_TTL_DAYS,
  verifyToken,
} from "@/lib/clinician-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const verified = await verifyToken(token);

  if (!verified) {
    return new NextResponse("Invalid or expired invite link.", { status: 401 });
  }

  // Mark first-time visit so /admin/teachers can show "joined" status.
  prisma.keenTeacher
    .update({
      where: { id: verified.teacherId, invitedAt: null },
      data: { invitedAt: new Date() },
    })
    .catch(() => {
      // already invited — fine
    });

  const origin = url.origin;
  const res = NextResponse.redirect(`${origin}/clinician`);
  res.cookies.set({
    name: CLINICIAN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEFAULT_TOKEN_TTL_DAYS * 24 * 60 * 60,
  });
  return res;
}
