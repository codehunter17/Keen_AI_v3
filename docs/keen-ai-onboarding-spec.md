# keen-ai-two.vercel.app — Onboarding Flow Reference

Captured 2026-05-15 from screenshots provided by user. This is the
**target visual + UX** the v3 onboarding should mirror.

## Global design language

- **Top hero band**: warm rose/coral gradient background (full-bleed) with
  decorative leaf icons in the corners.
- **Hero content**: circular badge (~80px) containing a step-relevant emoji
  on a soft cream/white background, then a Fraunces-style serif title in
  white, then "Step N of 6" subtitle, then a thin progress bar with 6
  segment dots (active segment is a thick rounded white bar; inactive are
  small dots).
- **Body**: dark purple/aubergine background (#2A1A2A-ish), all controls
  use pill-shaped buttons. Active state = solid coral fill + white text.
  Inactive state = transparent fill + thin grey border + muted text.
- **Sticky bottom bar**: ← Back (ghost dark pill) + Continue → (coral
  filled pill, disabled state when required fields empty).
- **Optional step indicator**: small "All fields on this step are optional"
  caption under the Continue button when the step is skippable.

## Step 1/6 — "What brings you here?"

Hero emoji: 👋 (waving hand)

**One-of-three radio cards** (full-width, ~80px tall, rounded-2xl):

| Card | Icon (left, in colored circle) | Title | Subtitle |
|---|---|---|---|
| Tracking Periods (default selected) | 📅 calendar on coral background | Tracking Periods | Predict cycles, track symptoms & hormonal health |
| Pregnant | 🤰 figure on purple background | Pregnant | Week-by-week guidance, nutrition & baby milestones |
| General Wellness | 💚 heart on emerald background | General Wellness | Overall health, nutrition advice & wellness tips |

Selection indicator: small radio dot on the right (coral filled when
selected, white-outline when not).

Continue button: coral pill, full width.

## Step 2/6 — "Tell us about yourself"

Hero emoji: 🌸

**2x2 grid of input fields** (label above, dark input below, all required
look but actually only name+age are required):

| Field | Type | Placeholder |
|---|---|---|
| YOUR NAME | text | First name |
| YOUR AGE | number | 25 |
| HEIGHT (CM) | number | 160 |
| WEIGHT (KG) | number | 55 |

Bottom: ← Back · Continue → (Continue disabled until Name + Age filled).

## Step 3/6 — "Your health details"

Hero emoji: 📅 (calendar)

- **WHEN DID YOUR LAST PERIOD START?** — single date input `dd-mm-yyyy`
- **AVERAGE CYCLE LENGTH (DAYS)** with subtitle "(average days)"
  - Row of pill buttons: 21d / 24d / 26d / **28d (default)** / 30d / 32d / 35d
  - Plus a free-text number input below (defaults to 28) so users can fine-tune

## Step 4/6 — "Your lifestyle"

Hero emoji: 🥗 (salad bowl)

**Dietary preference** — 4 pills in a row:
- Vegetarian (default selected, coral filled)
- Vegan
- Non-vegetarian
- Eggetarian

**Physical activity level** — 4 pills with emoji prefixes:
- 🛋️ Sedentary
- 🚶 Light (walks) — default selected
- 🧘 Moderate (yoga/gym)
- 🏃 Active

**Regional cuisine preference** — dropdown: defaults to "North Indian".
Other options likely: South Indian, East Indian, West Indian, Pan Indian.

**Do you smoke or drink alcohol?** — 2 large pill buttons full-width split:
- 🚫 No (default selected, green fill)
- ⚠️ Yes (red fill when selected)

Bottom caption: "All fields on this step are optional"

## Step 5/6 — "How are you doing?"

Hero emoji: 🌙 (crescent moon)

**Stress level** — 3 pills:
- 😟 Low
- 😐 Medium
- 😰 High

**Sleep quality** — 4 pills:
- 😴 Poor
- 😪 Fair
- 😊 Good
- ⭐ Excellent

**Daily water intake** — 3 pills:
- 🥤 Less than 1L
- 💧 1–2 Litres
- 🧊 2+ Litres

**Health goals (tap all that apply)** — multi-select grid of pills:
- 🏋️ Manage weight
- 💪 Build strength
- 😌 Reduce stress
- 😴 Better sleep
- 🍎 Eat healthier
- 🩺 Manage condition
- 🤰 Healthy pregnancy
- 🌿 More energy

## Step 6/6 — (not screenshot but inferred — typically Consents)

Likely the DPDP consents screen — terms, privacy, medical disclaimer
checkboxes + final "Enter the app" CTA.

## v3 mapping notes

Current v3 onboarding has 4 steps. To match this we'd need:

| keen-ai step | v3 status | Action |
|---|---|---|
| 1. What brings you here | ❌ Missing | Add primary-goal selector |
| 2. About yourself (name/age/h/w) | ⚠️ Has h/w but not name/age input on this step | Add (name from auth signup is fine; age derives from DOB) |
| 3. Health details (last period + cycle length) | ⚠️ Missing — no cycle length input | Add |
| 4. Lifestyle (diet/activity/regional/smoke) | ⚠️ Has diet, missing activity/regional/smoke | Add |
| 5. How are you doing (stress/sleep/water/goals) | ❌ Missing | Add |
| 6. Consents (DPDP) | ✅ Step 3 in v3 | Reuse |

When porting: keep v3's life-stage step (it's richer than keen-ai's
3-option goal) but ALSO add the cycle-length + lifestyle questions
inline so we have richer data for the AI.

