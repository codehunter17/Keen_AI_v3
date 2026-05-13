// Razorpay webhook receiver. Handles subscription lifecycle:
//   payment.captured     → confirm subscription (idempotent)
//   subscription.charged → extend currentPeriodEnd by 1 month
//   subscription.cancelled → mark canceled
//   payment.failed       → mark PAST_DUE
//
// Configure the webhook URL in Razorpay dashboard:
//   POST https://<your-domain>/api/razorpay/webhook
//   Active events: payment.captured, payment.failed,
//                  subscription.charged, subscription.cancelled

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { addMonths } from "date-fns";

export const runtime = "nodejs";

interface RzpEvent {
  event: string;
  // Razorpay sends a unique event id at the top level for idempotency
  id?: string;
  payload: {
    payment?: { entity: { id: string; order_id?: string; status: string; notes?: Record<string, string> } };
    subscription?: { entity: { id: string; status: string; current_end?: number; notes?: Record<string, string> } };
  };
}

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, sig)) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  const evt = JSON.parse(raw) as RzpEvent;

  // ── Idempotency — skip if we've already processed this event ──
  // Razorpay can deliver the same event multiple times. The unique
  // event_id (or a synthesized one if not present) is our dedupe key.
  const eventId =
    evt.id ??
    `${evt.event}:${evt.payload.payment?.entity.id ?? evt.payload.subscription?.entity.id ?? "unknown"}`;
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "RAZORPAY",
        eventId,
        eventType: evt.event,
        payload: evt as unknown as object,
      },
    });
  } catch (err) {
    // Unique constraint = duplicate; ack 200 so Razorpay stops retrying.
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: true, deduped: true });
    }
    throw err;
  }

  try {
    switch (evt.event) {
      case "subscription.charged": {
        const sub = evt.payload.subscription?.entity;
        if (!sub) break;
        const target = await prisma.subscription.findFirst({
          where: { providerSubId: sub.id },
        });
        if (target) {
          const periodEnd = sub.current_end
            ? new Date(sub.current_end * 1000)
            : addMonths(new Date(), 1);
          await prisma.subscription.update({
            where: { id: target.id },
            data: { status: "ACTIVE", currentPeriodEnd: periodEnd },
          });
          await prisma.user.update({
            where: { id: target.userId },
            data: { tier: target.tier, tierExpiresAt: periodEnd },
          });
        }
        break;
      }
      case "subscription.cancelled": {
        const sub = evt.payload.subscription?.entity;
        if (!sub) break;
        await prisma.subscription.updateMany({
          where: { providerSubId: sub.id },
          data: { status: "CANCELED", canceledAt: new Date() },
        });
        break;
      }
      case "payment.failed": {
        const p = evt.payload.payment?.entity;
        if (!p) break;
        await prisma.subscription.updateMany({
          where: { providerSubId: p.id },
          data: { status: "PAST_DUE" },
        });
        break;
      }
      case "payment.captured": {
        // Idempotent confirm — useful when client-side confirmPayment fails
        // but the webhook still arrives. We don't have order→user without
        // the notes; rely on the in-app confirmPayment for primary path.
        break;
      }
    }
  } catch (err) {
    console.error("[razorpay webhook] handler error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
