"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { preCheck, withDisclaimer, INDIA_EMERGENCY, type SafetyFlag } from "@/lib/safety";
import { requireUser, requireUsageBudget } from "@/lib/guards";
import { startOfDay, endOfDay } from "date-fns";
import { triage, triagePreamble } from "@/lib/triage";
import { scrubPhi } from "@/lib/phi-scrubber";

export async function getChatSessions() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.chatSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getChatMessages(sessionId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.chatMessage.findMany({
    where: { sessionId, session: { userId: session.user.id } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createChatSession(title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.chatSession.create({
    data: { userId: session.user.id, title },
  });
}

export async function deleteChatSession(sessionId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.chatSession.delete({
    where: { id: sessionId, userId: session.user.id },
  });
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.chatSession.update({
    where: { id: sessionId, userId: session.user.id },
    data: { title },
  });
}

// ─────────────────────────────────────────────────────────────
// Safety-gated message handler. Every user message hits this:
//   1. Tier/usage budget enforced.
//   2. Safety pre-check (regex). If hard-block flag, we DO NOT call the LLM
//      — we save the surfaced helpline message as the assistant reply.
//   3. Otherwise, the caller's chat-streaming endpoint takes over (Gemini).
//      We log the safety flag on the user message for audit.
// ─────────────────────────────────────────────────────────────
export interface SaveUserMessageResult {
  ok: true;
  messageId: string;
  flag: SafetyFlag;
  triageLevel: "RED" | "YELLOW" | "GREEN";
  triageLabels: string[];
  scrubbedContent: string;        // PHI-redacted version safe to send to LLM
  preamble: string;               // optional text to prepend to LLM context
  blocked: boolean;
  surfacedReply?: string;
  surfacedReplyId?: string;
}

export async function saveUserMessage(
  sessionId: string,
  content: string,
): Promise<SaveUserMessageResult> {
  const ctx = await requireUser();

  // Count today's chats to enforce daily limit
  const today = new Date();
  const todaysChats = await prisma.chatMessage.count({
    where: {
      role: "user",
      session: { userId: ctx.userId },
      createdAt: { gte: startOfDay(today), lte: endOfDay(today) },
    },
  });
  await requireUsageBudget(ctx, "aiChatsPerDay", todaysChats);

  // 1. Triage (medical emergency classification)
  const tri = triage(content);
  // 2. Safety pre-check (self-harm + emergency keyword overlap)
  const safety = preCheck(content);
  // 3. PHI scrub — what we'll actually send to Gemini
  const phi = scrubPhi(content);

  const userMsg = await prisma.chatMessage.create({
    data: {
      sessionId,
      role: "user",
      content, // store the raw text — encrypted at rest, scrubbed only for outbound LLM
      safetyFlag: safety.flag,
      containsPii: phi.containsPii,
    },
  });

  // RED triage OR safety hard-block → surface helplines, never call LLM.
  const hardBlock = tri.level === "RED" || safety.blockResponse;
  if (hardBlock) {
    const reasonLabels = tri.matchedLabels.slice(0, 2).join(", ");
    const surfaced =
      safety.surfacedMessage ??
      `This sounds urgent (${reasonLabels}). Please call your doctor right now, ` +
      `or dial **${INDIA_EMERGENCY.ambulance}** for an ambulance / **${INDIA_EMERGENCY.general}** for emergency.`;

    const reply = await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "assistant",
        content: withDisclaimer(surfaced, safety.flag),
        safetyFlag: tri.level === "RED" ? "EMERGENCY" : safety.flag,
      },
    });
    return {
      ok: true,
      messageId: userMsg.id,
      flag: safety.flag,
      triageLevel: tri.level,
      triageLabels: tri.matchedLabels,
      scrubbedContent: phi.scrubbed,
      preamble: "",
      blocked: true,
      surfacedReply: reply.content,
      surfacedReplyId: reply.id,
    };
  }

  return {
    ok: true,
    messageId: userMsg.id,
    flag: safety.flag,
    triageLevel: tri.level,
    triageLabels: tri.matchedLabels,
    scrubbedContent: phi.scrubbed,
    preamble: triagePreamble(tri.level),
    blocked: false,
  };
}

// Persist the assistant's full reply once streaming finishes.
// The disclaimer is appended here so it's always present even if the
// streaming code path forgets to add it.
export async function saveAssistantMessage(
  sessionId: string,
  content: string,
  flag: SafetyFlag = "OK",
) {
  const ctx = await requireUser();
  const final = withDisclaimer(content, flag);
  const msg = await prisma.chatMessage.create({
    data: {
      sessionId,
      role: "assistant",
      content: final,
      safetyFlag: flag,
    },
  });
  // touch session updatedAt so the sidebar re-orders
  await prisma.chatSession.update({
    where: { id: sessionId, userId: ctx.userId },
    data: { updatedAt: new Date() },
  });
  return msg;
}
