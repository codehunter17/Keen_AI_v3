import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { releaseIp } from "@/keen";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ ip: string }> },
) {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  if (!email || email.toLowerCase() !== operatorEmail.toLowerCase()) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { ip } = await params;
  await releaseIp(decodeURIComponent(ip));
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/admin/quarantine`, 303);
}