## Source images

Original screenshots from keen-ai-two.vercel.app preserved in the user's
download cache (manually save from chat if needed). This spec captures
all visible UX so we can rebuild without the images.

---

# PIN setup screen (post-onboarding, pre-dashboard)

**Hero:** large coral lock icon with red glow halo.
**Title:** "Set Your PIN" (white serif, large)
**Subtitle:** "Set a 4-digit PIN to lock your app"
**Step indicator:** 2-segment progress bar (currently first segment active in coral)

**4 empty dots** in a row showing how many digits entered (0/4 fill).

**Numeric keypad** (3×4 grid):
- Row 1: 1, 2 ABC, 3 DEF
- Row 2: 4 GHI, 5 JKL, 6 MNO
- Row 3: 7 PQRS, 8 TUV, 9 WXYZ
- Row 4: (empty), 0, ⌫ backspace

Each key is a rounded-square dark button with the number in white serif,
sub-label letters below in tiny grey.

**Skip option:** "Skip for now" link below keypad
**Brand footer:** "NUTRIMAMA" wordmark

After entering 4 digits, auto-advances to confirm screen (2nd segment).
On match → enabled. On mismatch → reset to step 1.

---

# Home dashboard (post-login, "Today" tab)

Full screen sections, top to bottom, each in a rounded card.

## 1. Greeting hero card (coral gradient)
- "Good morning, kunti 👋" (Fraunces, large)
- "Let's take care of you today!" (smaller, white-translucent)
- Date "Friday, 15 May"
- Bell icon (top-right) with red notification dot
- **3 chips** below: Cycle, Nutrition, Pregnancy (white outlined pills with emoji)

## 2. Mode switcher
Three pill buttons full-width: Cycle (selected, coral fill) / Nutrition / Pregnancy.
Tapping switches which detail card shows below.

## 3. Cycle ring card (when Cycle mode selected)
Pink-gradient card containing a large half-arc ring (top half + small bottom marker).
- Big "12" + "days until your period" centered inside
- Subtitle "Day 17 of 28"
- Below ring: "Fertile Window" coral pill, then small caption "High energy · Best days to exercise & conceive"
- 3-up stats row at bottom: **5d Period avg** / **28d Cycle avg** / **D17 Today**

(Floating action button bottom-right: coral "+" edit pencil icon for quick log.)

## 4. Quick stat chips row
Three small cards in a row:
- **Day 17 of 28** (coral border, highlighted)
- **Folate · Focus today** (cream)
- **Fertility · Window open** (cream)

## 5. Hydration tracker card (blue)
- Water-drop icon
- "Hydration" title
- "0 of 8 glasses" (caption)
- Progress bar (empty)
- Right side: large `+` and `-` buttons stacked

## 6. BMI strip card (green)
- Circular "20.6 BMI" badge on left
- "Healthy" title (green)
- "Healthy: 18.5–22.9" subtitle
- Progress bar showing where they fall
- Right arrow to drill in

## 7. Nutrition card (cream)
- "Nutrition" header with leaf icon, right link "Tap to log meals"
- "0 kcal" / "of 1900 kcal" / "0%" (3 columns)
- Progress bar
- 3-up row: Iron 0mg / Calcium 0mg / Protein 0g (each a tiny progress bar)
- CTA below: "🌿 Log your meals to track iron, calcium & protein →"

## 8. Mood logger card (cream)
- Title: "How are you feeling today?"
- Subtitle: "Log your mood to track patterns"
- 5 emoji pills: 😊 Great / 😌 Calm / 😔 Low / 😣 Irritable / 😴 Tired

## 9. Partner Mode banner (white pill row)
- ❤️ "Partner Mode · Share cycle alerts with your partner"
- "Share" button (dark pill)
- ✕ close button

## 10. Personalized Insights card (purple gradient)
- "⚡ PERSONALIZED INSIGHTS" label
- Quoted AI insight: *"You're behind on hydration today. Aim for 8 glasses. Add lemon or mint to make it more appealing."*
- Two CTAs side-by-side: 📌 "Hydration priority today" / "Ask NutriMama AI →"

## 11. Member status card (white)
- "K" avatar in coral box
- "kunti 👋" name + "NUTRIMAMA MEMBER" subtitle
- XP progress bar
- "0 XP · 500 to Gold" caption

## 12. Vitals trio (3 cards row)
- 🌙 **RESTFUL SLEEP** · 8h · (purple progress bar)
- 💚 **EMOTIONAL BALANCE** · Steady · (red progress bar)
- 🚶 **GENTLE MOVEMENT** · 30 min · (green progress bar)

## 13. Quick Actions grid (2 columns of pastel cards)
- 📅 **Log Today** — Period, symptoms, mood (coral bg)
- 🤖 **Ask AI** — Personalized advice (lavender bg)
- 💧 **Water** — Track hydration (sky-blue bg)
- 🥗 **AI Meal Plan** — 7-day personalized (mint bg)
- 🍱 **Meals** — Track nutrition (cream bg)
- ⚖️ **BMI** — Check your range (lilac bg)
- 📋 **Reports** — AI-analyzed reports (peach bg)
- 📅 **Calendar** — Appointments & scans (lavender bg)
- 📖 **Articles** — Health & pregnancy (mint bg)
- 📅 **Cycle** — View full cycle (cream bg)
- ⚙️ **Settings** — (mint bg, half-row)

