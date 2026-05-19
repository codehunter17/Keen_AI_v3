/**
 * Twilio WhatsApp webhook.
 *
 * Operator replies to a proposal notification with one of:
 *   - "approve <id>"          → L2/L3 approval
 *   - "approve <id> <pass>"   → L4 approval (passphrase required)
 *   - "reject <id>"           → reject
 *
 * The webhook validates the Twilio signature (when TWILIO_AUTH_TOKEN is set)
 * and that the sender's WhatsApp number matches KEEN_OPERATOR_WHATSAPP.
 *
 * Twilio sends application/x-www-form-urlencoded; Next.js parses via formData.
 */

import { NextResponse } from "next/server";
import { approve, reject } from "@/keen";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const form = await req.formData();
  const fromRaw = (form.get("From") as string | null) ?? "";
  const bodyRaw = ((form.get("Body") as string | null) ?? "").trim();
  const operatorNumber = process.env.KEEN_OPERATOR_WHATSAPP;

  if (!operatorNumber || !fromRaw.includes(operatorNumber)) {
    return new NextResponse("ignored", { status: 200 });
  }

  const parts = bodyRaw.split(/\s+/);
  const action = parts[0]?.toLowerCase();
  const proposalId = parts[1];
  const passphrase = parts[2];

  if (!proposalId) {
    return NextResponse.json({ ok: false, error: "missing proposal id" });
  }

  if (action === "approve") {
    const result = await approve({
      proposalId,
      approver: operatorNumber,
      source: "whatsapp",
      passphrase,
    });
    return NextResponse.json(result);
  }
  if (action === "reject") {
    const result = await reject({
      proposalId,
      approver: operatorNumber,
      source: "whatsapp",
    });
    return NextResponse.json(result);
  }

  return NextResponse.json({ ok: false, error: "unknown command" });
}
