// Run: npx tsx prisma/seed-content.ts
// Seeded from keen-ai Blog.jsx — ported + enriched for v3.
// Safe to run multiple times (upsert by slug).

import { config as loadEnv } from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

loadEnv({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL in environment");
}

const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 8_000,
  keepAlive: true,
  allowExitOnIdle: true,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ARTICLES = [
  {
    slug: "iron-rich-foods-pregnancy-periods",
    title: "Top Iron-Rich Foods for Pregnancy & Periods",
    summary: "Iron deficiency is common in Indian women. Here's how to boost your levels naturally with everyday foods like spinach, lentils, and jaggery.",
    body: `Iron is one of the most critical nutrients during pregnancy and menstruation. The ICMR recommends 35 mg/day during pregnancy.

## Best Iron-Rich Foods

| Food | Iron (per 100g) |
|------|----------------|
| Spinach (palak) | 3.6 mg |
| Masoor dal | 7.6 mg |
| Jaggery (gud) | 11 mg |
| Drumstick leaves (moringa) | 7 mg |
| Sesame seeds (til) | 14.5 mg |
| Rajma (kidney beans) | 8.2 mg |

## Absorption Tips

Always pair iron-rich foods with **Vitamin C** (lemon, amla, tomatoes) to boost absorption by up to 3×. Avoid tea/coffee immediately after meals as tannins block iron absorption.

## Signs of Deficiency
- Fatigue and weakness
- Pale skin, lips, nails
- Shortness of breath
- Brittle nails and hair loss

## Sample Day Plan

**Breakfast:** Ragi dosa + sambar + amla juice  
**Lunch:** Rajma rice + palak sabji + lemon salad  
**Snack:** Til chikki  
**Dinner:** Dal with jaggery sweet + roti`,
    videoUrl: null,
    instagramUrl: null, // placeholder in Blog.jsx — skipping
    thumbnailUrl: null,
    topics: ["nutrition", "period", "pregnancy"],
    lifeStages: ["PREGNANT", "TRYING_TO_CONCEIVE", "ADULT_MENSTRUATING"],
    ageBands: [],
    source: "ICMR-NIN, 2020",
    readTimeMin: 5,
    isPublished: true,
    isUserSubmitted: false,
  },
  {
    slug: "managing-anxiety-during-pregnancy",
    title: "Managing Anxiety During Pregnancy",
    summary: "Up to 20% of pregnant women experience anxiety. Simple breathwork and mindfulness techniques can help calm your nervous system naturally.",
    body: `Pregnancy brings joy but also uncertainty. Hormonal changes can intensify anxiety, especially in the first and third trimesters.

## 4-7-8 Breathing Technique

1. Inhale through nose for **4 seconds**
2. Hold breath for **7 seconds**
3. Exhale through mouth for **8 seconds**

Repeat 3–4 times. This activates the parasympathetic nervous system.

## Other Helpful Practices

- 10-minute morning walks in natural light
- Journaling your thoughts before bed
- Talking to your partner or a trusted friend
- Prenatal yoga (safe poses after 12 weeks)
- 5-4-3-2-1 grounding: 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste

## When to Seek Help

If anxiety interferes with sleep or daily activities for more than **2 weeks**, please speak with your OB-GYN. You are not alone — support is available.

**Indian Helplines:**  
iCall (TISS): 9152987821  
Vandrevala Foundation: 1860-2662-345 (24/7)`,
    videoUrl: null,
    instagramUrl: null,
    thumbnailUrl: null,
    topics: ["mentalhealth", "pregnancy"],
    lifeStages: ["PREGNANT", "POSTPARTUM"],
    ageBands: [],
    source: "NIMH, Mayo Clinic",
    readTimeMin: 4,
    isPublished: true,
    isUserSubmitted: false,
  },
  {
    slug: "understanding-menstrual-cycle-phases",
    title: "Understanding Your Menstrual Cycle Phases",
    summary: "Your cycle has 4 phases, each with unique hormonal patterns. Eating and exercising in sync with them can dramatically improve how you feel.",
    body: `Your menstrual cycle is a vital sign of health. Understanding its 4 phases helps you optimize energy, nutrition, and exercise.

## Phase 1: Menstrual (Days 1–5)

Estrogen and progesterone are low. Rest is essential. Focus on iron-rich foods. Light yoga or walking is fine.

## Phase 2: Follicular (Days 6–12)

Estrogen rises. Energy increases. Great for high-intensity workouts and creative tasks. Eat fresh fruits and vegetables.

## Phase 3: Ovulation (Days 13–17)

Peak energy and confidence. Ideal for social activities and demanding workouts. Zinc-rich foods support ovulation.

## Phase 4: Luteal (Days 18–28)

Progesterone rises. Cravings increase — especially for magnesium (dark chocolate, nuts). Prefer moderate exercise like swimming or yoga. Self-care is most important here.

## Tracking Tips

Log your period start date, energy (1–5), mood, and symptoms daily for 3 months. Patterns become clear and actionable.`,
    videoUrl: null,
    instagramUrl: null,
    thumbnailUrl: null,
    topics: ["period", "pcos"],
    lifeStages: ["ADULT_MENSTRUATING", "TRYING_TO_CONCEIVE", "TEEN_14_17"],
    ageBands: ["BAND_14_17"],
    source: "ACOG, Menstrupedia",
    readTimeMin: 6,
    isPublished: true,
    isUserSubmitted: false,
  },
  {
    slug: "fetal-development-week-by-week",
    title: "Week-by-Week Fetal Development Guide",
    summary: "From a tiny cluster of cells to a fully formed baby — here's what's happening inside you at every stage of pregnancy.",
    body: `## First Trimester (Weeks 1–12)

- **Week 6:** Heart starts beating at 160 bpm!
- **Week 8:** All major organs begin forming. Baby is the size of a raspberry.
- **Week 10:** Tiny fingerprints begin forming.
- **Week 12:** Baby can make fists. Risk of miscarriage drops significantly.

## Second Trimester (Weeks 13–26)

- **Week 16:** Baby can hear your voice. Start talking and singing!
- **Week 20:** The big anatomy scan. Baby is ~25 cm long.
- **Week 24:** Viability milestone — lungs begin producing surfactant.

## Third Trimester (Weeks 27–40)

- **Week 28:** Baby opens and closes eyes, has a sleep cycle.
- **Week 32:** Rapid brain development. Baby gains ~200 g/week.
- **Week 36:** Baby drops into pelvis position.
- **Week 40:** Full term! Average Indian baby weighs 2.7–3.2 kg.

## Key Scans in India

1. Dating scan: 8–12 weeks
2. NT scan: 11–14 weeks
3. Anomaly scan: 18–22 weeks
4. Growth scan: 28–32 weeks
5. Term scan: 36–38 weeks`,
    videoUrl: null,
    instagramUrl: null,
    thumbnailUrl: null,
    topics: ["pregnancy"],
    lifeStages: ["PREGNANT"],
    ageBands: [],
    source: "WHO, FOGSI",
    readTimeMin: 7,
    isPublished: true,
    isUserSubmitted: false,
  },
  {
    slug: "essential-supplements-pregnancy",
    title: "Essential Supplements During Pregnancy",
    summary: "Folic acid, iron, calcium, and Vitamin D are non-negotiable. Here's what to take, when, and why — with Indian context.",
    body: `Supplements fill the gap between diet and nutritional needs during pregnancy.

## Must-Have Supplements

🟢 **Folic Acid (400–800 mcg):** Start 3 months before conception. Prevents neural tube defects. Take in the morning.

🔴 **Iron (60 mg elemental):** Essential from 2nd trimester. Take on empty stomach with Vitamin C. Avoid with calcium.

🟡 **Calcium (500 mg × 2 daily):** After 5th month. Take separately from iron. Dairy + supplements combined.

☀️ **Vitamin D (600–2000 IU):** Most Indian women are deficient. Required for calcium absorption.

🐟 **Omega-3 / DHA (200 mg):** Brain development in 3rd trimester. Fish oil or algae-based (for vegetarians).

## Usually Not Needed

- Extra Vitamin A (risk of toxicity at high doses)
- Herbal supplements without doctor approval

**Important:** Always consult your OB-GYN before starting any supplement. Never self-prescribe.`,
    videoUrl: null,
    instagramUrl: null,
    thumbnailUrl: null,
    topics: ["nutrition", "pregnancy"],
    lifeStages: ["PREGNANT", "TRYING_TO_CONCEIVE"],
    ageBands: [],
    source: "ICMR-NIN 2020, WHO",
    readTimeMin: 5,
    isPublished: true,
    isUserSubmitted: false,
  },
  {
    slug: "postpartum-recovery-first-40-days",
    title: "Postpartum Recovery: The First 40 Days",
    summary: "The first 40 days after birth are crucial for healing. Discover the traditional Indian approach to postpartum nutrition and rest.",
    body: `The postpartum period, often called "Jaapa" in India, is a time of intense physical recovery and emotional adjustment.

## Key Focus Areas for Recovery

- **Rest:** Your body needs sleep to heal tissues and regulate hormones. Sleep when the baby sleeps!
- **Hydration:** Aim for 3–4 litres of water daily, especially if breastfeeding. Warm water with ajwain (carom seeds) or jeera is excellent for digestion.
- **Nutrition:** Focus on warm, easily digestible, and nutrient-dense foods.

## Healing Foods to Include

🟢 **Panjiri & Gond Laddoos:** Made with ghee, edible gum, and nuts. Provide dense energy, aid tissue repair, and support lactation.

🟢 **Makhana (Fox Nuts):** Light, crunchy, and extremely high in calcium and protein.

🟢 **Moong Dal:** The easiest lentil to digest, packed with protein for healing.

🟢 **Daliya (Broken Wheat):** High fibre to prevent postpartum constipation.

## What to Avoid

Limit excessively spicy, deep-fried, or gas-producing foods (like cabbage or heavy beans) in the first 2–3 weeks, as your digestive system is temporarily sluggish.

## Emotional Recovery

Baby blues (tearfulness, mood swings) in the first 2 weeks are very common. **Postpartum depression** is different — it's persistent, intense, and needs professional support.

**Warning signs:** Feelings of hopelessness beyond 2 weeks, inability to bond with baby, thoughts of self-harm. Call your doctor immediately.

Remember, it took 9 months to grow a baby. Give yourself grace and time to heal.`,
    // Real links from Blog.jsx post #6:
    videoUrl: null, // "https://youtu.be/YOUR_YOUTUBE_ID" is a placeholder — skip
    instagramUrl: "https://www.instagram.com/nutrimama24x7/reel/DOJ3NGWk-_3/", // REAL link ✓
    thumbnailUrl: null,
    topics: ["postpartum", "nutrition", "mentalhealth"],
    lifeStages: ["POSTPARTUM"],
    ageBands: [],
    source: "RCOG, ACOG, FOGSI",
    readTimeMin: 5,
    isPublished: true,
    isUserSubmitted: false,
  },
  {
    slug: "good-touch-bad-touch-parent-guide",
    title: "Good Touch / Bad Touch: A Parent's Guide",
    summary: "Age-appropriate body safety education for children 4–12. Read together with your child.",
    body: `## Teaching Body Safety: A Conversation Starter

This guide is for parents and caregivers to read together with their child.

## Key Concepts to Teach

**1. Body Autonomy**  
"Your body belongs to you. No one has the right to touch your private parts, and you have the right to say NO to any touch that feels wrong."

**2. Private Parts**  
Explain that private parts are those covered by a swimsuit. Use correct anatomical terms — children who know the right names are better able to report abuse.

**3. Good Touch vs. Bad Touch**

| Good Touch | Bad Touch |
|-----------|-----------|
| A hug from mummy/daddy when you are sad | Any touch on private parts that isn't medical |
| A doctor examining you (with parent present) | Touches that hurt or feel wrong |
| A high-five from a friend | When someone asks you to keep a touch secret |

**4. The "No, Go, Tell" Rule**  
- **No** — It is always okay to say no  
- **Go** — Move away from the situation  
- **Tell** — Tell a trusted adult immediately

**5. Safe Adults**  
Help your child identify 3–5 safe adults they can tell if something happens.

## Conversation Tips for Parents

- Use calm, matter-of-fact language — not fear-based
- Normalise asking questions
- Praise them every time they speak up about something uncomfortable
- Never shame them for questions about their body

The goal is confidence, not fear. Children who understand their rights are safer.`,
    videoUrl: null,
    instagramUrl: null,
    thumbnailUrl: null,
    topics: ["safety"],
    lifeStages: ["CHILD_4_7", "CHILD_8_10"],
    ageBands: ["BAND_4_7", "BAND_8_10"],
    parentalGuidance: true,
    source: "UNICEF, POCSO Act 2012",
    readTimeMin: 7,
    isPublished: true,
    isUserSubmitted: false,
  },
];

async function main() {
  console.log("Seeding content items from Blog.jsx...");
  for (const article of ARTICLES) {
    const { slug, parentalGuidance, instagramUrl, ...rest } = article as any;
    await (prisma.contentItem as any).upsert({
      where: { slug },
      update: {
        ...rest,
        instagramUrl: instagramUrl ?? null,
        parentalGuidance: parentalGuidance ?? false,
        updatedAt: new Date(),
      },
      create: {
        slug,
        ...rest,
        instagramUrl: instagramUrl ?? null,
        parentalGuidance: parentalGuidance ?? false,
      },
    });
    console.log(`  ✓ ${slug}`);
  }
  console.log(`\nDone! Seeded ${ARTICLES.length} articles.`);
  console.log("Real Instagram link on: postpartum-recovery-first-40-days");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

// NOTE (Prisma 7): Always initialize PrismaClient with the adapter from
// prisma.config.ts rather than bare `new PrismaClient()`.
// Bare constructor throws at runtime in Prisma 7 adapter mode.
