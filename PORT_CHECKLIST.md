# keen_ai → v3 Port Checklist

Running scoreboard of every feature in the old app vs its v3 status.
Update as you go. Last refresh: 2026-05-14.

## P0 — Launch blockers (rural India can't use the app without these)

| # | Feature | Old keen_ai source | v3 status | Plan |
|---|---|---|---|---|
| 1 | Phone OTP login (Twilio) | `frontend/src/features/auth/OTPLogin.jsx` + `api/send-otp.js` + `api/verify-otp.js` | ❌ Email-only | Use Better Auth phoneNumber plugin + Twilio Verify |
| 2 | PIN-screen for app re-entry | `auth/PINScreen.jsx` | ❌ | 4/6-digit PIN stored hashed on User table |
| 3 | Reports server-action paywall bug (prod 500) | — | ❌ Still throws | Same discriminated-union fix as nutrition |
| 4 | Language select on first launch | `auth/LanguageSelect.jsx` | ⚠️ Only landing toggle | Onboarding step 0 → language picker |

## P1 — Important, not strictly blocking (1 week post-launch is fine)

| # | Feature | Old source | v3 status | Plan |
|---|---|---|---|---|
| 5 | Dedicated BMI page | `bmi/BMICalculator.jsx` | ⚠️ Logic in `lib/bmi.ts`, no UI | Add `/dashboard/bmi` route |
| 6 | Dedicated Pregnancy view | `pregnancy/PregnancyView.jsx` + 8-contact ANC | ⚠️ Embedded only in dashboard | Add `/dashboard/pregnancy` route |
| 7 | Dynamic Fetal Card | `pregnancy/DynamicFetalCard.jsx` | ❌ | Week-by-week fetal size + milestones |
| 8 | Emergency escalation UI | `emergency/EmergencyEscalation.jsx` | ⚠️ `lib/safety.ts` logic only | Visible RED-state component |
| 9 | Log-entry FAB | `log-entry/LogEntryOverlay.jsx` + `components/FloatingFAB.jsx` | ❌ | One-tap quick log floating button |
| 10 | Traffic-light triage visual | `components/TrafficLight.jsx` | ❌ | RED/YELLOW/GREEN component |
| 11 | Health check endpoint | `api/health.js` | ❌ | `/api/health` for UptimeRobot |
| 12 | Citation badge | `components/CitationBadge.jsx` | ❌ | Source badges on AI replies |
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
