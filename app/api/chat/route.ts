import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { storeMemory, getRelevantMemories } from "@/lib/actions/memory";
import { streamText } from "@/lib/llm";
import { rateLimit } from "@/lib/rate-limit";
import {
  computeTargets,
  computeTrimester,
  computeCyclePhase,
  payloadToSystemContext,
  HYPER_PERSONALIZATION_DIRECTIVES,
  type PhasePayload,
} from "@/lib/phase-payload";
import { findRelevantConditions, conditionsContextBlock } from "@/lib/conditions-kb";
import { differenceInCalendarDays } from "date-fns";
import { runPredictionAndStoreFact } from "@/lib/actions/predict";
import { TIER_LIMITS, type Tier } from "@/lib/tiers";
import { triage, triagePreamble } from "@/lib/triage";
import { preCheck, withDisclaimer, INDIA_EMERGENCY } from "@/lib/safety";
import { scrubPhi, scrubResponse } from "@/lib/phi-scrubber";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  // Burst-protection: 10 messages per minute per user. The per-day quota
  // (in TIER_LIMITS) is the business gate; this is the abuse gate.
  const rl = rateLimit(`chat:${session.user.id}`, 10, 60_000);
  if (!rl.ok) {
    return new NextResponse(
      "You're sending messages too fast. Please slow down for a minute.",
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  const { sessionId, message } = await req.json();

  // ── 1. Safety: triage + self-harm pre-check ─────────────────
  const tri = triage(message);
  const safety = preCheck(message);
  const hardBlock = tri.level === "RED" || safety.blockResponse;

  if (hardBlock) {
    const reason = tri.matchedLabels.slice(0, 2).join(", ") || "urgent symptoms";
    const surfaced =
      safety.surfacedMessage ??
      `This sounds urgent (${reason}). Please call your doctor right now, or dial **${INDIA_EMERGENCY.ambulance}** for an ambulance / **${INDIA_EMERGENCY.general}** for emergency. If a partner or family member is nearby, ask them to come to you.`;
    const final = withDisclaimer(surfaced, tri.level === "RED" ? "EMERGENCY" : safety.flag);
    await prisma.chatMessage.createMany({
      data: [
        { sessionId, role: "user", content: message, safetyFlag: tri.level === "RED" ? "EMERGENCY" : safety.flag },
        { sessionId, role: "assistant", content: final, safetyFlag: tri.level === "RED" ? "EMERGENCY" : safety.flag },
      ],
    });
    return new NextResponse(final, { status: 200, headers: { "X-Emergency": "true" } });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return new NextResponse("User not found", { status: 404 });

  // ── 2. Tier gate (per-day, not all-time) ────────────────────
  const tier = (user.tier as Tier) || "FREE";
  // Compatibility shim: older TIER_LIMITS shape used `chats`, new uses `aiChatsPerDay`.
  const limits = TIER_LIMITS[tier] as Record<string, number | boolean>;
  const dailyLimit =
    typeof limits.aiChatsPerDay === "number"
      ? (limits.aiChatsPerDay as number)
      : typeof limits.chats === "number"
        ? (limits.chats as number)
        : Infinity;

  if (dailyLimit !== Infinity) {
    const today = new Date();
    const used = await prisma.chatMessage.count({
      where: {
        session: { userId: session.user.id },
        role: "user",
        createdAt: { gte: startOfDay(today), lte: endOfDay(today) },
      },
    });
    if (used >= dailyLimit) {
      return new NextResponse(
        `You've reached your ${dailyLimit}-chats-per-day limit on the ${tier === "FREE" ? "Free" : tier} plan. Upgrade for more — visit /pricing.`,
        { status: 403 },
      );
    }
  }

  // ── 3. PHI scrub before anything goes to the LLM ────────────
  const phi = scrubPhi(message);

  await prisma.chatMessage.create({
    data: {
      sessionId,
      role: "user",
      content: message, // raw is encrypted at rest; LLM gets phi.scrubbed
      safetyFlag: tri.level === "YELLOW" ? "MEDICAL_DIAGNOSIS" : "OK",
      containsPii: phi.containsPii,
    },
  });

  // ── 4. RAG context build ────────────────────────────────────
  const prediction = await runPredictionAndStoreFact(session.user.id);
  const riskLevel = prediction?.riskLevel || "Low";

  const saveMemoryPromise = storeMemory(session.user.id, phi.scrubbed, sessionId);

  const [latestReports, recentLogs, relevantMemories] = await Promise.all([
    prisma.report.findMany({
      where: { userId: session.user.id, aiAnalysis: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { fileName: true, aiAnalysis: true, analyzedAt: true },
    }),
    prisma.dailyLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 3,
      select: { date: true, mood: true, symptoms: true, meals: true, waterGlasses: true },
    }),
    getRelevantMemories(session.user.id, phi.scrubbed, 3),
    saveMemoryPromise,
  ]);

  const reportContext =
    latestReports.length > 0
      ? latestReports
          .map((r) =>
            `[Report: ${r.fileName} (${r.analyzedAt?.toLocaleDateString()})]: ${r.aiAnalysis?.slice(0, 500)}...`,
          )
          .join("\n")
      : "No recent medical reports analyzed.";

  const logContext =
    recentLogs.length > 0
      ? recentLogs
          .map((l) => {
            const meals = typeof l.meals === "string" ? JSON.parse(l.meals) : l.meals;
            const symptoms = typeof l.symptoms === "string" ? JSON.parse(l.symptoms) : l.symptoms;
            return `[Log: ${l.date.toLocaleDateString()}]: Mood: ${l.mood || "Neutral"}, Symptoms: ${JSON.stringify(symptoms)}, Nutrition: ${JSON.stringify(meals)}`;
          })
          .join("\n")
      : "No recent daily health logs found.";

  const memoryContext =
    relevantMemories.length > 0
      ? relevantMemories.map((m: string) => `- ${m}`).join("\n")
      : "No relevant past context.";

  const yellowPreamble = triagePreamble(tri.level);

  // Last 6 turns = 12 messages — keeps context small for fast TTFT.
  const recent = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { role: true, content: true },
  });
  const history = recent.reverse();

  // ── Compute the phase payload — math-anchored, phase-aware ──
  // Cycle day is derived from the most recent CycleLog start date, if any.
  const lastCycle = await prisma.cycleLog.findFirst({
    where: { userId: session.user.id },
    orderBy: { startDate: "desc" },
    select: { startDate: true },
  });
  const cycleDay = lastCycle
    ? differenceInCalendarDays(new Date(), lastCycle.startDate) + 1
    : null;
  const { phase: cyclePhase, cycleDay: normalizedDay } = computeCyclePhase(cycleDay);

  const todayLog = recentLogs[0];
  const phasePayload: PhasePayload = {
    name: user.name ?? null,
    age: user.age ?? null,
    diet: user.dietaryPref ?? null,
    region: user.regionalPref ?? null,
    lifeStage: user.lifeStage ?? user.pregnancyStage ?? null,
    pregnancyWeek: user.pregnancyWeek ?? null,
    trimester: computeTrimester(user.pregnancyWeek ?? null),
    cyclePhase,
    cycleDay: normalizedDay,
    targets: computeTargets({
      age: user.age ?? null,
      lifeStage: user.lifeStage ?? user.pregnancyStage ?? null,
      pregnancyWeek: user.pregnancyWeek ?? null,
    }),
    lastLog: {
      waterGlasses: todayLog?.waterGlasses ?? 0,
      mood: todayLog?.mood ?? null,
      activity: null, // PrismaJson field; left null for v1
    },
    flaggedFindings: relevantMemories.filter((m: string) => m.includes("[REPORT FINDING")),
  };

  // ── Match condition knowledge against user's message ──
  // The AI gets specialist-level info on whatever the user is actually asking about,
  // so it can give deep answers instead of "see a doctor."
  const relevantConditions = findRelevantConditions(message, 2);
  const conditionsBlock = conditionsContextBlock(relevantConditions);

  // ── Strict hyper-personalization system prompt ──
  const systemPrompt = [
    HYPER_PERSONALIZATION_DIRECTIVES,
    yellowPreamble ? "\n### TRIAGE NOTE — see a doctor today\n" + yellowPreamble : "",
    `\n### Predicted Risk Level: ${riskLevel}`,
    conditionsBlock ? "\n" + conditionsBlock : "",
    "\n### Reports (verbatim AI summaries)\n" + reportContext,
    "\n### Recent daily logs\n" + logContext,
    "\n### Relevant past memories\n" + memoryContext,
    "\n### USER_PAYLOAD (anchor every reply to these numbers)\n" + payloadToSystemContext(phasePayload),
  ]
    .filter(Boolean)
    .join("\n");

  // Multi-provider failover: Groq → Gemini → Sonnet (configurable via env)
  let stream: AsyncIterable<string>;
  let usedProvider: string;
  try {
    const result = await streamText({
      system: systemPrompt,
      prompt: phi.scrubbed,
      history: history.map((h) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.content,
      })),
      temperature: 0.6,
      // Pro tier → Anthropic Sonnet first (highest reasoning quality)
      // Care + Free → speed-first chain (Groq → Gemini → Sonnet)
      premium: tier === "PRO_99",
    });
    stream = result.iterator;
    usedProvider = result.provider;
  } catch (e) {
    console.error("[chat] all LLM providers failed", e);
    return new NextResponse(
      "All AI providers are temporarily unavailable. Please try again in a minute.",
      { status: 503 },
    );
  }

  let fullResponse = "";
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (e) {
        console.error("Stream error", e);
      } finally {
        const cleaned = scrubResponse(fullResponse); // belt-and-suspenders PHI scrub on output
        await prisma.chatMessage.create({
          data: { sessionId, role: "assistant", content: cleaned, safetyFlag: tri.level === "YELLOW" ? "MEDICAL_DIAGNOSIS" : "OK" },
        });
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Provider": usedProvider,
    },
  });
}
