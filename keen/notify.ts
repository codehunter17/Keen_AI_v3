/**
 * Operator notifications.
 *
 * Approval channels: WhatsApp (Twilio Cloud API) + hidden /admin dashboard.
 * Email is deliberately NOT a channel.
 *
 * If TWILIO env vars are missing, notifications are logged to console and
 * persisted in keen_proposal.status so the dashboard remains the single source
 * of truth. WhatsApp is best-effort, never a hard dependency.
 */

const TWILIO_API = "https://api.twilio.com/2010-04-01/Accounts";

export interface WhatsAppMessage {
  /** Short body — WhatsApp prefers concise. */
  body: string;
  /** Dashboard URL the operator can tap to review. */
  dashboardUrl?: string;
}

export async function notifyOperator(msg: WhatsAppMessage): Promise<{
  ok: boolean;
  channel: "whatsapp" | "console";
  detail?: string;
}> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  const toNumber = process.env.KEEN_OPERATOR_WHATSAPP;

  const bodyWithLink = msg.dashboardUrl
    ? `${msg.body}\n\nReview: ${msg.dashboardUrl}`
    : msg.body;

  if (!sid || !token || !fromNumber || !toNumber) {
    // eslint-disable-next-line no-console
    console.warn("[Keen.notify] WhatsApp not configured. Logging only.");
    // eslint-disable-next-line no-console
    console.log("[Keen.notify]", bodyWithLink);
    return { ok: true, channel: "console" };
  }

  const params = new URLSearchParams({
    From: `whatsapp:${fromNumber}`,
    To: `whatsapp:${toNumber}`,
    Body: bodyWithLink,
  });

  try {
    const res = await fetch(`${TWILIO_API}/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      return { ok: false, channel: "whatsapp", detail: `Twilio HTTP ${res.status}` };
    }
    return { ok: true, channel: "whatsapp" };
  } catch (err) {
    return {
      ok: false,
      channel: "whatsapp",
      detail: err instanceof Error ? err.message : "unknown",
    };
  }
}

/** Build the operator-facing dashboard URL for a given proposal. */
export function proposalDashboardUrl(proposalId: string): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${origin}/admin/proposals/${proposalId}`;
}
