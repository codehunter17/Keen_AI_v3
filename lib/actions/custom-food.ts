"use server";

// Custom food entry. User types "moong dal puri" or "kashmiri rajma";
// we ask Gemini (Groq fallback) for ICMR-NIN-style macros + key micros,
// log it directly into today's DailyLog. Falls through gracefully if AI
// providers are unavailable — caller can pass manual values.

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { startOfDay, endOfDay } from "date-fns";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const FETCH_PROMPT = `You are a nutrition database. Given an Indian food name + serving description,
return a single valid JSON object with macros + key micros for that exact serving.

Use ICMR-NIN India Food Composition Tables 2017/2020. Round to one decimal.
Output ONLY valid JSON — no prose, no fences.

Schema:
{
  "kcal": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "fiber_g": number,
  "iron_mg": number,
  "calcium_mg": number,
  "potassium_mg": number,
  "folate_mcg": number,
  "vitC_mg": number
}

If you genuinely cannot estimate (very obscure regional dish), return:
{ "error": "unknown_food" }`;

interface FetchedMacros {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
  potassium_mg?: number;
  folate_mcg?: number;
  vitC_mg?: number;
}

async function tryGemini(name: string, serving: string): Promise<FetchedMacros | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return null;
  const m = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.1,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const r = await m.invoke([
    new SystemMessage(FETCH_PROMPT),
    new HumanMessage(`Food: ${name}\nServing: ${serving}`),
  ]);
  return parseMacros(typeof r.content === "string" ? r.content : "");
}

async function tryGroq(name: string, serving: string): Promise<FetchedMacros | null> {
  if (!process.env.GROQ_API_KEY) return null;
  const m = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    apiKey: process.env.GROQ_API_KEY,
  });
  const r = await m.invoke([
    new SystemMessage(FETCH_PROMPT),
    new HumanMessage(`Food: ${name}\nServing: ${serving}`),
  ]);
  return parseMacros(typeof r.content === "string" ? r.content : "");
}

function parseMacros(text: string): FetchedMacros | null {
  if (!text) return null;
  const cleaned = text.replace(/```json\s*|\s*```/gi, "").trim();
  try {
    const j = JSON.parse(cleaned);
    if (j.error) return null;
    if (typeof j.kcal !== "number") return null;
    return {
      kcal: j.kcal,
      protein_g: j.protein_g ?? 0,
      carbs_g: j.carbs_g ?? 0,
      fat_g: j.fat_g ?? 0,
      fiber_g: j.fiber_g ?? 0,
      iron_mg: j.iron_mg ?? 0,
      calcium_mg: j.calcium_mg ?? 0,
      potassium_mg: j.potassium_mg ?? undefined,
      folate_mcg: j.folate_mcg ?? undefined,
      vitC_mg: j.vitC_mg ?? undefined,
    };
  } catch {
    return null;
  }
}

const customFoodSchema = z.object({
  name: z.string().min(2).max(80),
  serving: z.string().min(1).max(60).default("1 serving"),
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  manualMacros: z
    .object({
      kcal: z.number(),
      protein_g: z.number(),
      iron_mg: z.number().optional(),
      calcium_mg: z.number().optional(),
    })
    .optional(),
});

export async function logCustomFood(input: z.infer<typeof customFoodSchema>) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) throw new Error("UNAUTHORIZED");
  const data = customFoodSchema.parse(input);

  // Try AI fetch unless manual values were provided
  let macros: FetchedMacros | null = null;
  if (!data.manualMacros) {
    try {
      macros = await tryGemini(data.name, data.serving);
    } catch {
      /* try next */
    }
    if (!macros) {
      try {
        macros = await tryGroq(data.name, data.serving);
      } catch {
        /* fall through */
      }
    }
  } else {
    macros = {
      kcal: data.manualMacros.kcal,
      protein_g: data.manualMacros.protein_g,
      carbs_g: 0,
      fat_g: 0,
      fiber_g: 0,
      iron_mg: data.manualMacros.iron_mg ?? 0,
      calcium_mg: data.manualMacros.calcium_mg ?? 0,
    };
  }

  // Persist into today's DailyLog meals[type] as a labelled entry
  const today = await prisma.dailyLog.findFirst({
    where: {
      userId: s.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
  });

  const typeKey = data.type === "snack" ? "snacks" : data.type;
  // Label includes serving if it's not the default — keeps the parser happy.
  const label = `${data.name} (${data.serving})`;

  if (today) {
    const meals = { ...((today.meals as Record<string, string[]>) ?? {}) };
    meals[typeKey] = [...(meals[typeKey] ?? []), label];
    await prisma.dailyLog.update({
      where: { id: today.id },
      data: { meals },
    });
  } else {
    await prisma.dailyLog.create({
      data: {
        userId: s.user.id,
        date: new Date(),
        meals: { [typeKey]: [label] },
        symptoms: {},
        waterGlasses: 0,
      },
    });
  }

  // Refresh nutrition streak + check badges
  try {
    const { refreshNutritionStreak, checkAndAwardBadges } = await import("./badges");
    refreshNutritionStreak().catch(() => {});
    checkAndAwardBadges().catch(() => {});
  } catch {
    /* swallow */
  }

  return {
    ok: true as const,
    fetched: !!macros && !data.manualMacros,
    macros: macros ?? null,
  };
}
