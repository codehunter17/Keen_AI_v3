# Keen — The Autonomous Brain

> Self-evolving AI brain that observes, learns, and upgrades the app it lives in.
> First deployed inside NutriMama. Designed to be pluggable into any host app.

## What Keen is

Keen is **not** a Claude Code plugin. Keen is a production service that runs alongside a host app (NutriMama is the first host) and continuously improves that app — code, UI, schema, ML models, prompts, content — by learning from real users and real domain experts (e.g. doctors).

The host app (NutriMama) talks to its users. Keen makes the host app smarter every night.

## Layout

```
keen/
├── policy.ts          KEEN_FORBIDDEN_PATHS + policy helpers
├── types.ts           Shared types
├── adapter.ts         KeenAdapter interface — contract any host implements
├── anonymize.ts       PII scrubber wrapper around lib/phi-scrubber when available
├── observer/          Module 1 — nightly anonymized signal mining
├── teacher/           Module 2 — doctor case ingestion (higher trust weight)
├── synthesizer/       Module 3 — weekly clustering + opportunity detection
├── proposer/          Module 4 — drafts spec + code diff + risk + rollback
├── executor/          Module 5 — runs after approval, ships via GitHub + Vercel
├── foundry/           Module 6 — ML fine-tuning on HuggingFace
├── knowledge/         Module 7 — pgvector + S3 + structured store
├── distributor/       Module 8 — i18n, SEO, PWA, app-store, referral loops
├── host-nutrimama.ts  NutriMama-specific adapter implementation
└── index.ts           Public exports
```

## Hard rules (enforced at code level)

Keen will not propose, draft, or ship changes that touch:

1. **Payment logic** — Razorpay flows, subscription state, refunds, coupons
2. **Auth** — login, signup, password, sessions, OTP
3. **DPDP consent records** — the legal consent table and its mutations
4. **Emergency triage RED-path** — life-threatening detection + escalation

These are enumerated in `keen/policy.ts` as `KEEN_FORBIDDEN_PATHS`. Both the Proposer and the Executor reject any diff that touches them. Even L4 approval cannot override this. Operator must edit these manually.

## Risk tiers

| Tier | Example | Approval |
| ---- | ------- | -------- |
| L1   | Ingest a doctor case, update vector index, tweak a blog post, add a recipe | Auto — Keen just does it, logs it |
| L2   | UI copy changes, new informational sections, AI prompt tweaks on non-medical flows | Notify + auto-ship after 24h with no objection |
| L3   | New feature, new screen, schema change, content in medical reasoning | WhatsApp + dashboard approve click |
| L4   | ML model swap, anything regulated under DPDP, anything user-visible at scale | WhatsApp passphrase reply |

## Operator identity

The current operator's identity is **hidden from all user-facing surfaces**. It lives only in `KEEN_OPERATOR_EMAIL` env var, read server-side by the `/admin` route. Keen itself never references the operator in any prompt, response, page, or commit message visible to end users.

## Status

Phase 1 — foundation only. Observer module v0 is live (anonymized signal mining + Postgres persistence + hidden `/admin` dashboard). All other modules are stubs waiting for their first build.