## 14. Bottom nav (5 tabs)
**TODAY** (home) · **CALENDAR** · **SELF CARE** · **ANALYSIS** · **SETTINGS**
Active tab highlighted in coral, inactive in muted grey.

## Floating Action Button (FAB)
Coral circle with pencil-edit icon, bottom-right. Opens a quick-log overlay
(meal, mood, water, symptom).

---

# v3 mapping for home dashboard

| keen-ai section | v3 status | Action |
|---|---|---|
| Greeting hero with mode switch | ⚠️ Have welcome header but no Cycle/Nutrition/Pregnancy switcher | Add toggle |
| Cycle ring | ✅ Have it (LiveCycleRing) but on /cycle, not /dashboard | Add compact version on /dashboard (or use CyclePhaseStrip — already added) |
| Hydration card | ⚠️ Wellness page has water tracking | Surface on home |
| BMI strip | ❌ No UI yet (logic only) | Add card |
| Nutrition kcal/macros | ⚠️ Partial | Add iron/calcium/protein chip strip |
| Mood logger (5 emoji pills) | ⚠️ Have DailyLog.mood field | Add UI |
| Partner Mode banner | ❌ | Add (dismissible, links to invite) |
| Personalized Insights AI card | ⚠️ Have "Today's Focus" but copy is static — needs to be AI-generated daily | Wire to LLM with daily caching |
| Member status / XP | ❌ | Add gamification layer (gold tiers later) |
| Vitals trio | ✅ Have METRICS array | Already done |
| Quick Actions grid | ❌ | Add 11-card pastel grid |
| Bottom nav (5 tabs) | ⚠️ Have 4 + More sheet | Could rebalance to match: TODAY / CALENDAR / SELF CARE / ANALYSIS / SETTINGS |
| FAB quick-log | ❌ | P1 #9 in checklist |

---

# Nutrition mode card (when "Nutrition" tab selected in mode-switcher)

Replaces the cycle ring card. Theme: green gradient, leaf imagery.

**Label:** "FERTILE PHASE · NUTRITION" (small green caps)
**Title:** "Folate & Antioxidants" (Fraunces, green, big)
**Subtitle:** "Folate boosts egg quality during your fertile window."

(Title + subtitle change based on current cycle phase — Menstrual would say
"Iron & Recovery", Follicular would say "Energy & Growth", Luteal would
say "Magnesium & Mood", etc.)

**3 nutrient progress bars** stacked, each:
- Coloured dot icon (left)
- Nutrient name + target (e.g. "Folate · 400mcg")
- Percent achieved (right)
- Full-width progress bar tinted to the nutrient colour
- "Best sources: <comma list>" caption

Example for fertile phase:
- 🟢 Folate · 400mcg · 55% · sources: Broccoli, Eggs, Spinach
- 🟡 Zinc · 8mg · 70% · sources: Pumpkin seeds, Chickpeas
- 🟣 Vitamin E · 15mg · 50% · sources: Almonds, Sunflower seeds

**EAT TODAY section:**
- "🍽 EAT TODAY" header
- Pill row of foods with emojis: 🥦 Broccoli, 🥚 Eggs, 🎃 Pumpkin, 🥜 Almonds

**Tip strip (cream/coral bg) at the bottom:**
- "💡 Green leafy veggies at every meal — your eggs will thank you!"
- Small `[ICMR ICMR-NIN RDA…]` citation badge underneath (links to the
  ICMR-NIN 2020 source — same kind of thing v3 needs for CitationBadge)

---

# BMI Calculator screen (full page)

Reached via Quick Actions → BMI tile.

**Hero (green gradient):**
- ⬅ back chevron
- ⚖ icon
- Title: "BMI Calculator"
- Subtitle: "Indian Asian-specific categories"
  *(important — uses ICMR cutoffs, not WHO defaults)*

**Input card:**
- "HEIGHT UNIT" segmented toggle: **cm** (selected, green) / **ft & in**
- 2 inputs side-by-side:
  - YOUR HEIGHT (placeholder 165)
  - WEIGHT (KG) (placeholder 56)

**Result card:**
- "YOUR BMI" label
- Big green number: 20.6
- "kg/m²" subtitle
- Top-right pill: **"Healthy · 18.5 – 22.9"** (green)
- Horizontal colour-band gauge:
  - 12 → 18.5: amber (underweight)
  - 18.5 → 23: green (healthy — Indian Asian range)
  - 23 → 25: amber (overweight)
  - 25 → 30: orange (obese I)
  - 30 → 40: red (obese II)
  - Slider thumb at user's position
- "Ideal weight range for your height: **50.4 – 62.3 kg**" (in a cream sub-box)

**"WHAT THIS MEANS" section:**
- Personalised explanation paragraph based on category
- "✅ Recommended foods" header
- Pill row: Varied dal & vegetables / Whole-grain rotis / Fruits daily / …

**v3 status:** Logic exists (`lib/bmi.ts` with Indian cutoffs). UI doesn't.
This is P1 #5 in the port checklist.

---

# Daily Check-in modal (4-step flow)

Triggered from the home dashboard (probably the FAB or a "✓ Check in today"
nudge). Sits as an overlay sheet over the home view. 4 steps with progress
dots at top-right (coloured pills per step: current = coral, completed =
green, upcoming = grey).

## Step 1/4 — Meals plan

**Header:** "Daily Check-in" · 1-of-4 progress (▰▱▱▱)
**Hero:** 🌸 (pink flower emoji on coloured circle)
**Greeting:** "Good morning, kunti! 🌟"
**Subtitle:** "Nutrition now shapes your future health"

