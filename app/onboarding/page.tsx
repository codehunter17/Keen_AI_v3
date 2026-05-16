import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingClient, type OnboardingInitial } from "./onboarding-client";

export const metadata = { title: "Onboarding · NutriMama" };

type Step = 0 | 1 | 2 | 3;
type LifeStage = OnboardingInitial["lifeStage"];

// Skip any step the user already completed. DOB is collected exactly once —
// if it's set, step 0 never shows again.
export default async function OnboardingPage() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    select: {
      name: true,
      dob: true,
      languagePref: true,
      lifeStage: true,
      pregnancyWeek: true,
      height: true,
      weight: true,
      dietaryPref: true,
      termsAcceptedAt: true,
      privacyAcceptedAt: true,
      medicalDisclaimerAt: true,
      allowModelTraining: true,
    },
  });
  if (!user) redirect("/auth/sign-in");

  const dobSet = !!user.dob;
  const lifeStageSet = !!user.lifeStage;
  const vitalsSet = user.height != null || user.weight != null || !!user.dietaryPref;
  const consentsSet =
    !!user.termsAcceptedAt && !!user.privacyAcceptedAt && !!user.medicalDisclaimerAt;

  if (dobSet && lifeStageSet && consentsSet) {
    redirect("/dashboard");
  }

  const initialStep: Step = !dobSet
    ? 0
    : !lifeStageSet
      ? 1
      : !vitalsSet
        ? 2
        : 3;

  // Strip phone-shaped names so the field shows empty (not "+91…") and
  // the user is prompted to type their real name once.
  const cleanedName = (() => {
    const raw = (user.name ?? "").trim();
    if (!raw) return "";
    const d = raw.replace(/[+\-\s()]/g, "");
    if (/^\d{7,15}$/.test(d)) return ""; // looks like a phone number
    if (raw.includes("@") && /\.[a-z]{2,}/i.test(raw)) return ""; // looks like an email
    return raw;
  })();

  const initial: OnboardingInitial = {
    name: cleanedName,
    dob: user.dob ? user.dob.toISOString().slice(0, 10) : "",
    language: (user.languagePref === "hi" ? "hi" : "en"),
    lifeStage: (user.lifeStage as LifeStage) ?? null,
    pregnancyWeek: typeof user.pregnancyWeek === "number" ? user.pregnancyWeek : "",
    heightCm: user.height ?? undefined,
    weight: user.weight != null ? String(user.weight) : "",
    diet:
      user.dietaryPref === "VEGAN" || user.dietaryPref === "NON_VEG"
        ? user.dietaryPref
        : "VEGETARIAN",
    consentsAccepted: consentsSet,
    allowTraining: user.allowModelTraining ?? false,
  };

  return <OnboardingClient initial={initial} initialStep={initialStep} />;
}
