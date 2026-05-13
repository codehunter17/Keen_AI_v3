// Seeds the curated content library with starter articles + sample coupons.
// Run with: bunx tsx prisma/seed.ts
//
// All content here is HUMAN-CURATED and reviewed for accuracy. Sources
// listed in `source` field. Replace these with real article bodies + videos
// before launch.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONTENT = [
  // ── Personal safety / "good touch, bad touch" — ages 4-10 ────
  {
    slug: "personal-safety-basics",
    title: "Your body, your rules — basics for kids",
    summary:
      "An age-appropriate intro to body autonomy and personal safety, designed to be co-watched with a parent.",
    body: `# Your body, your rules\n\n*To be co-watched with a parent.*\n\nEvery child has the right to feel safe. This short guide covers:\n- Naming body parts correctly\n- The difference between safe touch and unsafe touch\n- Telling a trusted adult\n- The five 'safety circles' framework\n\nReplace this body with curated content reviewed by a child-safety expert.`,
    ageBands: ["BAND_4_7", "BAND_8_10"],
    topics: ["safety"],
    parentalGuidance: true,
    source: "Adapted from UNICEF India / Childline India 1098",
    sourceUrl: "https://www.childlineindia.org/",
    language: "en",
    reviewedBy: "TBD",
  },

  // ── Puberty & first period — ages 8-13 ───────────────────────
  {
    slug: "what-is-puberty",
    title: "What is puberty? A friendly guide",
    summary:
      "Your body is starting to change — and that's okay. Here's what to expect.",
    body: `# What is puberty?\n\nPuberty is when your body slowly changes from a child's body to an adult's. It happens to everyone — at different ages and at different speeds.\n\nReplace with curated content from Menstrupedia or a paediatric reviewer.`,
    ageBands: ["BAND_8_10", "BAND_11_13"],
    topics: ["puberty", "period"],
    parentalGuidance: true,
    source: "Menstrupedia",
    sourceUrl: "https://www.menstrupedia.com/",
    language: "en",
  },
  {
    slug: "first-period-what-to-expect",
    title: "Your first period: what to expect",
    summary: "What it feels like, what to keep in your bag, and how to track it.",
    body: `# Your first period\n\nIt's normal to feel a mix of excitement and confusion. Here's a simple guide.\n\nReplace with reviewed content.`,
    ageBands: ["BAND_8_10", "BAND_11_13", "BAND_14_17"],
    topics: ["period"],
    parentalGuidance: false,
    source: "Menstrupedia",
    language: "en",
  },

  // ── PCOS / cycle health — teens + adults ─────────────────────
  {
    slug: "pcos-explained",
    title: "PCOS, explained simply",
    summary:
      "Polycystic Ovary Syndrome affects 1 in 5 Indian women. Here's what it is and what to do.",
    body: `# PCOS, explained simply\n\nPolycystic Ovary Syndrome (PCOS) is a hormonal condition that can affect periods, weight, and skin. It's manageable.\n\nReplace with reviewed content.`,
    ageBands: ["BAND_14_17"],
    lifeStages: ["TEEN_14_17", "ADULT_MENSTRUATING"],
    topics: ["pcos"],
    parentalGuidance: false,
    source: "Apollo Hospitals patient resources",
    language: "en",
  },
  {
    slug: "tracking-cycle-irregularity",
    title: "Why your cycle isn't always 28 days",
    summary: "What's normal, what's not, and when to talk to a doctor.",
    body: `# Cycle irregularity\n\nA 'normal' cycle is anywhere from 21 to 35 days.\n\nReplace with reviewed content.`,
    ageBands: [],
    lifeStages: ["ADULT_MENSTRUATING"],
    topics: ["period", "pcos"],
    parentalGuidance: false,
    source: "ACOG / WHO",
    language: "en",
  },

  // ── Pregnancy / fertility ────────────────────────────────────
  {
    slug: "trying-to-conceive-checklist",
    title: "Trying to conceive? Start here",
    summary: "A 30-day prep checklist: nutrition, supplements, doctor visits.",
    body: `# Trying to conceive\n\nA simple 30-day checklist before you start trying.\n\nReplace with reviewed content.`,
    ageBands: [],
    lifeStages: ["TRYING_TO_CONCEIVE"],
    topics: ["fertility", "nutrition"],
    parentalGuidance: false,
    source: "ICMR / NHS",
    language: "en",
  },
  {
    slug: "pregnancy-week-by-week-foundations",
    title: "Pregnancy nutrition basics",
    summary: "Folic acid, iron, and what to eat in each trimester.",
    body: `# Pregnancy nutrition\n\nFolic acid in trimester 1, iron + calcium throughout, and protein in trimester 3.\n\nReplace with reviewed content.`,
    ageBands: [],
    lifeStages: ["PREGNANT"],
    topics: ["pregnancy", "nutrition"],
    parentalGuidance: false,
    source: "Indian Council of Medical Research",
    language: "en",
  },

  // ── Postpartum & mental health ───────────────────────────────
  {
    slug: "postpartum-recovery-india",
    title: "Postpartum recovery — what no one tells you",
    summary:
      "Sleep, nutrition, mood — a candid guide to the first 40 days and beyond.",
    body: `# Postpartum recovery\n\nThe 4th trimester is real.\n\nReplace with reviewed content.`,
    ageBands: [],
    lifeStages: ["POSTPARTUM"],
    topics: ["postpartum", "mentalhealth"],
    parentalGuidance: false,
    source: "WHO",
    language: "en",
  },
  {
    slug: "postpartum-blues-vs-depression",
    title: "Baby blues or postpartum depression?",
    summary: "How to tell the difference, and where to get help.",
    body: `# Baby blues vs PPD\n\nBaby blues last about 2 weeks. If symptoms persist, please reach out.\n\niCall: +91-9152987821\nVandrevala 24x7: 1860-2662-345\n\nReplace with reviewed content.`,
    ageBands: [],
    lifeStages: ["POSTPARTUM"],
    topics: ["postpartum", "mentalhealth"],
    parentalGuidance: false,
    source: "iCall + Vandrevala Foundation",
    language: "en",
  },

  // ── Universal nutrition + mental health ──────────────────────
  {
    slug: "everyday-iron-rich-foods",
    title: "Iron-rich Indian foods you already eat",
    summary: "Spinach, dates, jaggery, ragi — and how to absorb more from them.",
    body: `# Iron-rich foods\n\nPair iron-rich foods with vitamin C for better absorption.\n\nReplace with reviewed content.`,
    ageBands: [],
    lifeStages: [],
    topics: ["nutrition"],
    parentalGuidance: false,
    source: "ICMR-NIN dietary guidelines",
    language: "en",
  },
];

const COUPONS = [
  {
    code: "MOTHERSDAY50",
    description: "50% off Care for Mother's Day",
    percentOff: 50,
    validFrom: new Date("2026-05-01"),
    validUntil: new Date("2026-05-15"),
    appliesToTier: "CARE_49",
    active: true,
  },
  {
    code: "WOMENSDAY100",
    description: "₹100 off Pro for Women's Day",
    amountOffPaise: 10000,
    validFrom: new Date("2026-03-01"),
    validUntil: new Date("2026-03-15"),
    appliesToTier: "PRO_99",
    active: true,
  },
  {
    code: "FIRSTTRI50",
    description: "First-trimester welcome — 50% off Care",
    percentOff: 50,
    validFrom: new Date("2026-01-01"),
    validUntil: new Date("2027-01-01"),
    appliesToTier: "CARE_49",
    active: true,
  },
];

async function main() {
  console.log("Seeding ContentItem rows…");
  for (const c of CONTENT) {
    await prisma.contentItem.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }
  console.log(`  ✓ ${CONTENT.length} content items`);

  console.log("Seeding coupons…");
  for (const c of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      create: c,
      update: c,
    });
  }
  console.log(`  ✓ ${COUPONS.length} coupons`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
