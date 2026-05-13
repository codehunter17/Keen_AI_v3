"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function submitOnboarding(data: {
    pregnancyStage: string;
    pregnancyWeek: number;
    age: number;
    height: number;
    weight: number;
    dietaryPref: string;
    regionalPref: string;
    previousPregnancies: number;
    supplements: string;
    friedFoods: string;
    sugaryFoods: string;
    waterIntake: number;
    useFortifiedFood: string;
    supplementFrequency: string;
    avoidingFoods: string;
    symptoms: string;
    smokeAlcohol: string;
    physicalActivity: string;
    cleanWater: string;
    foodAccessDifficulty: string;
    dueDate?: string | Date;
    meals?: { breakfast: string; lunch: string; dinner: string };
    mood?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        throw new Error("Unauthorized");
    }

    // Process data and update user with all new features
    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            pregnancyStage: data.pregnancyStage,
            pregnancyWeek: data.pregnancyWeek,
            age: data.age,
            height: data.height,
            weight: data.weight,
            dietaryPref: data.dietaryPref,
            regionalPref: data.regionalPref,
            previousPregnancies: data.previousPregnancies,
            supplements: data.supplements,
            friedFoods: data.friedFoods,
            sugaryFoods: data.sugaryFoods,
            waterIntake: data.waterIntake,
            useFortifiedFood: data.useFortifiedFood,
            supplementFrequency: data.supplementFrequency,
            avoidingFoods: data.avoidingFoods,
            symptoms: data.symptoms,
            smokeAlcohol: data.smokeAlcohol,
            physicalActivity: data.physicalActivity,
            cleanWater: data.cleanWater,
            foodAccessDifficulty: data.foodAccessDifficulty,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }
    });

    // Create the initial DailyLog based on onboarding
    await prisma.dailyLog.create({
        data: {
            userId: session.user.id,
            meals: data.meals || { breakfast: "", lunch: "", dinner: "" },
            symptoms: { list: [data.symptoms || "None"], sleepQuality: "Good" },
            waterGlasses: Math.round(data.waterIntake * 4) || 0, // Approx conversion to glasses
            otherFluids: {},
            activity: data.physicalActivity || "Moderate",
            mood: data.mood || "😐"
        }
    });

    return { success: true };
}