**Today's Focus block** (coral text):
- "🎯 Reproductive Health 🌸 — Today's Focus"
- Bulleted list:
  - Iron for monthly replenishment
  - Folate — essential if planning pregnancy
  - Calcium for long-term bone health

(Focus topic + bullets change based on cycle phase — Menstrual day would
focus on iron + recovery, Luteal on magnesium + mood, etc.)

**Question:** "🥣 How many meals are you planning today?"
- 5 pill buttons in a row: 2 / 3 / 4 (selected, coral) / 5 / 6
- "✅ Good plan for the day" confirmation chip (green)

**Footer:** Next → (coral full-width) · "Skip for today" link below

## Step 2/4 — Supplements

**Progress:** ▰▰▱▱ (1 green + 1 coral + 2 grey)
**Question:** "💊 Any supplements today?"
**Subtitle:** "Supplements help fill nutritional gaps. Be honest — it helps your analysis."

**Multi-select pill grid:**
- 🔴 Iron
- 🟢 Folic Acid
- 🟠 Calcium
- 🟡 Multivitamin
- ❌ None today (mutually exclusive — clears the others when tapped)

**Footer:** ← Back · Next → (both full-width row)

## Step 3/4 — Water target

**Progress:** ▰▰▰▱ (2 green + 1 coral + 1 grey)
**Header:** "💧 Water goal for today"
**Subtitle:** "Water is essential for iron and folate absorption. Set your target."

**Slider:**
- Label "Target water today" left · "2L" big right
- Horizontal slider 0.5 → 4 L in 0.5-step increments
- Tick labels: 0.5 / 1 / 1.5 / 2 / 2.5 / 3 / 3.5 / 4

**Feedback bar (green):** "✅ Good target" (below the slider)

**Tip strip (lavender):** "💡 Tip: Start folate-rich foods even before planning pregnancy"

**Footer:** ← Back · Next →

## Step 4/4 — (not shown, inferred from progress dots)

Likely the **mood + symptom logger** that finalises the check-in.
Probably:
- 5-emoji mood selector (Great/Calm/Low/Irritable/Tired)
- Optional symptom multi-select (cramps, headache, fatigue, etc.)
- "Save check-in" CTA

