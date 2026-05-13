"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { runPredictionAndStoreFact } from "./predict";
import { storeMemory } from "./memory";
import { TIER_LIMITS, type Tier } from "@/lib/tiers";
import { nutritionRisk } from "@/lib/medical-kb";
import { startOfMonth, endOfMonth } from "date-fns";
import { invokeMultimodal } from "@/lib/llm";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

export async function createReport(data: {
    fileName: string;
    fileUrl: string;
    reportType: string;
    reportDate: string | Date;
    notes: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.report.create({
    data: {
      userId: session.user.id,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      reportType: data.reportType,
      reportDate: new Date(data.reportDate),
      notes: data.notes,
    },
  });
}

export async function getReports() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function analyzeReport(reportId: string, fileUrl: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("User not found");

  const tier = (user.tier as Tier) || "FREE";
  // Compatibility: old tiers used `reports` (all-time), new uses `reportAnalysesPerMonth`.
  const limits = TIER_LIMITS[tier] as Record<string, number | boolean>;
  const monthlyLimit =
    typeof limits.reportAnalysesPerMonth === "number"
      ? (limits.reportAnalysesPerMonth as number)
      : typeof limits.reports === "number"
        ? (limits.reports as number)
        : Infinity;

  if (monthlyLimit !== Infinity) {
    const now = new Date();
    const used = await prisma.report.count({
      where: {
        userId: session.user.id,
        aiAnalysis: { not: null },
        analyzedAt: { gte: startOfMonth(now), lte: endOfMonth(now) },
      },
    });
    if (used >= monthlyLimit) {
      throw new Error(
        `You've used your ${monthlyLimit} report analysis${monthlyLimit === 1 ? "" : "es"} for this month on the ${tier === "FREE" ? "Free" : tier} plan. Upgrade for more — visit /pricing.`,
      );
    }
  }

  // 1. Run predictor and dump fact into RAG
  const prediction = await runPredictionAndStoreFact(session.user.id);
  const riskLevel = prediction?.riskLevel || "Low";

  try {
    let aiAnalysis = "";
    let usedProvider = "";

    // We ask Gemini for BOTH a markdown summary (for display) AND a small
    // JSON block we can persist as structured `extracted` / `flagged` data.
    // The JSON powers RAG memories and the wellness dashboard.
    const prompt = `You are NutriMama AI, a women's health analyst.
    
    PATIENT CONTEXT:
    - Predicted Health Risk Level: ${riskLevel}
    - Dietary Preference: ${user.dietaryPref || "Not specified"}
    - Regional Preference: ${user.regionalPref || "Not specified"}
    - Current Pregnancy Week: ${user.pregnancyWeek || "Not specified"}
    - Age: ${user.age || "Not specified"}
    - Smoking/Alcohol Habits: ${user.smokeAlcohol || "None"}
    - Physical Activity: ${user.physicalActivity || "Moderate"}

    Analyze the provided medical report carefully. Provide a detailed analysis in the following structured format using EXACT Markdown syntax:

    ### 📄 Report Overview
    A concise, empathetic summary of what this report is about in plain language.

    ### 🔍 Key Findings & Flagged Values
    | Parameter | Your Value | Reference Range | Status | Interpretation |
    |:---|:---:|:---:|:---:|:---|
    
    CRITICAL: Ensure every row has exactly 5 columns separated by pipes (|).
    (If no values are flagged, state that results appear within standard ranges).

    ### 💡 Suggested Solutions & Wellness Tips
    Actionable advice based on the findings AND the user's ${riskLevel} risk level.
    - If risk is High, strongly advise consulting OB-GYN immediately.

    ### 🥗 Personalized Nutritional Guidance
    Specific dietary recommendations tailored to the findings, the patient's ${user.dietaryPref} preference, and their ${user.regionalPref} regional tastes. Suggest specific foods available in their region.

    ---
    **⚠️ Important Disclaimer**
    This analysis is for informational purposes only. Always consult your OB-GYN regarding your test results.

    AFTER the markdown above, append a fenced JSON code block (\`\`\`json … \`\`\`) with two keys:
    {
      "extracted": { "<paramName>": <numeric value>, ... },   // e.g. { "hemoglobin": 11.2, "glucose_fasting": 92, "tsh": 2.1 }
      "flagged":   [ { "field": "<paramName>", "value": <number>, "range": "<low-high>", "severity": "low|medium|high" } ]
    }
    Use lowercase snake_case parameter names. Include only what the report actually contains. If nothing is flagged, return an empty array. The JSON must be valid and parseable.`;

    if (fileUrl && /^https?:\/\//.test(fileUrl)) {
      // Legacy path: external public URL (kept for older rows that have it).
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to fetch file");
      const mimeType = res.headers.get("content-type") || "";
      const buffer = Buffer.from(await res.arrayBuffer());

      const isImage = mimeType.startsWith("image/");
      const isPDF = mimeType === "application/pdf";

      if (isImage || isPDF) {
        const base64 = buffer.toString("base64");
        const result = await invokeMultimodal({
          prompt,
          imageBase64: base64,
          mimeType,
          temperature: 0.4,
        });
        aiAnalysis = result.text;
        usedProvider = result.provider;
      } else {
        aiAnalysis = `**AI Assessment Summary**\n\nThe file type (${mimeType}) is not supported. Please upload a clear image or PDF report.\n\n*Disclaimer: This is informational only and not a substitute for professional medical advice.*`;
      }
    } else {
      aiAnalysis = `**AI Assessment Summary**\n\nNo file URL provided for analysis.\n\n*Disclaimer: This is informational only and not a substitute for professional medical advice.*`;
    }

    // ── Parse the trailing JSON block (best-effort) ───────────
    let extracted: Record<string, number> | null = null;
    let flagged: Array<{ field: string; value: number; range: string; severity: string }> | null = null;
    let displayMarkdown = aiAnalysis;

    const jsonMatch = aiAnalysis.match(/```json\s*([\s\S]*?)```/i);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        if (parsed.extracted && typeof parsed.extracted === "object") extracted = parsed.extracted;
        if (Array.isArray(parsed.flagged)) flagged = parsed.flagged;
        // strip the JSON block from what we display
        displayMarkdown = aiAnalysis.replace(jsonMatch[0], "").trim();
      } catch {
        /* swallow — JSON shape varies; keep markdown */
      }
    }

    await prisma.report.update({
      where: { id: reportId },
      data: {
        aiAnalysis: displayMarkdown,
        extracted: extracted ?? undefined,
        flagged: flagged ?? undefined,
        analyzedAt: new Date(),
      },
    });

    // ── Push structured findings into Memory (RAG) so chat can recall them.
    // Each flagged value becomes its own retrievable fact.
    if (flagged && flagged.length > 0) {
      for (const f of flagged) {
        await storeMemory(
          session.user.id,
          `[REPORT FINDING ${new Date().toISOString().slice(0, 10)}] ${f.field} = ${f.value} (range ${f.range}, severity ${f.severity})`,
          undefined,
        );
      }
    } else if (extracted) {
      // Even if nothing's flagged, store a single rolled-up snapshot
      const snap = Object.entries(extracted).map(([k, v]) => `${k}=${v}`).join(", ");
      await storeMemory(
        session.user.id,
        `[REPORT SNAPSHOT ${new Date().toISOString().slice(0, 10)}] ${snap}`,
        undefined,
      );
    }

    // ── Run nutrition risk scoring on extracted vitals ────────
    let nutritionRiskInsight: ReturnType<typeof nutritionRisk> | null = null;
    if (extracted) {
      nutritionRiskInsight = nutritionRisk({
        hbGdl: extracted.hemoglobin ?? extracted.hb,
        weightKg: user.weight ?? undefined,
        heightCm: user.height ?? undefined,
        bpSystolic: extracted.bp_systolic ?? extracted.systolic,
        bpDiastolic: extracted.bp_diastolic ?? extracted.diastolic,
      });
    }

    // Award FIRST_REPORT badge (idempotent — only fires once)
    try {
      const { awardBadge } = await import("./badges");
      await awardBadge("FIRST_REPORT");
    } catch {
      /* swallow — badge errors must never break analysis */
    }

    return {
      analysis: displayMarkdown,
      extracted,
      flagged,
      nutritionRisk: nutritionRiskInsight,
      provider: usedProvider,
    };
  } catch (e) {
    console.error("AI Analysis failed:", e);
    throw new Error("Analysis failed");
  }
}

