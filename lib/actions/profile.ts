"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateProfile(data: {
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    previousPregnancies?: string;
    supplements?: string;
    friedFoods?: string;
    sugaryFoods?: string;
    waterIntake?: string;
    useFortifiedFood?: string;
    supplementFrequency?: string;
    avoidingFoods?: string;
    symptoms?: string;
    smokeAlcohol?: string;
    physicalActivity?: string;
    sleepDuration?: string;
    movementDuration?: string;
    mood?: string;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");
    
    return await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            age: data.age ? parseInt(data.age) : undefined,
            height: data.height ? parseFloat(data.height) : undefined,
            weight: data.weight ? parseFloat(data.weight) : undefined,
            previousPregnancies: data.previousPregnancies ? parseInt(data.previousPregnancies) : undefined,
            supplements: data.supplements,
            friedFoods: data.friedFoods,
            sugaryFoods: data.sugaryFoods,
            waterIntake: data.waterIntake ? parseFloat(data.waterIntake) : undefined,
            useFortifiedFood: data.useFortifiedFood,
            supplementFrequency: data.supplementFrequency,
            avoidingFoods: data.avoidingFoods,
            symptoms: data.symptoms,
            smokeAlcohol: data.smokeAlcohol,
            physicalActivity: data.physicalActivity,
            sleepDuration: data.sleepDuration ? parseFloat(data.sleepDuration) : undefined,
            movementDuration: data.movementDuration ? parseInt(data.movementDuration) : undefined,
            mood: data.mood,
        }
    });
}

export async function deleteAccount() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");
    
    return await prisma.user.delete({
        where: { id: session.user.id }
    });
}
