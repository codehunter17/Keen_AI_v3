import { prisma } from "@/lib/prisma";
import { storeMemory } from "./memory";

/**
 * Connects to the remote CatBoost model (hosted on Railway or similar)
 * to get a maternal health risk prediction based on the latest user vitals.
 */
export async function runPredictionAndStoreFact(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  // Map Prisma user fields to the features expected by the Remote CatBoost API
  const features = {
    Age: user.age || 25,
    Height_cm: user.height || 160,
    Weight_kg: user.weight || 60,
    Previous_Pregnancies: user.previousPregnancies || 0,
    Supplements: user.supplements || "None",
    Fried_Foods: user.friedFoods || "Rarely",
    Sugary_Foods: user.sugaryFoods || "Sometimes",
    Water_Intake_L: user.waterIntake || 2.0,
    Use_Fortified_Food: user.useFortifiedFood || "No",
    Supplement_Frequency: user.supplementFrequency || "Daily",
    Avoiding_Foods: user.avoidingFoods || "None",
    Symptoms: user.symptoms || "None",
    Smoke_Alcohol: user.smokeAlcohol || "No",
    Physical_Activity: user.physicalActivity || "Moderate",
    Clean_Water: user.cleanWater || "Yes",
    Food_Access_Difficulty: user.foodAccessDifficulty || "No",
    Sleep_Duration: user.sleepDuration || 8.0,
    Movement_Duration: user.movementDuration || 30,
    Current_Mood: user.mood || "Refreshed",
    Trimester: user.pregnancyWeek
      ? user.pregnancyWeek <= 12
        ? "First"
        : user.pregnancyWeek <= 26
          ? "Second"
          : "Third"
      : "First",
  };

  try {
    // Calling Remote Maternal Risk Predictor

    // Get the API URL from environment variables, defaulting to local if not set
    const API_URL =
      process.env.AI_BACKEND_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8000/predict"
        : "https://finalproject-ai.onrender.com/");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      throw new Error(
        `ML API Error (${response.status}): ${response.statusText}`,
      );
    }

    const prediction = await response.json();

    if (prediction.error) {
      throw new Error(prediction.error);
    }

    const { risk_level, confidence } = prediction;

    // Extract facts as a string for RAG (Memory System)
    const fact = `[ML PREDICTION]: As of ${new Date().toLocaleDateString()}, the remote CatBoost model predicts a ${risk_level} maternal health risk (${(confidence * 100).toFixed(1)}% confidence) based on the latest vitals, mood, and dietary patterns.`;

    // Dump into RAG (Memory system) for Gemini's context
    await storeMemory(userId, fact);

    return { riskLevel: risk_level, confidence, fact };
  } catch {
    return {
      riskLevel: "Medium",
      confidence: 0.5,
      fact: "Prediction fallback due to remote connectivity issues.",
    };
  }
}
