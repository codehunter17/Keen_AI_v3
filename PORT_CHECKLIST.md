# keen_ai → v3 Port Checklist

Status as of **2026-05-16** — most of the port is shipped and live.
Live URL: **https://nutrimama-v3.vercel.app**

## ✅ Done — shipped and deployed to production

### P0 (launch blockers)
- [x] Phone OTP login (Twilio Verify, hybrid with email/Google)
- [x] PIN re-entry screen (scrypt hashed)
- [x] Reports server-action paywall bug fixed
- [x] Language picker — onboarding + Settings, 6 languages (en/hi/ta/te/bn/mr), native scripts, greetings translated

### P1 (important polish)
- [x] BMI page (Indian-Asian cutoffs)
- [x] Pregnancy week-by-week view + ANC schedule
- [x] 40-week fetal dataset with citations
- [x] Health endpoint `/api/health` (UptimeRobot ready)
- [x] Citation badges
- [x] FAB (`QuickActionsFab`)
- [x] Weekly Report `/dashboard/weekly` (rollups + AI story)
- [x] Trimester Warning Signs `/dashboard/pregnancy/warnings`
- [x] Cycle Today/Calendar/Analysis tabs
- [x] Meals 4-tab tracker (Today/Add/Stats/Insights)
- [x] Dashboard Quick-Log panel (mood + hydration + shortcuts)
- [x] Learn page Health Library (9 KB cards)
- [x] Absorption Science card (5 ICMR-NIN rules)

### Big-ticket additions (not in original keen_ai)
- [x] 30-condition medical KB (`lib/conditions.ts`, 384KB)
- [x] `/dashboard/remedies` catalog + 30 SSG detail pages with consent gate
- [x] pgvector RAG over the KB, embedded into chat
- [x] Catalog-aware triage extension
- [x] Mobile/iOS hardening pass (16 fixes)
- [x] Neon connection drop resilience (retry-once Prisma `$extends`)
- [x] App-wide error boundaries (`app/error.tsx`, `global-error.tsx`, `not-found.tsx`)
- [x] Name greeting helper with phone-as-name rejection
- [x] Razorpay webhook live with `RAZORPAY_WEBHOOK_SECRET` set

## ⚠️ Cosmetic / non-blocking — not yet built

These don't block beta launch. Pick up later as polish:

- [ ] Visible Emergency-escalation UI component (logic exists in `lib/safety.ts` — only the fancy card is missing)
- [ ] Traffic-light triage chip (RED/YELLOW/GREEN visual)
- [ ] Confetti animation when nutrition target hit
- [ ] Full UI translation of every page body (greetings already translated; full i18n needs native-speaker review)
- [ ] Dedicated `/dashboard/reminders` page (currently merged into `/dashboard/schedule`)
- [ ] Dedicated Consent dashboard (currently inline in Settings)

## ⚠️ Operational TODOs (not code)

- [ ] **CatBoost ML service** — `AI_BACKEND_URL` empty. Predict returns `null` gracefully. Deploy when ready.
- [ ] **Google OAuth redirect URI** — add `https://nutrimama-v3.vercel.app/api/auth/callback/google` in Google Cloud Console when you want Google sign-in to work.
- [ ] **Smoke test RED triage on live prod** — chat *"severe headache and blurred vision"* should bypass LLM and show helplines.

## Deploy command (reference)

```powershell
cd C:\Users\HP\Downloads\Keen_AI_v3\my-app
git add -A
git commit -m "..."
git push origin main
$env:VERCEL_NO_PLUGIN_INSTALL=1
vercel --prod --yes
```

GitHub auto-deploy is NOT connected (kenekrishna11 Vercel account doesn't have access to codehunter17 GitHub). Manual CLI deploys only.
