// Voice-meal-logging endpoint.
// Frontend captures Hindi/Hinglish/English speech via Web Speech API and POSTs
// the raw transcript here. Groq Llama parses it into structured meal/water/symptom
// JSON. We write it to DailyLog.
//
// Why Groq for this: Llama 3.3 is fast (sub-second) + cheap free tier + handles
// Hinglish parsing well. Falls through to Gemini if Groq is down.

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { startOfDay, endOfDay } from "date-fns";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const PARSER_SYSTEM = `You are a structured-data extractor. Given a user's spoken description
of what they ate, drank, how they feel, parse it into strict JSON.

OUTPUT — must be a single valid JSON object, no prose, no markdown fences:
{
  "meals": [
    { "type": "breakfast" | "lunch" | "dinner" | "snack", "items": ["<food name>", ...] }
  ],
  "waterMl": <number 0..3000>,
  "moodWord": "great" | "good" | "okay" | "low" | "rough" | null,
  "symptoms": [<lowercase symptom strings>],
  "notes": "<short summary of what user said>"
}

Rules:
- Recognize Hinglish (e.g. "do roti aur ek katori dal" = 2 rotis + 1 bowl dal).
- Convert "ek glass" / "1 glass" / "1 गिलास" of water to ~250 ml.
- "do glass paani" = 500 ml. "thoda paani" = 200 ml.
- If only meals are mentioned, leave waterMl null/0 and symptoms empty.
- Output ONLY the JSON. No explanation.`;

interface ParsedLog {
  meals: { type: string; items: string[] }[];
  waterMl: number;
  moodWord: string | null;
  symptoms: string[];
  notes: string;
}

async function parseWithGroq(transcript: string): Promise<ParsedLog | null> {
  if (!process.env.GROQ_API_KEY) return null;
  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    apiKey: process.env.GROQ_API_KEY,
  });
  const r = await model.invoke([
    new SystemMessage(PARSER_SYSTEM),
    new HumanMessage(transcript),
  ]);
  return parseJsonFromContent(typeof r.content === "string" ? r.content : "");
}

async function parseWithGemini(transcript: string): Promise<ParsedLog | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return null;
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.1,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const r = await model.invoke([
    new SystemMessage(PARSER_SYSTEM),
    new HumanMessage(transcript),
  ]);
  return parseJsonFromContent(typeof r.content === "string" ? r.content : "");
}

function parseJsonFromContent(text: string): ParsedLog | null {
  if (!text) return null;
  // Strip markdown fences if any
  const cleaned = text.replace(/```json\s*|\s*```/gi, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      waterMl: typeof parsed.waterMl === "number" ? parsed.waterMl : 0,
      moodWord: typeof parsed.moodWord === "string" ? parsed.moodWord : null,
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return new NextResponse("Unauthorized", { status: 401 });

  // Burst guard: 12 voice logs per minute
  const rl = rateLimit(`voice:${s.user.id}`, 12, 60_000);
  if (!rl.ok) {
    return new NextResponse("Slow down. Try again in a minute.", { status: 429 });
  }

  let body: { transcript?: string };
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid body", { status: 400 });
  }
  const transcript = (body.transcript ?? "").toString().trim();
  if (transcript.length < 2 || transcript.length > 500) {
    return new NextResponse("Transcript must be 2-500 chars", { status: 400 });
  }

  // Try Groq first, fall through to Gemini
  let parsed: ParsedLog | null = null;
  try {
    parsed = await parseWithGroq(transcript);
  } catch (e) {
    console.warn("[voice-log] Groq failed, trying Gemini", e);
  }
  if (!parsed) {
    try {
      parsed = await parseWithGemini(transcript);
    } catch (e) {
      console.warn("[voice-log] Gemini failed too", e);
    }
  }
  if (!parsed) {
    return NextResponse.json(
      { ok: false, error: "Couldn't understand. Try again or type it." },
      { status: 502 },
    );
  }

  // Persist to today's DailyLog (upsert)
  const today = await prisma.dailyLog.findFirst({
    where: {
      userId: s.user.id,
      date: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
    },
  });

  const newWaterGlasses = Math.round(parsed.waterMl / 250);
  const mealsByType: Record<string, string[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
  for (const m of parsed.meals) {
    const t = m.type === "snack" ? "snacks" : m.type;
    if (mealsByType[t]) mealsByType[t].push(...m.items);
  }

  const symptomsBlob = { list: parsed.symptoms.map((s) => ({ name: s, severity: "mild" })) };

  if (today) {
    await prisma.dailyLog.update({
      where: { id: today.id },
      data: {
        meals: { ...(today.meals as object), ...mealsByType },
        symptoms: parsed.symptoms.length ? symptomsBlob : (today.symptoms as object),
        waterGlasses: today.waterGlasses + newWaterGlasses,
        mood: parsed.moodWord ?? today.mood,
      },
    });
  } else {
    await prisma.dailyLog.create({
      data: {
        userId: s.user.id,
        date: new Date(),
        meals: mealsByType,
        symptoms: symptomsBlob,
        waterGlasses: newWaterGlasses,
        mood: parsed.moodWord,
      },
    });
  }

  return NextResponse.json({ ok: true, parsed });
}
