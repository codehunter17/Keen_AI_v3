// Remedies catalogue — index page for all 30 NutriMama conditions.
// Server-rendered shell + small client island for search + category filter.

import { CONDITIONS, type ConditionCategory } from "@/lib/conditions";
import { RemediesListClient } from "./remedies-list-client";
import {
  MedicalContentGate,
  MedicalDisclaimerBanner,
} from "@/components/medical-content-gate";

export const metadata = {
  title: "Remedies — NutriMama",
  description:
    "Gharelu, Ayurvedic, and modern remedy guides for 30 common women's health conditions.",
};

const CATEGORY_LABELS: Record<ConditionCategory, string> = {
  MENSTRUAL: "Menstrual",
  PREGNANCY: "Pregnancy",
  POSTPARTUM: "Postpartum",
  MENOPAUSE: "Menopause",
  PCOS_HORMONAL: "PCOS & Hormonal",
  GENERAL_HEALTH: "General health",
  MENTAL_HEALTH: "Mental health",
  NUTRITION_DEFICIENCY: "Nutrition",
};

export default function RemediesIndexPage() {
  // Trim payload sent to the client — only what the cards need.
  const items = CONDITIONS.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    nameHi: c.nameHi,
    emoji: c.emoji,
    category: c.category,
    categoryLabel: CATEGORY_LABELS[c.category],
    summary: c.summary,
    hasRed: c.emergency.some((e) => e.severity === "RED"),
  }));

  // Stable category order for chips (high-frequency first).
  const orderedCategories: ConditionCategory[] = [
    "MENSTRUAL",
    "PREGNANCY",
    "PCOS_HORMONAL",
    "POSTPARTUM",
    "MENOPAUSE",
    "MENTAL_HEALTH",
    "NUTRITION_DEFICIENCY",
    "GENERAL_HEALTH",
  ];
  const categories = orderedCategories
    .filter((c) => items.some((i) => i.category === c))
    .map((c) => ({ value: c, label: CATEGORY_LABELS[c] }));

  return (
    <MedicalContentGate>
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-5">
        <header className="space-y-2">
          <span className="chip border-primary/30 text-primary">
            Remedies library
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl text-foreground">
            30 conditions, three trusted lenses
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every condition has Gharelu home remedies, Ayurvedic options, and
            modern medical guidance — with red-flag emergency signs and citation
            sources where available.
          </p>
        </header>

        <MedicalDisclaimerBanner />

        <RemediesListClient items={items} categories={categories} />
      </div>
    </MedicalContentGate>
  );
}
