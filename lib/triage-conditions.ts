// Condition-aware triage extension.
//
// The hand-tuned triage.ts handles the top obstetric emergencies (RED/YELLOW).
// This file adds catalog-aware enrichment: for any user message we scan the
// 30-condition KB's emergency lines + condition names and surface deep-links
// so the chat can render a "Read more about: [Preeclampsia →]" card next to
// the safety message.
//
// Key idea: we want CHEAP, DETERMINISTIC matching that never overrides the
// triage engine, only enriches it. No regex per emergency line — that would
// be 200+ regexes. Instead we extract distinctive keyword phrases from the
// condition name + emergency list and do a substring scan.

import {
  CONDITIONS,
  type Condition,
  type EmergencyAlert,
  type EmergencySeverity,
} from "./conditions";

export interface ConditionMatch {
  slug: string;
  name: string;
  emoji: string;
  severity: EmergencySeverity;
  matchedLine: string;
  matchedKeyword: string;
}

// Distinctive 2-3 word phrases that, if present in a user message, point
// strongly at a specific condition. We hand-pick these once so we don't
// blow up false positives. Each phrase is lowercased and substring-matched.
//
// Order matters lightly — first match for a (slug, severity) pair wins.
const CONDITION_KEYWORDS: Record<string, string[]> = {
  "period-cramps": ["period pain", "menstrual cramp", "dysmenorrhea"],
  "irregular-periods": ["irregular period", "skipped period", "missed cycle"],
  "pcos": ["pcos", "polycystic", "facial hair", "acne and missed period"],
  "morning-sickness": [
    "morning sickness",
    "pregnancy nausea",
    "vomit pregnancy",
    "hyperemesis",
  ],
  "iron-deficiency-anaemia": [
    "anaemia",
    "anemia",
    "iron deficiency",
    "hemoglobin low",
    "hb low",
    "khoon ki kami",
  ],
  "heavy-bleeding": [
    "heavy bleeding",
    "soaking pad",
    "passing clots",
    "menorrhagia",
  ],
  "missed-period": ["missed period", "late period", "no period this month"],
  "pregnancy-back-pain": ["pregnancy back pain", "back pain pregnant"],
  "gestational-diabetes": [
    "gestational diabetes",
    "gdm",
    "sugar high pregnancy",
  ],
  "uti": ["burning urine", "uti", "urinary infection", "peshab mein jalan"],
  "leucorrhea": ["white discharge", "leucorrhea", "safed paani"],
  "pms": ["pms", "premenstrual"],
  "heartburn": ["heartburn", "acidity pregnancy", "acid reflux"],
  "leg-cramps": ["leg cramp", "calf cramp", "muscle cramp at night"],
  "hair-fall": ["hair fall", "hair loss", "baalon ka jhadna"],
  "thyroid": ["thyroid", "hypothyroid", "hyperthyroid", "tsh high", "tsh low"],
  "migraine": ["migraine", "migrain"],
  "anxiety": ["anxiety attack", "panic attack", "anxious", "ghabrahat"],
  "constipation": ["constipation", "kabz"],
  "skin-issues": ["acne", "pimple", "melasma", "skin darkening"],
  "weight-management": ["weight gain", "obesity", "overweight"],
  "sleep-disorders": ["insomnia", "can't sleep", "neend nahi"],
  "joint-pain": ["joint pain", "knee pain", "arthritis"],
  "post-delivery-recovery": ["postpartum", "post delivery", "after birth"],
  "menopause": ["menopause", "hot flashes", "menopausal"],
  "breast-pain": ["breast pain", "mastalgia", "breast tender"],
  "endometriosis": ["endometriosis", "endo", "painful sex"],
  "fibroids": ["fibroid", "uterine fibroid"],
  "pregnancy-swelling": [
    "swelling face",
    "swelling hand",
    "face swelling",
    "hand swelling",
    "preeclampsia",
    "sudden swelling",
  ],
  "low-bp-dizziness": [
    "low bp",
    "low blood pressure",
    "dizziness",
    "chakkar aana",
    "feeling faint",
  ],
};

// Pre-compute (lowercase keyword → condition) for O(1) lookup.
const KEYWORD_INDEX: { keyword: string; condition: Condition }[] = (() => {
  const out: { keyword: string; condition: Condition }[] = [];
  for (const c of CONDITIONS) {
    const keywords = CONDITION_KEYWORDS[c.slug] ?? [c.name.toLowerCase()];
    for (const k of keywords) {
      out.push({ keyword: k.toLowerCase(), condition: c });
    }
  }
  // Match longer phrases first to avoid "pregnancy" eating "pregnancy nausea".
  out.sort((a, b) => b.keyword.length - a.keyword.length);
  return out;
})();

export function findConditionMatches(text: string): ConditionMatch[] {
  const lower = text.toLowerCase();
  const seen = new Set<string>();
  const matches: ConditionMatch[] = [];

  for (const { keyword, condition } of KEYWORD_INDEX) {
    if (seen.has(condition.slug)) continue;
    if (!lower.includes(keyword)) continue;
    seen.add(condition.slug);

    // Pick the worst-severity emergency line from this condition that
    // shares any keyword with the user message — gives the user the
    // most relevant red-flag callout.
    const ranked = rankEmergencyLines(condition.emergency, lower);
    const top = ranked[0];

    matches.push({
      slug: condition.slug,
      name: condition.name,
      emoji: condition.emoji,
      severity: top?.severity ?? "YELLOW",
      matchedLine: top?.text ?? "",
      matchedKeyword: keyword,
    });
  }

  // Cap to 3 most-relevant — the chat UI can't show more without noise.
  return matches.slice(0, 3);
}

function rankEmergencyLines(
  lines: EmergencyAlert[],
  userTextLower: string,
): EmergencyAlert[] {
  return [...lines].sort((a, b) => {
    const sevA = a.severity === "RED" ? 2 : 1;
    const sevB = b.severity === "RED" ? 2 : 1;
    if (sevA !== sevB) return sevB - sevA;

    const overlapA = scoreOverlap(a.text.toLowerCase(), userTextLower);
    const overlapB = scoreOverlap(b.text.toLowerCase(), userTextLower);
    return overlapB - overlapA;
  });
}

// Tiny lexical overlap score — count of 4+ char tokens shared.
function scoreOverlap(a: string, b: string): number {
  const tokensA = new Set(a.split(/\W+/).filter((t) => t.length >= 4));
  const tokensB = b.split(/\W+/).filter((t) => t.length >= 4);
  let n = 0;
  for (const t of tokensB) if (tokensA.has(t)) n++;
  return n;
}

// Convenience: build a chat-ready "Related conditions" card payload.
export interface RelatedConditionsCard {
  intro: string;
  items: ConditionMatch[];
}

export function buildRelatedConditionsCard(
  text: string,
): RelatedConditionsCard | null {
  const items = findConditionMatches(text);
  if (items.length === 0) return null;
  return {
    intro: items.some((i) => i.severity === "RED")
      ? "Some signs you mentioned may need urgent attention. These guides explain when to seek help:"
      : "Read more about what you described:",
    items,
  };
}

