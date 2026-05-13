// PHI scrubber — strips Indian-PII (Aadhaar, PAN, phone, email, ABHA, voter
// ID, bank acc) from user text before sending to a third-party LLM.
// Adapted from the legacy Keen_AI Python scrubber.
// DPDP Act 2023 § 4 — Purpose Limitation.

interface Rule {
  pattern: RegExp;
  replacement: string;
  label: string;
}

const RULES: Rule[] = [
  // Aadhaar — 12 digits with optional spaces/hyphens
  { pattern: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, replacement: "[AADHAAR_REDACTED]", label: "Aadhaar" },
  // PAN — AAAAA9999A
  { pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, replacement: "[PAN_REDACTED]", label: "PAN" },
  // Indian mobile — +91 / 0 prefix, 10 digits starting 6-9
  { pattern: /(\+91[\s\-]?|0)?[6-9]\d{9}\b/g, replacement: "[PHONE_REDACTED]", label: "Phone" },
  // Email
  { pattern: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g, replacement: "[EMAIL_REDACTED]", label: "Email" },
  // ABHA / Health ID — 14 digits
  { pattern: /\b\d{2}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, replacement: "[ABHA_REDACTED]", label: "ABHA" },
  // Voter ID
  { pattern: /\b[A-Z]{3}\d{7}\b/g, replacement: "[VOTER_REDACTED]", label: "VoterID" },
  // Bank account (preceded by keyword)
  { pattern: /\b(account|acc|a\/c)[\s:]*\d{9,18}\b/gi, replacement: "[BANK_ACC_REDACTED]", label: "BankAcc" },
];

export interface ScrubResult {
  scrubbed: string;
  redactions: { label: string; count: number }[];
  containsPii: boolean;
}

export function scrubPhi(text: string): ScrubResult {
  let scrubbed = text;
  const redactions: { label: string; count: number }[] = [];
  for (const { pattern, replacement, label } of RULES) {
    const matches = scrubbed.match(pattern);
    if (matches && matches.length) {
      redactions.push({ label, count: matches.length });
      scrubbed = scrubbed.replace(pattern, replacement);
    }
  }
  return { scrubbed, redactions, containsPii: redactions.length > 0 };
}

// Lighter pass for scrubbing AI output before showing to user — guards
// against the LLM echoing back any PII it might have learned in context.
export function scrubResponse(text: string): string {
  let out = text;
  out = out.replace(/\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, "[REDACTED]");
  out = out.replace(/(\+91[\s\-]?|0)?[6-9]\d{9}\b/g, "[REDACTED]");
  return out;
}
