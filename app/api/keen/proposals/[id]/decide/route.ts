import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { approve, reject } from "@/keen";

export const dynamic = "force-dynamic";

async function assertOperator() {
  const operatorEmail = process.env.KEEN_OPERATOR_EMAIL;
  if (!operatorEmail) return null;
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  if (!email || email.toLowerCase() !== operatorEmail.toLowerCase()) return null;
  return email;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const operator = await assertOperator();
  if (!operator) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    action?: "approve" | "reject";
    passphrase?: string;
  };

  if (body.action === "reject") {
    const result = await reject({
      proposalId: id,
      approver: operator,
      source: "dashboard",
    });
    return NextResponse.json(result);
  }

  if (body.action === "approve") {
    const result = await approve({
      proposalId: id,
      approver: operator,
      source: "dashboard",
      passphrase: body.passphrase,
    });
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
