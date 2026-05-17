# keen_ai → v3 Port Checklist

Status as of **2026-05-16** — full port complete + extras.
**Live URL:** https://nutrimama-v3.vercel.app
**Latest prod commit:** `09e7544`

## ✅ Done — shipped to production

### P0 (launch blockers)
- [x] Phone OTP login (Twilio Verify, hybrid with email/Google)
- [x] PIN re-entry screen (scrypt hashed)
- [x] Reports server-action paywall bug fixed
- [x] Language picker — onboarding + Settings, 6 languages (en/hi/ta/te/bn/mr) with native scripts, greetings translated

### P1 (important polish)
- [x] BMI page (Indian-Asian cutoffs)
- [x] Pregnancy week-by-week view + ANC schedule
- [x] 40-week fetal dataset with citations
- [x] Health endpoint `/api/health` (UptimeRobot ready)
- [x] Citation badges
- [x] FAB (`QuickActionsFab`)
- [x] Weekly Report `/dashboard/weekly` (deterministic rollups + AI story Care+)
- [x] Trimester Warning Signs `/dashboard/pregnancy/warnings`
- [x] Cycle Today/Calendar/Analysis tabs with 2-month color-coded calendar
- [x] Meals 4-tab tracker (Today/Add/Stats/Insights with deterministic nutrient nudges)
- [x] Dashboard Quick-Log panel (mood + hydration + 4 shortcuts)
- [x] Learn page Health Library (9 KB cards + curated articles)
- [x] Absorption Science card (5 ICMR-NIN evergreen rules)

### keen-ai credibility signatures (the "clinical product" identity)
- [x] **ASHA escalation** — `<30%` ICMR-NIN hit rate triggers "Consult ASHA worker" callout in MealsInsights + WeeklyReport with tel:104 + anaemia guide
- [x] **4-phase fertility view** — Menstrual/Follicular/Ovulatory/Luteal nutrition + activity guidance with Indian food specifics (FertilityPhaseCard in Cycle Today)
- [x] **Mode-switcher cards** — 3 lifecycle-aware entry cards on dashboard, primary card auto-sizes based on lifeStage
- [x] **Intercourse tracking** — privacy-first boolean on DailyLog, IntimacyToggle collapsed by default with explicit "never sent to AI" contract

### Big-ticket additions (not in original keen_ai)
- [x] 30-condition medical KB (`lib/conditions.ts`, 384KB)
- [x] `/dashboard/remedies` catalog + 30 SSG detail pages with consent gate
- [x] pgvector RAG over the KB, 150 chunks with real Gemini embeddings, wired into chat
- [x] Catalog-aware triage extension
- [x] Mobile/iOS hardening pass (16 fixes)
- [x] Neon connection drop resilience (retry-once Prisma `$extends`)
- [x] App-wide error boundaries (`app/error.tsx`, `global-error.tsx`, `not-found.tsx`)
- [x] Name greeting helper with phone-as-name + email-as-name rejection
- [x] `lib/display-email.ts` hides synthetic `@phone.nutrimama.local` emails everywhere
- [x] `lib/server/ensure-real-name.ts` backfills phone-as-name on every dashboard load
- [x] Cross-tab session sync (TabSync component + react-query refetchOnWindowFocus)
- [x] Razorpay webhook live with `RAZORPAY_WEBHOOK_SECRET` set
- [x] Discriminated-union `createCheckoutOrder` with real error messages instead of "Server Components render" mask
- [x] PWA install — SW registered on every page (not just /dashboard), custom install bar with iOS fallback, 5 icon sizes + maskable variants

## ⚠️ Non-blocking cosmetic items (defer)

- [ ] Visible Emergency-escalation UI component (logic exists, just not a fancy card)
- [ ] Traffic-light triage chip (RED/YELLOW/GREEN visual)
- [ ] Confetti animation on nutrition target hit
- [ ] Full UI translation of every page body (needs native-speaker review)
- [ ] Dedicated `/dashboard/reminders` page (currently merged into `/dashboard/schedule`)
- [ ] Dedicated Consent dashboard (currently inline in Settings)

## ⚠️ Operational TODOs

- [ ] **Razorpay account activation** — submit website verification form, expect 24–48h approval. Until then use coupon `NUTRIMAMA-FOUNDER-2026` (12mo Pro).
- [ ] **CatBoost ML service** — `AI_BACKEND_URL` empty. Predict returns `null` gracefully.
- [ ] **Google OAuth redirect URI** — add `https://nutrimama-v3.vercel.app/api/auth/callback/google` in Google Cloud Console when you want Google sign-in.
- [ ] **Smoke test RED triage on live prod** — chat "severe headache and blurred vision" should bypass LLM.

## Deploy command (reference)

```powershell
cd C:\Users\HP\Downloads\Keen_AI_v3\my-app
git add -A
git commit -m "..."
git push origin main
$env:VERCEL_NO_PLUGIN_INSTALL=1
vercel --prod --yes
```

GitHub auto-deploy NOT connected. Manual CLI deploys only.
