# keen_ai → v3 Port Checklist

Running scoreboard of every feature in the old app vs its v3 status.
Update as you go. Last refresh: **2026-05-15** (mid-port session).

## Status snapshot

**Local files only — nothing pushed, nothing deployed since 2026-05-14.**
Latest deployed commit on prod: `261987c` (live cycle ring + phase strip).

## Session 2026-05-15 — what shipped (LOCAL ONLY)

| # | Feature | Files |
|---|---|---|
| A | 40-week clinical fetal dataset (Moore & Persaud + ICMR + FOGSI cited every week) | `lib/fetal-weeks.ts` (841 lines) |
| B | Citation system — registry + 3 components | `lib/citations.ts`, `components/citation-badge.tsx` |
| C | PIN lock — scrypt hashed, weak-PIN reject, 2-phase enter→confirm | `lib/actions/pin.ts`, `app/auth/pin/page.tsx` |
| D | Pregnancy week-by-week page (hero + baby-size + dev + nutrition + ANC + warnings + 8-contact schedule + sources) | `app/dashboard/pregnancy/page.tsx` |
| E | Reports server-action paywall fix (discriminated union — fixes prod 500 loop) | `lib/actions/reports.ts`, `app/dashboard/reports/page.tsx` |
| F | BMI calculator full page (Indian-Asian cutoffs, ft/in toggle, save-to-profile, recommended foods) | `app/dashboard/bmi/{page,bmi-client,actions}.tsx` |
| G | `/api/health` uptime endpoint (live DB ping + dependency map) | `app/api/health/route.ts` |
| H | Daily Check-in 4-step modal (replaced old single-step) — meals/supps/water/symptoms + 4-step progress | `components/daily-check-in.tsx`, `lib/actions/checkin.ts` |
| I | Schema: `DailyLog.checkin` JSON column added + `prisma db push` to Neon | `prisma/schema.prisma` |

All type-checked clean. Production build passes.

## Where to pick up next session

**P0 still standing:**
- #4 Language picker (onboarding step 0 needs Hindi/Tamil/Telugu/Bengali/Marathi)

**P1 high-impact next:**
- Weekly Report screen (AI Story + per-nutrient + ASHA escalation)
- Nutrition tracker 4-tab module (Today / Add Meal / Stats / Insights)
- Home dashboard rebuild (mode-switcher + hydration card + mood logger + quick actions grid)
- Cycle detail page Today/Calendar/Analysis tabs
- Settings polish — Local-only mode + Export-my-data + Tracking Mode swap
- Multilingual switch (6 languages, lift LANG constants from old app)
- Absorption Science evergreen card (5 rules, static)
- Trimester warning signs standalone module
- Health Articles content library

**Pre-deploy fixes still pending:**
- None blocking — all current work is type-clean and build-clean.

## How to deploy when user says go

```
cd C:\Users\HP\Downloads\Keen_AI_v3\my-app
git add -A
git commit -m "..."
git push origin main
VERCEL_NO_PLUGIN_INSTALL=1 vercel --prod --yes
```


## P0 — Launch blockers (rural India can't use the app without these)

| # | Feature | Old keen_ai source | v3 status | Plan |
|---|---|---|---|---|
| 1 | Phone OTP login (Twilio) | `frontend/src/features/auth/OTPLogin.jsx` + `api/send-otp.js` + `api/verify-otp.js` | ✅ DONE — hybrid phone/email | Better Auth + Twilio Verify shipped |
| 2 | PIN-screen for app re-entry | `auth/PINScreen.jsx` | ✅ DONE — `lib/actions/pin.ts` + `/auth/pin` page (scrypt hashed, weak-PIN rejection, 2-phase enter→confirm) | Lock-on-resume gate is P1 |
| 3 | Reports server-action paywall bug (prod 500) | — | ✅ DONE — `analyzeReport` returns discriminated `AnalyzeReportResult` (`kind: "analysis" \| "paywall"`); page handles via `onSuccess` not `onError` |
| 4 | Language select on first launch | `auth/LanguageSelect.jsx` | ⚠️ Only landing toggle | Onboarding step 0 → language picker |

## P1 — Important, not strictly blocking (1 week post-launch is fine)

