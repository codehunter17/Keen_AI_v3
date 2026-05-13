// AI safety pipeline. Every chat message + AI output passes through this.
// Two layers:
//   1. Keyword + regex pre-filter (fast, free, deterministic).
//   2. LLM classifier fallback for ambiguous cases (Groq Llama, cheap).
//
// If the user is asking about an emergency or signaling self-harm, we
// SHORT-CIRCUIT the chat — no AI response is generated. Instead we surface
// emergency contacts + the iCall / Vandrevala helpline numbers (India).

export type SafetyFlag =
  | "OK"
  | "EMERGENCY"        // bleeding, severe pain, suspected miscarriage, etc.
  | "SELF_HARM"        // suicidal ideation, self-injury
  | "OUT_OF_SCOPE"     // non-health unrelated query
  | "MEDICAL_DIAGNOSIS"; // user asking for a definitive diagnosis -> add disclaimer

const EMERGENCY_PATTERNS: RegExp[] = [
  /\bheavy bleeding\b/i,
  /\b(severe|unbearable|extreme)\s+(pain|cramp)/i,
  /\bcan'?t\s+(breathe|move)\b/i,
  /\b(passing out|fainted|unconscious)\b/i,
  /\bchest pain\b/i,
  /\b(seizure|fits)\b/i,
  /\bvision (loss|blurred)\b/i,
  /\bbaby (not|stopped) moving\b/i,
  /\bwater broke\b/i,
  /\bcontractions every (\d+) min/i,
];

const SELF_HARM_PATTERNS: RegExp[] = [
  /\b(kill|end|hurt) myself\b/i,
  /\bsuicide\b/i,
  /\bself[- ]?harm\b/i,
  /\bdon'?t want to live\b/i,
  /\bno reason to live\b/i,
];

const DIAGNOSIS_PATTERNS: RegExp[] = [
  /\bdo I have\s+(pcos|cancer|diabetes|miscarriage)/i,
  /\bam I\s+(pregnant|miscarrying)/i,
  /\bdiagnose\b/i,
];

// ─────────────────────────────────────────────────────────────
// Helpline copy — India-first.
// ─────────────────────────────────────────────────────────────
export const INDIA_EMERGENCY = {
  ambulance: "102",          // free national maternal/ambulance
  general: "112",            // unified emergency
  womensHelpline: "1091",
  childHelpline: "1098",
  iCallMentalHealth: "+91-9152987821",  // iCall, Mon-Sat 8am-10pm
  vandrevalaCrisis: "1860-2662-345",    // Vandrevala 24x7
};

export interface SafetyResult {
  flag: SafetyFlag;
  reason?: string;
  blockResponse: boolean;   // true = do not call LLM, surface our own message
  surfacedMessage?: string;
}

export function preCheck(text: string): SafetyResult {
  if (SELF_HARM_PATTERNS.some((r) => r.test(text))) {
    return {
      flag: "SELF_HARM",
      blockResponse: true,
      surfacedMessage:
        `What you're feeling is real, and you don't have to face it alone. ` +
        `Please call **iCall** at ${INDIA_EMERGENCY.iCallMentalHealth} or ` +
        `**Vandrevala** at ${INDIA_EMERGENCY.vandrevalaCrisis} (24×7, free). ` +
        `If you are in immediate danger, dial **112**.`,
    };
  }

  if (EMERGENCY_PATTERNS.some((r) => r.test(text))) {
    return {
      flag: "EMERGENCY",
      blockResponse: true,
      surfacedMessage:
        `This sounds urgent. Please call your doctor right now, or dial ` +
        `**${INDIA_EMERGENCY.ambulance}** for an ambulance / **${INDIA_EMERGENCY.general}** for emergency. ` +
        `If a partner or family member is nearby, ask them to come to you.`,
    };
  }

  if (DIAGNOSIS_PATTERNS.some((r) => r.test(text))) {
    return {
      flag: "MEDICAL_DIAGNOSIS",
      blockResponse: false,
      reason: "User asked for a diagnosis — extra disclaimer required.",
    };
  }

  return { flag: "OK", blockResponse: false };
}

// Disclaimer suffix appended to every AI response (legal safety net).
export const AI_DISCLAIMER = `\n\n---\n*This is general wellness information from an AI companion, not medical advice. For diagnosis or treatment, please consult a qualified doctor.*`;

export function withDisclaimer(text: string, flag: SafetyFlag = "OK"): string {
  if (flag === "MEDICAL_DIAGNOSIS") {
    return (
      text +
      `\n\n---\n*I cannot diagnose conditions. Please consult a qualified gynecologist for a proper evaluation. ` +
      `In India you can find one via Practo, 1mg, or your local government hospital.*`
    );
  }
  return text + AI_DISCLAIMER;
}