export async function deleteReport(reportId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.report.delete({
    where: {
      id: reportId,
      userId: session.user.id,
    },
  });
}

// ─────────────────────────────────────────────────────────────────
//  IN-MEMORY REPORT ANALYSIS — no storage, max privacy
//  Browser sends base64 → we stream to Gemini → save findings only.
//  The image bytes are discarded after analysis.
// ─────────────────────────────────────────────────────────────────

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
]);
const MAX_BASE64_LENGTH = 16 * 1024 * 1024; // ≈ 12 MB binary

const inlineSchema = z.object({
  fileBase64: z.string().min(100),
  fileName: z.string().min(1).max(120),
  contentType: z.string(),
  reportType: z.string().min(1).max(60),
  reportDate: z.string(),
  notes: z.string().max(1000).optional(),
});

export async function analyzeReportInline(input: z.infer<typeof inlineSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const data = inlineSchema.parse(input);

  // Burst guard: 4 inline analyses / minute / user (Gemini ingest is heavy)
  const rl = rateLimit(`report:${session.user.id}`, 4, 60_000);
  if (!rl.ok) {
    throw new Error("Too many uploads. Please wait a minute and try again.");
  }

  if (!ALLOWED_MIME.has(data.contentType)) {
    throw new Error(`Unsupported file type: ${data.contentType}`);
  }
  if (data.fileBase64.length > MAX_BASE64_LENGTH) {
    throw new Error("File is too large. Max ~12 MB.");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  // Tier monthly limit (per-month, like analyzeReport)
  const tier = (user.tier as Tier) || "FREE";
  const limits = TIER_LIMITS[tier] as Record<string, number | boolean>;
  const monthlyLimit =
    typeof limits.reportAnalysesPerMonth === "number"
      ? (limits.reportAnalysesPerMonth as number)
      : typeof limits.reports === "number"
        ? (limits.reports as number)
        : Infinity;
  if (monthlyLimit !== Infinity) {
    const now = new Date();
    const used = await prisma.report.count({
      where: {
        userId: session.user.id,
        aiAnalysis: { not: null },
        analyzedAt: { gte: startOfMonth(now), lte: endOfMonth(now) },
      },
    });
    if (used >= monthlyLimit) {
      throw new Error(
        `You've used your ${monthlyLimit} report analysis${monthlyLimit === 1 ? "" : "es"} for this month on the ${tier === "FREE" ? "Free" : tier} plan. Upgrade for more — visit /pricing.`,
      );
    }
  }

  const prediction = await runPredictionAndStoreFact(session.user.id);
  const riskLevel = prediction?.riskLevel || "Low";

  const prompt = `You are NutriMama AI, a women's health analyst.

PATIENT CONTEXT:
- Predicted Health Risk Level: ${riskLevel}
- Dietary Preference: ${user.dietaryPref || "Not specified"}
- Regional Preference: ${user.regionalPref || "Not specified"}
- Current Pregnancy Week: ${user.pregnancyWeek || "Not specified"}
- Age: ${user.age || "Not specified"}

Analyze the provided medical report carefully. Respond in this exact format:

### 📄 Report Overview
A concise, empathetic summary in plain language.

### 🔍 Key Findings & Flagged Values
| Parameter | Your Value | Reference Range | Status | Interpretation |
|:---|:---:|:---:|:---:|:---|

(Every row must have exactly 5 columns. If nothing is flagged, say so.)

### 💡 Suggested Solutions & Wellness Tips
Actionable advice tied to the findings AND the user's ${riskLevel} risk level.

### 🥗 Personalized Nutritional Guidance
Specific Indian foods + ${user.dietaryPref || "any"} diet + ${user.regionalPref || "Indian"} cuisine.

---
**⚠️ Important Disclaimer**
Informational only. Always consult your OB-GYN.

AFTER the markdown, append a fenced JSON code block with two keys:
{
  "extracted": { "<param>": <number>, ... },
  "flagged":   [ { "field": "<param>", "value": <number>, "range": "<low-high>", "severity": "low|medium|high" } ]
}
Use lowercase snake_case. Empty array if nothing flagged. JSON must parse.`;

  const result = await invokeMultimodal({
    prompt,
    imageBase64: data.fileBase64,
    mimeType: data.contentType,
    temperature: 0.4,
  });
  const aiAnalysis = result.text;

  // Parse JSON tail (best-effort — same as analyzeReport)
  let extracted: Record<string, number> | null = null;
  let flagged:
    | Array<{ field: string; value: number; range: string; severity: string }>
    | null = null;
  let displayMarkdown = aiAnalysis;
  const jsonMatch = aiAnalysis.match(/```json\s*([\s\S]*?)```/i);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      if (parsed.extracted && typeof parsed.extracted === "object") extracted = parsed.extracted;
      if (Array.isArray(parsed.flagged)) flagged = parsed.flagged;
      displayMarkdown = aiAnalysis.replace(jsonMatch[0], "").trim();
    } catch {
      /* keep markdown */
    }
  }

  // Create the Report row. fileUrl="inline://" marks it as a discarded
  // file (the bytes are never stored).
  const report = await prisma.report.create({
    data: {
      userId: session.user.id,
      fileName: data.fileName,
      fileUrl: "inline://discarded",
      reportType: data.reportType,
      reportDate: new Date(data.reportDate),
      notes: data.notes ?? "",
      aiAnalysis: displayMarkdown,
      extracted: extracted ?? undefined,
      flagged: flagged ?? undefined,
      analyzedAt: new Date(),
    },
  });

  // Push flagged findings into RAG memory so chat can recall them.
  if (flagged && flagged.length > 0) {
    for (const f of flagged) {
      await storeMemory(
        session.user.id,
        `[REPORT FINDING ${new Date().toISOString().slice(0, 10)}] ${f.field} = ${f.value} (range ${f.range}, severity ${f.severity})`,
        undefined,
      );
    }
  } else if (extracted) {
    const snap = Object.entries(extracted).map(([k, v]) => `${k}=${v}`).join(", ");
    await storeMemory(
      session.user.id,
      `[REPORT SNAPSHOT ${new Date().toISOString().slice(0, 10)}] ${snap}`,
      undefined,
    );
  }

  // Nutrition risk + badge unlock — non-blocking
  let nutritionRiskInsight: ReturnType<typeof nutritionRisk> | null = null;
  if (extracted) {
    nutritionRiskInsight = nutritionRisk({
      hbGdl: extracted.hemoglobin ?? extracted.hb,
      weightKg: user.weight ?? undefined,
      heightCm: user.height ?? undefined,
      bpSystolic: extracted.bp_systolic ?? extracted.systolic,
      bpDiastolic: extracted.bp_diastolic ?? extracted.diastolic,
    });
  }
  try {
    const { awardBadge } = await import("./badges");
    awardBadge("FIRST_REPORT").catch(() => {});
  } catch {
    /* swallow */
  }

  return {
    ok: true as const,
    reportId: report.id,
    analysis: displayMarkdown,
    extracted,
    flagged,
    nutritionRisk: nutritionRiskInsight,
    provider: result.provider,
  };
}