After save: home dashboard updates the Hydration card (showing target),
the Nutrition card, the AI Insight (refreshed based on today's plan), and
the user gets XP / streak credit.

**v3 status:** We have `components/daily-check-in.tsx` but it's basic.
Doesn't have this 4-step flow. P1 work — high impact for engagement.

---

# What v3 still needs from this batch

| Feature | v3 status | Priority |
|---|---|---|
| Nutrition mode card with phase-aware nutrient targets | ❌ | P1 |
| Food pills "EAT TODAY" tied to phase | ⚠️ Have DAILY_NUTRIENT_FOCUS but simpler | P1 |
| Citation badge component | ❌ | P1 (already in checklist) |
| BMI calculator full page | ❌ UI only — logic done | P1 #5 |
| Daily Check-in 4-step modal | ❌ Existing daily-check-in is simpler | P1 |
| Phase-aware focus topic + nutrient bullets | ❌ | P1 |
| AI-evaluated check-in feedback ("Good plan for the day") | ❌ | P2 |

---

# Daily Check-in step 4 — Symptoms (final)

**Progress:** ▰▰▰▰ (3 green + 1 coral — final step)
**Header:** "😩 Any symptoms today?"
**Subtitle:** "Symptoms help us assess your nutritional risk accurately. Be honest."

**6 multi-select symptom pills** (2 rows of 3):
- 😩 Tiredness
- 😵 Dizziness
- 🤢 Nausea
- 🥵 Swelling
- 🤕 Headache
- 😊 Feeling fine (mutually exclusive — clears the others when tapped)

**Footer row:** ← Back · ✨ **Start My Day!** (CTA, full-width, disabled when no selection made)
"Skip for today" link below

After "Start My Day!": modal closes, home dashboard refreshes with all
new state (plan + supplements + water target + symptoms feeding into
the AI insight card and risk-prediction model).

---

# Nutrition tracker — full-page module

Reached from Quick Actions → Meals or from the mode-switcher's Nutrition
chip on home.

**Header (sticky):**
- ⬅ back chevron
- 🥗 "Nutrition — Reproductive Health 🌸" (phase-aware subtitle)
- "Friday, 15 May" date below
- "Weekly" toggle button top-right (jumps to weekly report)

**Tab bar (4 tabs):**
- 📋 Today (selected, coral underline)
- ➕ Add Meal
- 📊 Stats
- 💡 Insights

## Tab 1 — Today

**Summary card:**
- Left: small radial gauge "0 / 1900 kcal" centered inside
- Right: 4 nutrient bars stacked:
  - 💪 Protein · 0 / 55g
  - 🥕 Iron · 0 / 21mg
  - 🥬 Folic Acid · 0 / 200µg
  - 🦴 Calcium · 0 / 600mg
- All bars empty in this state (0% logged)

**Meal-type filter pills:**
- All · **Breakfast** (selected, coral) · Lunch · Snack · Dinner

**Empty state when no meals logged:**
- 🍽 plate icon centered
- "No meals logged yet"
- "You planned 3 meals today. Start logging!" (pulled from Daily Check-in step 1 answer)
- **+ Add First Meal** (coral CTA)

**Quick Add card** (below):
- "⚡ Quick Add" header · "For Reproductive Health 🌸" subtitle
- Horizontal scroll of 5+ food chips, each with:
  - Photo or emoji icon
  - Food name (e.g. "Moong Dal", "Ragi Porridge", "Guava", "Moong Sprouts", "Palak / Spinach")
  - Calories sub-label (e.g. "105 cal")

(Quick Add list rotates based on cycle phase — fertile phase = folate-rich
foods; luteal = magnesium-rich; menstrual = iron-rich.)

## Tab 2 — Add Meal (not screenshot but inferred)

Modal/form to log a meal: meal type, food search (with Indian foods DB
auto-suggest), portion size, time. On save → updates Today tab numbers.

## Tab 3 — Stats

**📊 Today's Full Nutrition card:**
- 8 nutrient bars stacked vertically:
  - 🥩 Calories · 0 / 1900 kcal
  - 💪 Protein · 0 / 55 g
  - 🥕 Iron · 0 / 21 mg
  - 🥬 Folic Acid · 0 / 200 µg
  - 🦴 Calcium · 0 / 600 mg
  - 🍊 Vitamin C · 0 / 40 mg
  - 🍞 Carbs · 0 / 260 g
  - 🥑 Fat · 0 / 58 g
- Each bar tinted to nutrient colour

**📅 This Week (Calories) card:**
- 7 vertical day-bars (Sat, Sun, Mon, Tue, Wed, Thu, **Fri** highlighted)
- Goal line: "1900 kcal/day"
- Today's bar tinted coral, others muted

**🎯 Today's Scores vs ICMR-NIN RDA card:**
- For each nutrient: name · % · status pill
  - Iron 0% **Critical** (red pill)
  - Folic Acid 0% Critical (red)
  - Calcium 0% Critical (red)
  - …
- Status thresholds:
  - 0-30% → Critical (red)
  - 31-60% → Low (amber)
  - 61-90% → Good (green)
  - 91%+ → Excellent (deep green)

## Tab 4 — Insights

**💡 Tip strip (yellow):** "1 ragi roti = 103mg calcium (more than a glass of milk per 100g)"
(Rotates daily, phase-aware.)

**⚡ Today's Alerts** card:
- 🔴 Iron very low today. Add bajra roti, palak, or masoor dal at your next meal.
- 🟡 Folic acid low. Eat palak, moong dal, or broccoli today.
- 🦴 Calcium low. Have milk, ragi porridge, or dahi.
(Alerts generated from today's logged vs target gap.)

**🏗 Absorption Science** card (purple gradient):
- 🍋 Vitamin C (amla/lemon) with iron food = 3× absorption
- 🍵 Avoid tea/coffee 1 hour after iron-rich meals — blocks absorption
- ☀️ Sunlight (15 min/day) activates calcium absorption
- 🥛 Don't take iron + calcium supplements together — they compete
- 🍳 Cook in iron kadhai — adds 2-3mg extra iron to every meal

(These 5 are EVERGREEN tips — same content every day. Educational layer.)

**CTA:** "📊 View Full Weekly Report" (purple full-width button) → opens the
Weekly Report screen below.

---

# Weekly Report screen

Reached from Nutrition → Insights → "View Full Weekly Report" or from
the "Weekly" toggle in the Nutrition tracker header.

**Header:**
- ⬅ back chevron
- 📊 "Weekly Report"
- Subtitle: "15 May 2026 · 0/7 days logged"

**Warning bar (when underlogged):**
- ⚠️ "Only 0/7 days logged. Log meals daily for accurate analysis. Scores below are based on the 0 days you logged."

**📝 Your Weekly Story** card:
Bullet list of urgent + actionable observations, AI-generated:
- 🔴 Your iron was at 0% of what your body needs. This can cause severe anaemia — weakness, breathlessness, and in pregnancy, risk to your baby. Eat bajra roti, moringa, palak every day and always with amla or lemon.
- 🟡 Folic acid at 0%. Eat green leafy vegetables — palak, methi, broccoli — at least once a day.
- 🦴 Calcium at 0%. Your bones are losing density. Have 1 ragi roti or 1 glass of milk every day — non-negotiable.
- 📋 You logged only 0/7 days this week. Log every day for accurate weekly analysis.

**Per-nutrient detail cards** (Iron, Folic Acid, Calcium, etc.):
- Nutrient icon + name big
- "Avg X / Y unit" sub-label
- Right side: % badge with status pill (e.g. "0% Critical" red)
- Progress bar (week average)
- 7 daily-coverage bars (Sat-Fri) showing how many days that nutrient was hit
- Warning row when Critical: "Consult doctor or ASHA worker immediately."
- "Daily coverage ↑" caption right

---

# Updated v3 mapping

| Feature | v3 status | Priority |
|---|---|---|
| Daily Check-in step 4 (symptoms multi-select) | ❌ | P1 |
| Nutrition tracker 4-tab module (Today/Add/Stats/Insights) | ⚠️ Have single page, no tabs | P1 |
| Nutrition Today empty state + Quick Add foods | ❌ | P1 |
| Stats tab — 8 nutrient bars + weekly chart + ICMR-NIN scoring | ❌ | P1 |
| Insights tab — Today's Alerts + Absorption Science (evergreen) | ❌ | P1 |
| Weekly Report screen with urgent AI story + per-nutrient detail | ❌ | P1 — single most credibility-building feature |
| ASHA worker escalation copy on Critical status | ❌ | P1 (DPDP-aligned, India-specific) |
| Foods DB with cal + key-nutrient per item for Quick Add | ⚠️ Have `lib/food-db.ts` | Need to verify it has the right columns |

---

# Pregnancy mode card (when "Pregnancy" tab selected in mode-switcher)

Replaces the cycle ring + nutrition card. Theme: purple/lavender gradient,
leaf/sprout imagery.

**Label:** "FERTILITY WINDOW" (small purple caps)
**Title:** "Fertile Window!" (Fraunces, purple, big)
**Subtitle:** "You are in your fertile window — best days to conceive!"

(Title flips based on cycle phase:
- Period → "Day X · Rest & restore"
- Follicular → "Building Energy"
- Fertile → "Fertile Window!"
- Luteal → "Slow & Nourish"
And subtitle adapts accordingly.)

**Inner "YOUR FERTILITY CYCLE" panel** — 4 horizontal pills:
- Period · D1–5 (rose tint when active)
- Follicular · D6–12 (green tint)
- **Fertile · D13–17** (purple, currently selected)
- Luteal · D18–28 (blush tint)

Tapping any pill (preview-style, not navigation) shows the day range + a
phase-specific blurb in a tooltip or below.

**Bottom tip card (lavender):**
- 🤰 "Planning a baby? Track your fertile window and log symptoms to improve your chances."

---

# Cycle detail page (full module — /cycle in keen-ai)

This is the dedicated Cycle screen, distinct from the dashboard's
mode-switcher card. Reached via bottom nav "CALENDAR" tab or from a
Quick Action.

**Sticky tab bar at top:** Today (coral, selected) · Calendar · Analysis

## Tab 1 — Today

**Phase hero card (mustard/gold gradient for Luteal — palette changes
per phase):**
- Label: "LUTEAL PHASE" caps
- Huge "17" + "Day of cycle"
- "Next period in **12 days**" pill (right)
- Italic tip: "Slow down and nourish. Magnesium-rich foods ease PMS symptoms."

**Stat trio cards** (white, 3-up):
- 🩸 "17 of 28 · Cycle day" (gold accent)
- 🩸 "27 May · Next period" (rose accent)
- 🥚 "13 May · Ovulation" (green accent)

**Where you are card:**
- Title: "Where you are" + subtitle "Your cycle position today"
- Horizontal phase track: Period | Follicular | Fertile | **TODAY** (Luteal)
- Slider thumb pinned at the user's current day along the track

**My Cycles card:**
- Title: "My Cycles"
- 3 stats: 📊 "1 Cycles logged" / 🩸 "5d Avg period" / 📅 "28d Avg cycle"

**Ask NutriMama AI** bottom card (purple) — link to chat with cycle context preloaded.

## Tab 2 — Calendar (not screenshot — inferred)

Month-view calendar with each day coloured by predicted phase. Tap a day
to log/edit period flow + symptoms. Mini-legend at the bottom.

## Tab 3 — Analysis (intercourse + fertility insights)

**Header:** "Analysis" with eye icon (privacy hint). 1-Month filter ▼.

**Cycle Overview card** (peach gradient):
- "D17" circle (large)
- Title: **Fertile Window**
- "High chance of conception"
- "Next period in ~12 days"

**Intercourse chart card** (white):
- Title: "Intercourse chart" · "Chance of getting pregnant" subtitle
- Bar chart: days 11-19 on x-axis, probability on y (HIGH / MEDIUM / LOW)
- Bars are coral-tinted, taller on fertile days (13-15), tapering at edges
- "⋮" overflow menu top-right

**Intercourse activity card:**
- 2×2 stat grid:
  - 0× ❤️ Intercourse
  - 0% 😊 Female orgasm
  - 0× 🛡️ Protected
  - 0× ❤️ Unprotected
- "⋮" overflow menu

(This screen is fertility-tracking-app territory — sensitive but valuable
for users actively trying to conceive. Should be **toggle-off-able** in
Settings for users who don't want it.)

---

# Settings page

Reached from bottom nav (rightmost tab) or from member card.

**Header:** "Settings" (Fraunces, large)

**Profile card** (coral gradient):
- "K" avatar
- "kunti" name (white)
- "🌸 Period Tracking · 22 yrs" subtitle
- "Free · ₹49/mo for Pro" pill (white outline) — tap to upgrade

**TRACKING MODE section** (white card):
- Header caps: "TRACKING MODE"
- 2 pills:
  - 🩸 **Period** (selected, coral)
  - 🤰 Pregnant (taps → opens "How many weeks pregnant?" modal)

**Setting rows (list, each is icon + label + control):**
- 🌍 Language · English ▼ (dropdown — English/Hindi/Tamil/Telugu/Bengali/Marathi)
- 🌙 Dark Mode · toggle
- 🔒 Local-only mode (no AI) · toggle
  *(Important — DPDP-aligned. Disables AI calls; cycle/log features still work locally.)*
- 📤 Export my data · row (tappable)
- 🔔 Reminders · row
- 🤖 AI Chat · row (advanced AI settings)

(More rows likely below: Notifications, Privacy, Account, Sign Out.)

## Pregnant-weeks modal (triggered from Tracking Mode → Pregnant)

- Woman/pregnant emoji at top
- Title: "How many weeks pregnant?"
- Subtitle: "Enter weeks 1-40"
- Stepper: `−` button · green big number (1 default) · `+` button
- Cancel / Confirm buttons

On Confirm → User row updates: `pregnancyStage="PREGNANT"`, `pregnancyWeek=<n>`.
Dashboard immediately recomputes trimester/due date/risk model.

---

# Updated v3 mapping

| Feature | v3 status | Priority |
|---|---|---|
| Pregnancy mode card (phase-aware fertility view) | ❌ | P1 |
| Cycle detail page with Today/Calendar/Analysis tabs | ⚠️ Have /cycle but no tab structure | P1 |
| Intercourse chart + activity tracking | ❌ Sensitive feature — needs settings toggle | P2 (after launch) |
| Settings: Tracking Mode toggle | ⚠️ Have life-stage flow in onboarding, no quick swap in Settings | P1 |
| Settings: Local-only mode (DPDP shield) | ❌ | P1 — credibility win |
| Settings: Export my data | ❌ Have right-to-erasure, no export | P1 — DPDP-aligned |
| Pregnant-weeks modal | ⚠️ Onboarding sets pregnancyWeek, no quick edit later | P1 |
| Multilingual switch (6 languages) | ❌ | P1 (already in checklist) |
| Calendar month-view with phase colours | ❌ | P1 |

---

# Pregnancy week-by-week tracker (full module — when in Pregnant mode)

Replaces the Cycle module entirely when `pregnancyStage === "PREGNANT"`.
Reached from bottom-nav "TODAY" or "CALENDAR". Theme: green gradient,
clinical/leaf imagery.

## Hero card (week number)

- Pregnant figure emoji centered (large)
- Huge number: "24"
- "weeks pregnant" subtitle
- Trimester pill: "Second Trimester · trimester 2" (green)
- "📅 Due date: 3 Sept 2026"
- Citation pill: `[WHO WHO ANC Guid…]` (blue) — clinical source

## Baby size card

- 📏 ruler icon (large)
- Title: "Baby is about the size of — like a Ear of corn"
  (Comparison object changes per week: poppy seed → blueberry → lemon → corn → cauliflower → ...)
- Sub-line: "Length: ~300 cm · Weight: ~~600g"

## Development card

- Heading: "Development:"
- Free-text paragraph, **citation-grounded** for clinical credibility:
  > "VIABILITY THRESHOLD. Lungs starting surfactant production (critical for breathing). Eyelids opening for first time. Baby responsive to sounds and light through uterine wall (Moore & Persaud 10th Ed)."
- Citation badge bottom: `[ACOG Moore & Pers…]` (green)

(This is **embryology-grade copy** — keen-ai has a dataset of 40 weeks
of fetal-development paragraphs with sources. Need to port the dataset
itself, not just the UI.)

## What to expect this week card

- 🌱 leaf icon header: "What to expect this week"
- Bulleted list of symptoms/changes for that week, e.g.:
  - Strong fetal movements
  - Weight gain visible
  - Swelling, leg cramps, back pain

## Nutrition focus card

Format: phase-aware title + 3 macro/micro priority cards.

**Header:** "🥗 GDM screening; optimize for remainder of pregnancy — Week 24"

**Nutrient priority cards** (3 stacked, each with):
- Title (e.g. "Carbohydrates (controlled)")
- Right-side pill: dose/target (e.g. "Part of 2200 kcal", "200 mg/day", "Recommended addition")
- 🍽 Food sources line: "Whole grains, oats, legumes, vegetables; minimize refined sugars"
- ℹ️ Rationale line with citation:
  > "GDM screening Week 24-26 (75g OGTT); establish low-GI eating pattern (FOGSI 2023)"

Examples for Week 24:
1. **Carbohydrates (controlled)** · Part of 2200 kcal
2. **DHA** · 200 mg/day · sources: fatty fish 2× weekly, DHA supplement
3. **Fiber** · Recommended addition · sources: whole grains, vegetables, legumes

**Week-specific tip strip (green):**
- 💡 "GDM screening this week or next (75 g OGTT, fasting). Come well-rested, hydrated. If 1 value elevated, no treatment unless confirmed GDM (FOGSI). Viability nearly complete — odds improve daily."

Citation pill bottom: `[ICMR ICMR-NIN Rec…]` (red)

## ANC Visit Due This Week card (cream/yellow)

- 📋 clipboard icon
- Title: "ANC Visit Due This Week"
- Body (clinical guidance):
  > "ANC Contact 3: Week 26 (may be done earlier). GDM screening OGTT 75 g at 24-28 weeks. BP, urine protein check. Hb screening. Discuss birth plan."
- Citation pill: `[WHO WHO ANC Guid…]`

(This is the 8-contact ANC schedule baked in:
- Contact 1: < 12 wks · BP, Hb, blood group, USS dating, start IFA
- Contact 2: 20 wks · Anomaly USS Level II, fetal growth
- Contact 3: 26 wks · GDM screening, BP, urine protein
- Contact 4: 30 wks · Repeat Hb, iron compliance, fundal height
- Contact 5: 34 wks · Growth USS if indicated, birth preparedness
- Contact 6: 36 wks · Fetal presentation, birth plan finalised
- Contact 7: 38 wks · BP, fetal movement, hospital bag ready
- Contact 8: 40 wks · Post-dates plan, NST/BPP if needed)

## Expandable info cards (collapsed by default)

- 🚨 **Trimester 2 Warning Signs — Know These** (red bg) ▼
  - Severe headache + blurred vision (pre-eclampsia signs)
  - Reduced fetal movement after week 28
  - Heavy bleeding or fluid leak
  - Fever > 38°C
  - Severe abdominal pain
- 📅 **ANC Visit Schedule (WHO — 8 Contacts)** (purple bg) ▼
  - Lists the 8 contacts above

## Talk to NutriMama AI button (coral, full-width)

Opens chat preloaded with current week + nutritional plan context.

## Source footer

> "📋 Information based on FOGSI 2023 · ICMR 2020 · WHO 2016 · ACOG 2020 guidelines. This app provides health information only — not a substitute for clinical care. Always consult your OB/GYN for medical decisions."

---

# Health Articles (content library)

Reached from Quick Actions → Articles or from a related-content link in the
pregnancy/nutrition module.

**Hero (purple-magenta gradient):**
- ⬅ Back button
- 📖 "Health Articles"
- "Expert insights for your motherhood journey"

**Featured article** (full-width green card):
- Top label: "FEATURED · NUTRITION"
- Title: "Top Iron-Rich Foods for Pregnancy & Periods"
- Description: "Iron deficiency is common in Indian women. Here's how to boost your levels naturally with everyday foods like spinach, lentils, and jaggery."
- Footer: "5 min read · 1 min video · NutriMama Team"

**Article list cards** (smaller, white):
- Category label + read time (e.g. "MENTAL HEALTH · 4 MIN READ")
- Title (Fraunces)
- 2-3 line description preview
- Cycle health · 6 MIN READ · "Understanding Your Menstrual Cycle Phases"
- Mental health · 4 MIN READ · "Managing Anxiety During Pregnancy"
- (etc.)

## Article detail page

Standard reading layout — title, body, embedded subsections. Special
elements observed:

**Bulleted nutrient items with coloured dots:**
- 🟢 Daliya (Broken Wheat): High fiber to prevent postpartum constipation.

**Section: What to Avoid (italic body)**
**Encouragement paragraph** in body copy

**Watch Information Video section:**
- 🎬 header "Watch Information Video:"
- 2 video cards:
  - Big red YouTube card: "▶ Watch on YouTube" (links out)
  - Gradient pink-purple card: "▶ Play Instagram Reel" (links to Reel)

(Cross-platform content links — keen-ai surfaces YouTube + Instagram videos
embedded into Articles. NutriMama is content + community.)

---

# v3 mapping for pregnancy + articles modules

| Feature | v3 status | Priority |
|---|---|---|
| Week-by-week pregnancy hero (24 weeks → corn, etc.) | ⚠️ `lib/fetal.ts` exists, no UI | P1 — clinical credibility |
| Fetal development dataset (40 weeks of paragraphs + citations) | ❌ Need to port from old code | P1 — content not code |
| ANC 8-contact schedule + week-specific guidance | ❌ Listed in spec; UI + data needed | P1 — single biggest credibility win for pregnant users |
| Trimester-specific warning signs (expandable) | ⚠️ Have triage engine, no UI list | P1 |
| Citation badges (`[WHO …]`, `[FOGSI …]`, `[ICMR …]`, `[ACOG …]`) | ❌ | P1 — already in main checklist |
| Source footer ("Information based on FOGSI 2023 · …") | ❌ | P1 — DPDP / regulatory hygiene |
| Health Articles content library | ⚠️ Have /blog but format differs | P1 |
| Featured article card style | ❌ | P1 |
| Article detail with embedded YouTube / Instagram cards | ❌ | P2 (after content team produces media) |
| GDM-specific nutrition guidance | ❌ | P1 |
| Phase-aware nutrient priority cards (3-up with citation) | ❌ | P1 |

---

# Final consolidated keen-ai port checklist

(Replaces the earlier inline checklist — this is the canonical list.)

## P0 — Launch must-have

1. ✅ Phone OTP login + email hybrid (DONE)
2. PIN lock screen (4-digit re-entry)
3. Email verification (DONE via Resend)
4. Server-action paywall fixes (DONE for nutrition + PCOS)
5. Reports server-action paywall fix (same pattern, not yet applied)

## P1 — Feature parity with keen-ai

### High-impact (build first)

6. **Weekly Report** — AI Story + per-nutrient detail + ASHA escalation
7. **Daily Check-in 4-step modal** — meals/supps/water/symptoms
8. **Pregnancy week-by-week tracker** — fetal dev + ANC schedule + warning signs
9. **Nutrition tracker 4-tab module** — Today / Add / Stats / Insights
10. **Home dashboard rebuild** — mode-switcher, hydration, mood logger, quick actions grid, AI insights

### Medium impact

11. **BMI calculator full page** (Indian-Asian cutoffs)
12. **Settings polish** — Tracking Mode swap, Local-only AI, Export, Reminders
13. **Cycle detail page Today/Calendar/Analysis tabs**
14. **Health Articles content library** + featured/list cards + article detail
15. **Citation badges** — `[FOGSI]`, `[ICMR]`, `[WHO]`, `[ACOG]` everywhere with sources
16. **Absorption Science** evergreen card (5 rules)
17. **Source footer** on every clinical screen
18. **Multilingual switch** (en/hi/ta/te/bn/mr)

### Polish

19. FAB for one-tap quick logging
20. Confetti celebration on goal hit
21. Traffic-light triage UI component
22. Member XP / Gold-tier gamification (skippable for v1)
23. Partner Mode banner (skippable for v1)
24. Intercourse tracking (privacy-toggle in Settings)
25. Health endpoint `/api/health` for UptimeRobot

## P2 — Post-launch

26. Calendar month view with phase colors
27. Article video embeds (YouTube + Instagram)
28. Reminders push notifications
29. Export-my-data CSV/PDF

---

# Stop saving — start building

I have full coverage of every screen now. From here on, the spec is the
contract — we build off this, not off more screenshots.

