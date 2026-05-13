"use server";

import { ChatGroq } from "@langchain/groq";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { runPredictionAndStoreFact } from "./predict";

export async function getNutritionPlan() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const weekNumber = user.pregnancyWeek || 1;

  // 1. Run predictor and dump fact into RAG
  const prediction = await runPredictionAndStoreFact(session.user.id);
  const riskLevel = prediction?.riskLevel || "Low";

  const plan = await prisma.nutritionPlan.findFirst({
    where: { userId: user.id, weekNumber },
  });

  if (plan && plan.planData) {
    return plan.planData;
  }

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "qwen/qwen3-32b",
  });

  const prompt = `Generate a 7-day maternal nutrition plan for pregnancy week ${weekNumber}. 
Patient Health Risk Level: ${riskLevel}.
Dietary: ${user.dietaryPref || "None"}, Regional: ${user.regionalPref || "None"}.
RETURN JSON ONLY:
{
  "milestone": "Short milestone text",
  "preferenceReasoning": "Explain why this plan is optimized for their specific Dietary and Regional preferences while meeting pregnancy needs",
  "topNutrients": ["Nutrient 1", "Nutrient 2"],
  "avoidFoods": ["Food 1", "Food 2"],
  "days": [
    {
      "day": 1,
      "breakfast": {"items": "desc", "calories": "300", "nutrients": "desc"},
      "lunch": {"items": "desc", "calories": "400", "nutrients": "desc"},
      "dinner": {"items": "desc", "calories": "450", "nutrients": "desc"},
      "snacks": {"items": "desc", "calories": "200", "nutrients": "desc"}
    }
  ]
}`;

  try {
    const response = await model.invoke(prompt, {
      response_format: { type: "json_object" },
    });
    const content = response.content.toString().trim();

    // Use a robust regex to extract the JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not find JSON in AI response");

    const planData = JSON.parse(jsonMatch[0].trim());

    await prisma.nutritionPlan.create({
      data: {
        userId: user.id,
        weekNumber,
        planData: planData,
      },
    });

    return planData;
  } catch (e) {
    console.error("Failed to generate plan:", e);
    throw new Error("Failed to generate nutrition plan. Please try again.");
  }
}
