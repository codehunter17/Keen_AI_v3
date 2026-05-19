import { NextResponse } from "next/server";
import { CLINICIAN_COOKIE } from "@/lib/clinician-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const res = NextResponse.redirect(`${origin}/`, 303);
  res.cookies.set({
    name: CLINICIAN_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