| # | Feature | Old source | v3 status | Plan |
|---|---|---|---|---|
| 5 | Dedicated BMI page | `bmi/BMICalculator.jsx` | ✅ DONE — `/dashboard/bmi` server page + `bmi-client.tsx` UI (Indian-Asian gauge, ft/in toggle, recommended-foods chips, save-back-to-User action) |
| 6 | Dedicated Pregnancy view | `pregnancy/PregnancyView.jsx` + 8-contact ANC | ✅ DONE — `/dashboard/pregnancy` page with hero + baby-size + development + nutrition + ANC card + warning signs + 8-contact schedule + source footer |
| 7 | Dynamic Fetal Card | `pregnancy/DynamicFetalCard.jsx` | ✅ DONE — full 40-week dataset ported verbatim into `lib/fetal-weeks.ts` (FetalWeek type, getPregnancyInfo, getWarningSignsForWeek, getANCSchedule, REMEDIES multilingual) |
| 8 | Emergency escalation UI | `emergency/EmergencyEscalation.jsx` | ⚠️ `lib/safety.ts` logic only | Visible RED-state component |
| 9 | Log-entry FAB | `log-entry/LogEntryOverlay.jsx` + `components/FloatingFAB.jsx` | ❌ | One-tap quick log floating button |
| 10 | Traffic-light triage visual | `components/TrafficLight.jsx` | ❌ | RED/YELLOW/GREEN component |
| 11 | Health check endpoint | `api/health.js` | ✅ DONE — `/api/health` (live DB ping + dependency map for UptimeRobot, no-store cached, returns "configured: 8/8" body) |
| 12 | Citation badge | `components/CitationBadge.jsx` | ✅ DONE — `lib/citations.ts` registry (8 sources: WHO/ICMR/FOGSI/ACOG/IADPSG/Moore&Persaud/NFHS/AIIMS) + `<CitationBadge>` + `<CitationGroup>` + `<SourceFooter>` components |
| 13 | Confetti celebration | `nutrition/ConfettiCelebration.jsx` | ❌ | On hitting daily nutrition target |
| 14 | Full multilingual constants | `constants/language.js` | ⚠️ Landing only | All dashboard pages |
| 15 | Reminders page (separate from schedule) | `reminders/RemindersPage.jsx` | ⚠️ Mixed into schedule | Dedicated page |
| 16 | Consent dashboard | `consent/ConsentDashboard.jsx` | ⚠️ Inline in Settings | Dedicated view of all consents + history |

## ✅ Already at parity or better in v3

- `chat/AIChat` → `dashboard/chat` (v3 has multi-provider failover + rotating starters + better context)
- `blog/Blog` → `app/blog`
- `meals/*` → `dashboard/meals` (+ Indian foods DB at `lib/food-db.ts`)
- `nutrition/*` → `dashboard/nutrition` (+ Care/Pro tiered, daily nutrient focus)
- `period-tracker/PeriodTracker` → `dashboard/cycle` (+ Prisma persistence, predictions)
- `selfcare/SelfCarePage` → `dashboard/selfcare`
- `settings/SettingsScreen` → `dashboard/settings`
- `splash/SplashScreen` → `components/splash`
- `upgrade/UpgradeModal` → `/pricing` (+ real Razorpay live payments)
- `reports/MedicalReports` → `dashboard/reports` (+ AI analysis, tier-gated)
- `home/HomeDashboard` → `dashboard/overview-client` (+ live stats, daily rotation)
- `auth/AgreementScreen` → onboarding step 3
- `auth/ProfileSetup` → onboarding steps 1-2
- `components/BottomNav` → mobile dashboard nav (4 + More sheet)
- Food/water/wellness state → Prisma DailyLog (real DB persistence)

## Build order for this push

1. **Phone OTP login** (P0 #1) — biggest single gap
2. **PIN screen** (P0 #2) — paired with OTP for re-entry
3. **Reports server-action fix** (P0 #3) — bug
4. **Language select first-launch** (P0 #4)
5. Then P1 in order — BMI, Pregnancy view, Emergency UI, FAB, traffic light, health endpoint, citations, confetti, multilingual, reminders, consent dashboard

Run `vercel --prod` once at the end. No mid-session deploys (per user pref).
