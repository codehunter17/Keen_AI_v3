// AUTO-GENERATED from NutriMama_Knowledge_Base_Batch1-6.
// Do NOT edit by hand — regenerate from source files.

export type EmergencySeverity = "RED" | "YELLOW";

export interface EmergencyAlert {
  severity: EmergencySeverity;
  text: string;
}

export interface ConditionSections {
  overview: string;
  gharelu: string;
  ayurveda: string;
  modern: string;
  disclaimer: string;
}

export type ConditionCategory =
  | "MENSTRUAL"
  | "PREGNANCY"
  | "POSTPARTUM"
  | "MENOPAUSE"
  | "PCOS_HORMONAL"
  | "GENERAL_HEALTH"
  | "MENTAL_HEALTH"
  | "NUTRITION_DEFICIENCY";

export interface Condition {
  id: number;
  slug: string;
  name: string;
  nameHi?: string;
  nameGu?: string;
  emoji: string;
  category: ConditionCategory;
  summary: string;
  whoGetsIt: string;
  sections: ConditionSections;
  emergency: EmergencyAlert[];
  relatedIds: number[];
}

export const CONDITIONS: Condition[] = [
  {
    id: 1,
    slug: "period-cramps",
    name: `Period Cramps`,
    nameHi: `माहवारी में दर्द`,
    nameGu: `માસિક દરમિયાન દુખાવો`,
    emoji: "🩸",
    category: "MENSTRUAL",
    summary: `Period cramps (dysmenorrhea) are caused by uterine contractions driven by prostaglandins. About 60-70% of women experience some pain; 15-20% have severe disabling cramps. Most primary cramps respond to heat, NSAIDs, and lifestyle measures.`,
    whoGetsIt: `- 60-70% women ko periods mein kuch na kuch dard hota hai
- Severe disabling pain: 15-20% women
- Age 15-25 mein sabse zyada common
- Family history ho toh 3x zyada chances hain
- Smoking karne waali women mein significantly zyada
- Periods heavy hain toh cramps bhi zyada intense
- Early menarche (11 se pehle periods) = zyada cramps
- BMI zyada ho toh cramps bhi zyada
- First pregnancy ke baad aksar kam ho jaata hai
- Stress aur anxiety cramps ko aur badha dete hain

📊 SEVERITY LEVELS:
MILD (Pain Score 1-3):
  → Thoda dard hai but daily kaam kar sakti hain
  → Gharelu nuskhe se 30 min mein aaram milta hai
  → Medicine ki zaroorat nahi usually

MODERATE (Pain Score 4-6):
  → Dard zyada hai, rest chahiye, concentrate nahi hota
  → School/office jaana mushkil lagta hai
  → Gharelu nuskhe + medicine dono try karo
  → 1-2 din rest lena normal hai

SEVERE (Pain Score 7-10):
  → Unbearable dard, vomiting, cannot stand/walk
  → Bilkul kaam nahi kar sakti
  → Medicine lo + doctor consult zaroor karo
  → Agar har month aisa ho toh underlying cause investigate karo
  → Ultrasound ya further tests zaruri ho sakte hain

📅 PAIN TIMELINE:
- Start: Period shuru hone se 1-2 din pehle ya Day 1 pe
- Peak: Day 1-2 pe sabse zyada intense
- End: Usually Day 2-3 tak gradually kam ho jaata hai
- Agar Day 3 ke baad bhi severe ho → doctor zaroor
- Secondary mein: Period ke pehle bhi aur baad mein bhi

ASSOCIATED SYMPTOMS:
→ Lower back pain (kamar dard)
→ Inner thigh pain (jangho mein dard)
→ Nausea / vomiting (jee machlana / ulti)
→ Loose motions (dast)
→ Headache (sir dard)
→ Fatigue / weakness (thakan / kamzori)
→ Bloating (pet phulna)
→ Mood swings / irritability (chidchidapan)
→ Breast tenderness (chhati mein dard)
→ Dizziness (chakkar aana)`,
    sections: {
      overview: `Periods ke time uterus contract hoti hai blood nikalne ke liye.
Is process mein prostaglandins chemical release hote hain jo
pain aur inflammation cause karte hain. Jitne zyada prostaglandins,
utna zyada dard.

2 TYPES:
PRIMARY DYSMENORRHEA:
→ Normal period pain — koi underlying disease nahi
→ Usually periods shuru hone ke 1-2 saal baad start
→ Age ke saath ya pregnancy ke baad aksar kam hota hai

SECONDARY DYSMENORRHEA:
→ Kisi condition ki wajah se — endometriosis, fibroids,
  PCOS, adenomyosis, pelvic inflammatory disease
→ Age 25+ mein suddenly shuru ho toh investigate karo
→ Pain waqt ke saath badh raha ho toh doctor zaroor`,
      gharelu: `Hindi: घरेलू नुस्खे | Gujarati: ઘરેલું ઉપાય

⚡ INSTANT RELIEF (5-10 min mein rahat):

1. GARAM BOTTLE / HOT WATER BAG (गर्म बोतल / ગરમ બોટલ)
   → Pet ke nichle hisse pe rakho (lower abdomen)
   → 15-20 min continuously
   → Blood flow badhti hai, muscles relax hote hain
   → Temperature: Comfortably warm — skin jale nahi
   → Kapda/towel wrap karo — seedha skin pe mat rakho
   → Research: Heat therapy = ibuprofen jitna effective
   → Kamar pe bhi rakh sakte ho back pain ke liye
   → Alternative: Garam kapda, garam ret ki potli

2. AJWAIN + KALA NAMAK WATER (अजवाइन + काला नमक / અજમો + સિંધવ મીઠું)
   → 1 tsp ajwain + chutki kala namak
   → 1 glass garam paani mein 5 min ubalo
   → Chhaan ke piyo — garam garam
   → Antispasmodic hai — cramp turant kam hota hai
   → Din mein 2-3 baar le sakte ho safely
   → Thymol compound jo cramps relax karta hai
   → Grandma's remedy — centuries se proven

3. ADRAK COMPRESS (अदरक सेक / આદુનો શેક)
   → 1 inch fresh adrak — kaddukash karo
   → Garam paani mein daalke kapda bheego
   → Pet pe compress lagao — 10-15 min
   → Anti-inflammatory + warming effect
   → Blood circulation improve hoti hai

🍵 DRINKS & KADHA (पेय / પીણાં):

4. ADRAK KI CHAI (Ginger Tea / अदरक चाय / આદુની ચા)
   → 1 inch fresh adrak — crush ya grate karo
   → 1 cup paani mein 5 min tak ubalo
   → Chhaan ke shahad + nimbu daalo
   → Din mein 2-3 cup pi sakte ho
   → Anti-inflammatory + anti-prostaglandin
   → RESEARCH PROVEN: 250mg ginger = ibuprofen jitna
     effective for period pain (Journal of Pain Research)
   → Nausea bhi kam karta hai saath mein
   → ⚠️ Zyada mat piyo — acidity ho sakti hai

5. SAUNF + GUR KA KADHA (Fennel + Jaggery / सौंफ + गुड़ / વરિયાળી + ગોળ)
   → 1 tsp saunf (fennel seeds) + 1 tsp gur (jaggery)
   → 1.5 cup paani mein ubalo jab tak aadha rahe
   → Chhaan ke garam piyo
   → Subah shaam — din mein 2 baar
   → Uterine muscle relaxant — cramp kholta hai
   → Gur mein iron bhi hai — bonus
   → Period se 2 din pehle se shuru karo — prevention
   → Bahut safe — teen girls bhi le sakti hain

6. DAALCHINI DRINK (Cinnamon / दालचीनी / તજ)
   → 1/2 tsp daalchini powder
   → Garam paani ya garam doodh mein mix karo
   → Chutki shahad optional
   → Din mein 2 baar — subah aur raat
   → Blood flow regulate karta hai
   → Anti-inflammatory + antispasmodic
   → RESEARCH: Significantly reduces menstrual pain score
     (Cinnamon 420mg vs placebo study)
   → ⚠️ Zyada mat lo — blood thinning effect hai

7. HALDI WALA DOODH (Golden Milk / हल्दी दूध / હળદરનું દૂધ)
   → 1 tsp haldi powder + 1 glass garam doodh
   → Chutki kaali mirch ZAROOR daalo (absorption 2000% badhti)
   → 1/2 tsp ghee bhi daal sakte ho
   → Raat ko sone se 30 min pehle piyo
   → Curcumin = powerful anti-inflammatory compound
   → Pain + bloating dono kam
   → Neend bhi achhi aati hai — bonus
   → Safe for all ages — teen se adult tak

8. METHI DANA WATER (Fenugreek / मेथी दाना / મેથીનાં દાણા)
   → 1 tsp methi dana raat ko 1 glass paani mein bhigo do
   → Subah khali pet woh paani piyo + dana bhi chabao
   → Ya: methi powder 1/2 tsp garam paani mein
   → Hormonal balance karta hai
   → Anti-inflammatory compounds hain
   → Period se 3 din pehle se shuru karo
   → RESEARCH: Reduces pain duration significantly
   → ⚠️ Pregnancy mein avoid — uterine contractions

9. PUDINA CHAI (Peppermint Tea / पुदीना चाय / ફુદીનાની ચા)
   → 8-10 fresh pudina leaves ya 1 tsp dried
   → Garam paani mein 5 min steep karo
   → Shahad optional
   → Menthol = natural muscle relaxant
   → Nausea + cramps dono mein relief
   → Bloating bhi kam karta hai
   → Safe — din mein 3-4 cup tak okay

10. JEERA WATER (Cumin / जीरा पानी / જીરાનું પાણી)
    → 1 tsp jeera — dry roast karo halka
    → 1 glass paani mein ubalo 5 min
    → Chhaan ke piyo — garam ya normal
    → Anti-inflammatory + digestive
    → Gas/bloating period mein bahut common — yeh fix karta
    → Safe for everyone — koi side effect nahi

🥗 FOOD REMEDIES (खाने से इलाज / ખોરાકથી ઉપચાર):

11. PAPAYA — KACHCHA (Raw Papaya / कच्चा पपीता / કાચું પપૈયું)
    → Period se 3-4 din pehle regular khaao
    → Papain enzyme — uterine contractions smooth karta
    → Blood flow regulate karta hai
    → Medium piece daily — salad ya juice
    → ⚠️⚠️ PREGNANCY MEIN BILKUL MAT KHAO
      (Miscarriage ka serious risk — papain causes
       uterine contractions jo dangerous hain)
    → Period delay ho toh bhi helpful — flow laata hai

12. TIL / SESAME SEEDS (तिल / તલ)
    → 1-2 tsp daily — plain chabao ya ladoo banao
    → Til ka ladoo: til + gur — best combo
    → Rich in: Zinc, Magnesium, Calcium, Vitamin B6
    → Hormone balance + pain relief
    → Warming nature — period mein beneficial
    → Til ka tel bhi pet pe massage ke liye use karo

13. ALSI / FLAXSEED (अलसी / અળસી)
    → 1 tbsp daily — fresh ground karo ya chabao
    → Smoothie, dahi, roti mein daal sakte ho
    → Omega-3 fatty acids = anti-inflammatory
    → Lignans = estrogen balance karte hain
    → Prostaglandins production kam karta hai
    → 2-3 months regular use se maximum benefit
    → Store: fridge mein rakho — jaldi kharab hoti hai

14. KELA / BANANA (केला / કેળું)
    → 1-2 daily during periods
    → Rich in: Potassium + Vitamin B6 + Magnesium
    → Potassium = muscle cramps kam
    → B6 = mood better + bloating kam
    → Natural sugar = energy boost without crash
    → Easy to digest — nausea mein bhi khaa sakte

15. DARK CHOCOLATE (70%+ cocoa)
    → 1-2 small pieces (20-30g)
    → Magnesium rich — natural muscle relaxant
    → Endorphins release — natural painkiller
    → Mood boost — serotonin badhta hai
    → ⚠️ Milk chocolate nahi — dark 70%+ only
    → ⚠️ Zyada mat khaao — sugar crash hoga

16. DATES / KHAJUR (खजूर / ખજૂર)
    → 3-4 daily during periods
    → Iron rich — blood loss compensate karta hai
    → Natural sugar — energy deta hai
    → Magnesium + Potassium — cramp relief
    → Fibre — constipation bhi fix karta hai
    → Period se 1 week pehle se khaana shuru karo

17. PALAK / SPINACH (पालक / પાલક)
    → Daily sabzi, smoothie, ya paratha mein
    → Iron + Magnesium + Vitamin B6
    → Blood loss ki bharpaai karta hai
    → Anti-inflammatory properties
    → Best cooked — raw mein oxalates zyada

🧘 YOGA & MOVEMENT (योग / યોગ):

18. BALASANA (Child's Pose / बालासन)
    → Ghutno pe baith ke aage jhuko, haath aage
    → 2-3 min hold karo — deep breathing ke saath
    → Lower back + pelvic area relax hota hai
    → Sabse safe aur aasaan pose period mein

19. SUPTA BADDHA KONASANA (Reclining Butterfly)
    → Peeth ke bal leto, pair ke talve joodo
    → Ghutne bahar girayein, haath relaxed
    → 3-5 min hold — deep breathing
    → Pelvic area open hota hai — blood flow improve
    → Pillow/blanket support use karo comfort ke liye

20. CAT-COW STRETCH (Marjaryasana-Bitilasana)
    → Hands & knees position
    → Inhale: back neeche, sir upar (Cow)
    → Exhale: back upar, chin chest pe (Cat)
    → 10 slow reps — spine flexibility + pelvic relief
    → Very gentle — severe pain mein bhi kar sakte

21. BHUJANGASANA (Cobra Pose / भुजंगासन)
    → Pet ke bal leto, haath chest ke paas
    → Inhale karke upper body upar uthao
    → 15-30 sec hold — 3 reps
    → Abdominal stretch — cramps loose
    → ⚠️ Zyada upar mat jao — gentle rakho

22. SHAVASANA + DEEP BREATHING
    → Peeth ke bal flat leto — aankhein band
    → 4 count inhale — 4 count hold — 6 count exhale
    → 5-10 min — pure body relax
    → Nervous system calm = pain perception kam
    → Best: Garam kamre mein, blanket odh ke

23. HALKI WALK (Light Walking)
    → 15-20 min gentle walk — park ya ghar mein
    → Blood circulation badhti hai significantly
    → Endorphins release — natural painkiller
    → ⚠️ Heavy exercise AVOID — gym, running, jumping nahi
    → ⚠️ Swimming period mein okay hai agar comfortable

LIFESTYLE DURING PERIODS:
→ Warm compress rakho readily available
→ Loose comfortable kapde pehno — tight jeans avoid
→ Hydrated raho — garam paani prefer karo
→ Light meals khaao — heavy/fried avoid
→ Sleep extra agar body maange — 8-9 hours
→ Screen time kam karo — rest is important

🛑 KYA NAHI KARNA (AVOID DURING PERIODS):
→ Bahut zyada chai/coffee — caffeine cramps badhata hai
  (Max 1-2 cup/day — zyada nahi)
→ Cold drinks/ice cream — muscles aur tight ho jaate
→ Zyada namkeen food — water retention + bloating
→ Junk food/fried food — inflammation badhata hai
→ Alcohol — dehydration + worse cramps
→ Heavy exercise — gym, weights, running avoid
→ Stress lena — cortisol cramps worsen karta hai
→ Skip meals mat karo — blood sugar drop = worse pain`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Period pain ko Ayurveda mein "Kashtartava" kehte hain.
Iska main kaaran Vata dosha ka prakopa (aggravation) hai.
Apana Vayu (downward moving energy) disturb hone se
menstrual flow mein obstruction hota hai aur dard hota hai.

DOSHA CONNECTION:
→ VATA PRADHAAN: Sharp, shooting, colicky pain, lower back,
  constipation ke saath, scanty flow, dark colored blood
  Treatment: Warm, oily, grounding therapies

→ PITTA PRADHAAN: Burning sensation ke saath dard,
  heavy bright red flow, loose motions, anger/irritability
  Treatment: Cooling, soothing therapies

→ KAPHA PRADHAAN: Dull, heavy ache, bloating, lethargy,
  heavy thick flow with clots, water retention
  Treatment: Light, warm, stimulating therapies

🌿 SINGLE HERBS:

1. ASHOKA / अशोक / અશોક (Saraca Indica) — ★ BEST FOR UTERUS
   → Action: Uterine tonic — strength + tone deta hai
   → Bark powder: 3-6g doodh ya garam paani ke saath
   → Ya Ashoka Ghana Vati tablet: 2 tablets din mein 2 baar
   → Period pain + heavy bleeding dono mein effective
   → "Ashoka" matlab "remover of sorrow" — naam hi kaafi hai
   → 2-3 months regular use se maximum fayda
   → Brand: Himalaya, Baidyanath, Patanjali
   → Price: Powder ₹80-150/100g | Tablet ₹120-200/60tab
   → DOSE TEEN (13-17): 2-3g ya 1 tablet din mein 2 baar
   → DOSE ADULT (18+): 3-6g ya 2 tablets din mein 2 baar
   → 🤰 PREGNANCY: ⚠️ AVOID — uterine stimulant
   → 🤱 BREASTFEEDING: ✅ Safe
   → Side effects: High dose pe constipation possible
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. SHATAVARI / शतावरी / શતાવરી (Asparagus Racemosus) — ★ WOMEN'S BEST HERB
   → Action: Hormonal balance, reproductive tonic, cooling
   → Churna: 1 tsp (3-6g) garam doodh mein — raat ko
   → Ya tablet: 500mg din mein 2 baar
   → "Shatavari" = "who has 100 husbands" — itni strength deta
   → Sabse SAFE herb — almost no side effects
   → Estrogen balancer — PMS, cramps, irregular periods sab
   → Brand: Himalaya, Organic India, Patanjali
   → Price: Powder ₹150-250/100g | Tablet ₹180-300/60tab
   → DOSE TEEN (13-17): 1/2 tsp ya 1 tablet din mein 2 baar
   → DOSE ADULT (18+): 1 tsp ya 2 tablets din mein 2 baar
   → 🤰 PREGNANCY: ✅ SAFE — traditional pregnancy herb
   → 🤱 BREASTFEEDING: ✅ EXCELLENT — galactagogue (milk badhata)
   → Side effects: Very rare — occasional loose stool
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. LODHRA / लोध्र / લોધ્ર (Symplocos Racemosa)
   → Action: Astringent — bleeding control + pain relief
   → Churna: 3-5g garam paani ya doodh ke saath
   → Heavy bleeding + cramps combination ke liye best
   → Uterine tissue ko tone karta hai
   → Brand: Baidyanath, Dabur
   → Price: Powder ₹100-180/100g
   → DOSE TEEN (13-17): 2-3g din mein 2 baar
   → DOSE ADULT (18+): 3-5g din mein 2 baar
   → 🤰 PREGNANCY: ⚠️ AVOID first trimester
   → 🤱 BREASTFEEDING: ✅ Safe
   → Side effects: Constipation agar zyada dose
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. DASHMOOL / दशमूल / દશમૂળ (10 Roots Combination)
   → Action: Anti-inflammatory, Vata shamak, analgesic
   → Kwath (decoction): 20-30ml garam paani ke saath
   → Subah shaam — khali pet ya khana se pehle
   → Severe cramps mein bahut effective
   → 10 roots ka powerful combination
   → Brand: Baidyanath, Kottakkal
   → Price: Kwath ₹120-200/450ml
   → DOSE TEEN (13-17): 15ml din mein 2 baar
   → DOSE ADULT (18+): 20-30ml din mein 2 baar
   → 🤰 PREGNANCY: ✅ SAFE — traditionally used post-delivery
   → 🤱 BREASTFEEDING: ✅ Safe
   → Side effects: Mild stomach warmth
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. NAGKESAR / नागकेसर / નાગકેસર (Mesua Ferrea)
   → Action: Hemostatic (bleeding control) + analgesic
   → Churna: 1-3g shahad ke saath
   → Period ke Day 1-3 mein lo specifically
   → Best for heavy flow + cramps combo
   → Brand: Baidyanath
   → Price: Powder ₹80-150/50g
   → DOSE TEEN (13-17): 1-2g shahad ke saath
   → DOSE ADULT (18+): 2-3g shahad ke saath
   → 🤰 PREGNANCY: ✅ Safe in small doses
   → 🤱 BREASTFEEDING: ✅ Safe
   → Side effects: Rare — stomach upset if excess
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 AYURVEDIC FORMULATIONS (Ready-made / तैयार औषधि):

6. ASHOKARISHTA (अशोकारिष्ट / અશોકારિષ્ટ)
   → Liquid formulation — fermented Ashoka bark based
   → 15-20ml + equal paani, khana ke baad
   → Din mein 2 baar (subah + raat)
   → MOST POPULAR Ayurvedic medicine for period problems
   → Pain + irregular flow + heavy bleeding — sab ke liye
   → Contains ~5-10% self-generated alcohol (fermentation)
   → Brand: Dabur ₹130-170 | Baidyanath ₹120-160 | Patanjali ₹100-130 (450ml)
   → DOSE TEEN (13-17): 10-15ml + equal paani, din mein 2 baar
   → DOSE ADULT (18+): 15-20ml + equal paani, din mein 2 baar
   → 🤰 PREGNANCY: ❌ AVOID — uterine stimulant hai
   → 🤱 BREASTFEEDING: ✅ Safe — milk bhi badhata hai
   → Side effects: Halka stomach warmth, acidity if empty stomach
   → Duration: 2-3 months regular use for best results
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. RAJAHPRAVARTINI VATI (राजःप्रवर्तिनी वटी / રાજઃપ્રવર્તિની વટી)
   → Tablet — classical formulation
   → 2 tablets subah shaam garam paani se
   → Irregular + painful periods dono ke liye
   → Apana Vayu ko regulate karta hai
   → Brand: Baidyanath ₹80-120 | Dhootapapeshwar ₹100-150 (40tab)
   → DOSE TEEN (13-17): 1 tablet din mein 2 baar
   → DOSE ADULT (18+): 2 tablets din mein 2 baar
   → 🤰 PREGNANCY: ❌❌ STRICTLY AVOID — emmenagogue
     (uterine contractions cause karta hai — miscarriage risk)
   → 🤱 BREASTFEEDING: ⚠️ Vaidya se pucho
   → Side effects: Excessive flow if overdosed
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. M2 TONE (Charak Pharma)
   → Modern Ayurvedic combination — syrup/tablet
   → Syrup: 2 tsp din mein 2 baar | Tablet: 2 din mein 2 baar
   → Ashoka + Lodhra + Shatavari + more herbs blend
   → Pain + irregular periods + hormonal balance
   → Very popular — easily available all pharmacies
   → Brand: Charak Pharma | Price: ₹150-220 (200ml/30tab)
   → DOSE TEEN (13-17): 1 tsp / 1 tablet din mein 2 baar
   → DOSE ADULT (18+): 2 tsp / 2 tablets din mein 2 baar
   → 🤰 PREGNANCY: ❌ AVOID
   → 🤱 BREASTFEEDING: ✅ Safe
   → Side effects: Rare — mild GI discomfort
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

9. KUMARYASAVA (कुमार्यासव / કુમાર્યાસવ)
   → Liquid — Aloe vera (Kumari/Ghritkumari) based
   → 15-20ml + equal paani, khana ke baad
   → Din mein 2 baar
   → Digestive + uterine tonic
   → Pitta prakriti women ke liye especially good
   → Brand: Dabur ₹120-160 | Baidyanath ₹110-150 (450ml)
   → DOSE TEEN (13-17): 10-15ml + equal paani
   → DOSE ADULT (18+): 15-20ml + equal paani
   → 🤰 PREGNANCY: ❌ AVOID
   → 🤱 BREASTFEEDING: ✅ Safe
   → Side effects: Loose stools if excess
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

10. PUSHYANUG CHURNA (पुष्यानुग चूर्ण / પુષ્યાનુગ ચૂર્ણ)
    → Classical powder formulation — multi-herb
    → 3-6g shahad ya ghee ke saath
    → Din mein 2 baar — khana ke baad
    → All menstrual problems ka broad-spectrum treatment
    → Brand: Baidyanath ₹80-130 | Dabur ₹90-140 (100g)
    → DOSE TEEN (13-17): 2-3g din mein 2 baar
    → DOSE ADULT (18+): 3-6g din mein 2 baar
    → 🤰 PREGNANCY: ❌ AVOID
    → 🤱 BREASTFEEDING: ⚠️ Consult Vaidya
    → Side effects: Constipation if excess
    → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

🍽️ AYURVEDIC DIET DURING PERIODS:
→ Garam, halka, easily digestible khana
→ Ghee: 1-2 tsp daily — Vata ko shant karta hai
→ Moong dal khichdi — sabse achha period food
→ Garam doodh + haldi + ghee raat ko
→ Taza pakaya hua khana — basi nahi
→ Small frequent meals — heavy ek baar nahi
→ Avoid: Cold, heavy, fried, fermented food
→ Avoid: Dahi (curd) period mein — Kapha badhata hai
→ Avoid: Baasi khana — Ama (toxins) badhta hai
→ Avoid: Excess salt — water retention

🛢️ AYURVEDIC EXTERNAL THERAPY (BAHYA CHIKITSA):
→ Til ka tel (sesame oil) — pet pe halka clockwise massage
→ Dhanwantaram Tailam — lower back massage
  (Brand: Kottakkal ₹180-250/200ml)
→ Dashmool Siddha Tail — abdominal massage
→ Warm Castor Oil (Erand tel) pack — 20 min pet pe
  (Kapda mein castor oil lagao, garam bottle upar)
→ Nadi Swedana — steam therapy on lower abdomen
→ Bala Tail — general body massage for pain

⚠️ AYURVEDA PRECAUTIONS:
→ Rajahpravartini Vati — PREGNANCY MEIN KABHI NAHI
→ Ashokarishta mein alcohol hai — alcohol sensitive avoid
→ Ashoka — high dose se constipation ho sakti hai
→ Dashmool kwath — empty stomach lena zyada effective
→ Koi bhi Ayurvedic medicine 3 month+ le rahe ho
  toh Vaidya se review zaroor karao
→ Ayurvedic + Allopathic saath lena ho toh
  2 ghante ka gap rakho minimum
→ Khaali pet Arishta/Asava mat lo — acidity

⚠️ SECTION DISCLAIMER:
Ye sab Ayurvedic information general guidance ke liye hai.
Har insaan ki Prakriti (constitution) alag hoti hai.
Koi bhi Ayurvedic medicine shuru karne se pehle
qualified Vaidya ya Ayurvedic Doctor se zaroor salah lein.`,
      modern: `💊 FIRST LINE — NSAIDs (Pain + Inflammation):

1. MEFENAMIC ACID 250mg / 500mg
   Hindi: मेफेनैमिक एसिड | Gujarati: મેફેનેમિક એસિડ
   Brand: Meftal (Blue Cross) | Ponstan (Pfizer) | Mefkind (Mankind)
   Price: ₹25-45 per strip (10 tablets)
   
   DOSE ADULT (18+):
   → 250-500mg din mein 3 baar
   → Khana ke baad — empty stomach KABHI NAHI
   → Har 8 ghante — regularly time pe lo
   → Max duration: 3 din continuous
   → Period start hote hi shuru karo — wait mat karo

   DOSE TEEN (13-17):
   → 250mg ONLY — din mein 2 baar max
   → Khana ke baad mandatory
   → Max 2 din continuous
   → Parent/guardian ko batao zaroor

   🤰 PREGNANCY: ❌ UNSAFE — AVOID COMPLETELY
      First trimester: Miscarriage risk badhta hai
      Third trimester: Baby ka ductus arteriosus premature
      close ho sakta hai — SERIOUS complication
   🤱 BREASTFEEDING: ⚠️ Short term (1-2 din) okay,
      but doctor se pucho — milk mein aata hai thoda

   HOW IT WORKS:
   → Prostaglandin production block karta hai
   → Prostaglandins = chemicals jo pain + cramps cause
   → Specifically period pain ke liye designed

   SIDE EFFECTS:
   → COMMON (10-20%): Acidity, pet mein jalan, nausea
   → UNCOMMON (1-5%): Chakkar aana, headache, dast
   → RARE (<1%): Stomach ulcer, kidney pe temporary effect
   → ALLERGIC (very rare): Skin rash, face swelling, saans
     mein taklif — TURANT BAND KARO + DOCTOR JAO
   → LONG TERM RISK: Stomach lining damage agar zyada use

   DRUG INTERACTIONS:
   → Blood thinners (Warfarin) ke saath NAHI
   → BP medicines ka effect kam kar sakta hai
   → Other NSAIDs ke saath NAHI (Ibuprofen saath nahi)
   → Alcohol ke saath NAHI — stomach bleeding risk

   TIPS:
   → Antacid saath lo (Pantoprazole 40mg) agar acidity ho
   → Doodh ke saath le sakte ho — stomach protection
   → Period start hone pe TURANT lo — wait mat karo

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. IBUPROFEN 200mg / 400mg
   Hindi: इबुप्रोफेन | Gujarati: ઇબુપ્રોફેન
   Brand: Brufen (Abbott) | Ibugesic (Cipla) | Combiflam (Sanofi - combo)
   Price: Brufen ₹15-25 | Ibugesic ₹10-20 | Combiflam ₹30-50 (10 tab)

   DOSE ADULT (18+):
   → 400mg har 6-8 ghante
   → Max: 1200mg/day (3 tablets of 400mg)
   → Khana ke saath lena zaroori hai
   → Max duration: 3 din

   DOSE TEEN (13-17):
   → 200mg har 8 ghante
   → Max: 600mg/day (3 tablets of 200mg)
   → Khana ke saath + paani zyada piyo
   → Max 2 din

   🤰 PREGNANCY: ❌ UNSAFE
      1st trimester: Miscarriage risk 2.4x badhta hai
      2nd trimester: Short-term okay ONLY if doctor says
      3rd trimester: ❌❌ STRICTLY AVOID — baby ke heart,
      kidney pe serious effect + amniotic fluid kam
   🤱 BREASTFEEDING: ✅ Safe — very low milk transfer
      (WHO approved for breastfeeding mothers)

   HOW IT WORKS:
   → COX-1 and COX-2 enzymes block karta hai
   → Pain + inflammation + fever — teeno kam
   → Prostaglandin synthesis rokta hai

   SIDE EFFECTS:
   → COMMON (10-20%): Pet dard, acidity, gas, nausea
   → UNCOMMON (1-5%): Headache, drowsiness, chakkar
   → RARE (<1%): Stomach bleeding, BP mein change
   → SERIOUS (very rare): Kidney damage (long term use),
     liver pe effect, heart risk (very long term)
   → ALLERGIC: Saans mein taklif, face/lips swelling
     — EMERGENCY — turant hospital jao

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

3. NAPROXEN 250mg / 500mg
   Hindi: नेप्रोक्सन | Gujarati: નેપ્રોક્સન
   Brand: Naprosyn (RPG) | Naxdom (Zydus) | Xenobid (Aristo)
   Price: ₹40-80 per strip (10 tablets)

   DOSE ADULT (18+):
   → 250-500mg din mein 2 baar
   → Khana ke saath
   → Longer acting — kam baar lena padta hai
   → Max duration: 3-5 din

   DOSE TEEN (13-17):
   → 250mg din mein 2 baar max
   → Khana ke saath zaroor
   → Max 2-3 din

   🤰 PREGNANCY: ❌ UNSAFE — Same as Ibuprofen
   🤱 BREASTFEEDING: ⚠️ Short term okay, consult doctor

   SIDE EFFECTS:
   → COMMON: Acidity, nausea, headache, drowsiness
   → UNCOMMON: Stomach pain, constipation, dizziness
   → RARE: GI bleeding, kidney issues
   → Stomach pe Ibuprofen se thoda zyada heavy

   ADVANTAGE: Lamba action — din mein sirf 2 baar
   DISADVANTAGE: Side effects slightly more

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 ANTISPASMODICS (Cramp/Spasm Relief):

4. DICYCLOMINE 10mg / 20mg
   Hindi: डाइसाइक्लोमीन | Gujarati: ડાઇસાઇક્લોમીન
   Brand: Cyclopam (Ind-Swift) | Meftal-Spas (Blue Cross - combo) | Colimex (WanBury)
   Price: Cyclopam ₹20-35 | Colimex ₹15-25 (10 tab)

   DOSE ADULT (18+):
   → 10-20mg din mein 3 baar
   → Khana se pehle ya baad — dono okay
   → Max duration: 3 din

   DOSE TEEN (13-17):
   → 10mg din mein 2 baar ONLY
   → Max 2 din

   🤰 PREGNANCY: ⚠️ Category B — doctor decide karega
      Generally avoid unless necessary
   🤱 BREASTFEEDING: ❌ AVOID — milk mein aata hai,
      baby mein colic badh sakta hai

   HOW IT WORKS:
   → Smooth muscle relaxant — anticholinergic
   → Uterine muscle ka spasm/cramp directly kholta hai
   → Fast acting — 15-30 min mein effect

   SIDE EFFECTS:
   → COMMON (15-25%): Drowsiness/neend, dry mouth, blurred vision
   → UNCOMMON: Constipation, difficulty urinating
   → RARE: Palpitation, confusion (elderly mein)
   → ⚠️ DROWSY KARTA HAI — Drive/bike/machine NAHI chalana
   → ⚠️ Alcohol ke saath KABHI NAHI — extreme drowsiness

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

5. DROTAVERINE 40mg / 80mg
   Hindi: ड्रोटावेरीन | Gujarati: ડ્રોટાવેરીન
   Brand: Drotin (Khandelwal) | No-Spa (Sanofi) | Doverin (Zydus)
   Price: Drotin ₹30-50 | No-Spa ₹50-80 (10 tab)

   DOSE ADULT (18+):
   → 40-80mg din mein 2-3 baar
   → Khana se pehle ya baad — dono okay
   → Max: 240mg/day

   DOSE TEEN (13-17):
   → 40mg din mein 2 baar
   → Max 2 din

   🤰 PREGNANCY: ⚠️ Used in labor — doctor supervision only
   🤱 BREASTFEEDING: ✅ Generally safe

   HOW IT WORKS:
   → Phosphodiesterase inhibitor — smooth muscle relaxant
   → Pure antispasmodic — painkiller nahi hai
   → Dicyclomine se LESS drowsy — better tolerated

   SIDE EFFECTS:
   → COMMON (5-10%): Headache, nausea, low BP feeling
   → UNCOMMON: Chakkar, constipation
   → RARE: Palpitation
   → ADVANTAGE: Drowsy NAHI karta — school/office ja sakte

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 COMBINATION MEDICINES (Most Popular in India):

6. MEFTAL-SPAS ★★★ MOST POPULAR IN INDIA
   Hindi: मेफ्टल-स्पास | Gujarati: મેફ્ટલ-સ્પાસ
   Composition: Mefenamic Acid 250mg + Dicyclomine 10mg
   Brand: Meftal-Spas (Blue Cross Labs)
   Price: ₹45-70 per strip (10 tablets)

   DOSE ADULT (18+):
   → 1 tablet din mein 3 baar khana ke baad
   → Max 3 din continuous
   → Period start hote hi shuru karo

   DOSE TEEN (13-17):
   → 1 tablet din mein 2 baar ONLY
   → Khana ke baad mandatory
   → Max 2 din

   🤰 PREGNANCY: ❌❌ UNSAFE — BILKUL MAT LO
   🤱 BREASTFEEDING: ❌ AVOID — dono ingredients risky

   WHY MOST POPULAR:
   → Pain (Mefenamic) + Spasm (Dicyclomine) = double action
   → Specifically period cramps ke liye designed
   → Almost har medical store pe milta hai India mein
   → Doctors sabse zyada prescribe karte hain

   SIDE EFFECTS:
   → Combines both drugs' side effects
   → Drowsiness + Acidity most common
   → Drive NAHI karna — neend aati hai
   → Dry mouth — paani zyada piyo

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

7. DROTIN-M
   Hindi: ड्रोटिन-एम | Gujarati: ડ્રોટિન-એમ
   Composition: Drotaverine 80mg + Mefenamic Acid 250mg
   Brand: Drotin-M (Khandelwal)
   Price: ₹55-80 per strip (10 tablets)

   DOSE ADULT (18+):
   → 1 tablet din mein 2-3 baar
   → Khana ke baad

   DOSE TEEN (13-17):
   → 1 tablet din mein 2 baar
   → Khana ke baad

   🤰 PREGNANCY: ❌ AVOID
   🤱 BREASTFEEDING: ⚠️ Consult doctor

   ADVANTAGE vs Meftal-Spas:
   → Drowsy NAHI karta — school/office ja sakte ho
   → Drotaverine > Dicyclomine for side effect profile
   → Equally effective for cramps

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

8. COMBIFLAM
   Hindi: कॉम्बिफ्लेम | Gujarati: કોમ્બિફ્લેમ
   Composition: Ibuprofen 400mg + Paracetamol 325mg
   Brand: Combiflam (Sanofi)
   Price: ₹30-50 per strip (10 tablets)

   DOSE ADULT (18+):
   → 1 tablet har 8 ghante
   → Max 3/day
   → Khana ke saath

   DOSE TEEN (13-17):
   → 1 tablet har 8-12 ghante
   → Max 2/day

   🤰 PREGNANCY:
   → 1st trimester: ❌ AVOID
   → 2nd trimester: ⚠️ Only if doctor says
   → 3rd trimester: ❌❌ STRICTLY AVOID
   🤱 BREASTFEEDING: ✅ Safe (both ingredients safe)

   NOTE: General pain relief — period specific nahi hai
   But easily available + effective for moderate pain

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 DOCTOR-PRESCRIBED ONLY (Advanced Treatment):

9. ORAL CONTRACEPTIVE PILLS (OCPs)
   → Hormonal treatment — periods regular + pain kam
   → ONLY on doctor's prescription — never self-medicate
   → Brand: Ovral-L ₹30-50 | Novelon ₹100-150 | Yasmin ₹250-350
   → 3-6 months course usually
   → Side effects: Nausea, headache, mood changes, weight
   → Benefits: Period pain 50-70% kam, flow lighter, regular

10. TRANEXAMIC ACID 500mg
    → Brand: Trenaxa ₹60-100 | Pause ₹50-80 (10 tab)
    → Heavy bleeding + cramps combo ke liye
    → ONLY when doctor prescribes
    → Not a painkiller — bleeding reducer hai

💊 DAILY SUPPLEMENTS (Prevention — Long Term):

11. MAGNESIUM 250-400mg daily
    → Magnesium Glycinate / Citrate — best absorbed
    → Brand: Now Foods ₹500-800 | HealthKart ₹300-500 (60 caps)
    → DOSE ALL AGES: 250-400mg daily (1 cap)
    → Muscle relaxant — cramps 30-40% kam (research proven)
    → Poore month lo, sirf periods mein NAHI — daily
    → Sleep bhi improve karta hai — bonus
    → 🤰 PREGNANCY: ✅ SAFE — recommended actually
    → Side effects: Loose stools agar zyada dose

12. OMEGA-3 FISH OIL 1000mg daily
    → EPA + DHA — anti-inflammatory
    → Brand: Seven Seas ₹300-500 | HealthKart ₹250-400 (60 caps)
    → Vegetarian: Flaxseed Oil caps ₹200-350
    → DOSE: 1000mg daily (1-2 caps)
    → 2-3 months regular use se prostaglandins kam
    → 🤰 PREGNANCY: ✅ SAFE — baby brain development bhi
    → Side effects: Fishy burps — freezer mein rakhke lo

13. VITAMIN B1 (THIAMINE) 100mg daily
    → Brand: Benfotiamine / Neurobion Forte ₹30-50 (10 tab)
    → RESEARCH: 87% women ko significant relief 
      (Cochrane Review — highest quality evidence)
    → Safe, cheap, easily available
    → 🤰 PREGNANCY: ✅ SAFE
    → Side effects: Almost none

14. CALCIUM 500mg + VITAMIN D3 1000IU
    → Brand: Shelcal-500 ₹100-150 | Calcirol ₹30-50 (10 tab)
    → DOSE: 1 tablet daily (preferably with dinner)
    → Muscle function improve — cramps kam
    → Periods ke alawa bones ke liye bhi zaruri
    → 🤰 PREGNANCY: ✅ ESSENTIAL — must take
    → Side effects: Constipation — paani zyada piyo

15. IRON + FOLIC ACID (Agar Hb low / heavy bleeding)
    → Brand: Autrin ₹60-100 | Orofer XT ₹80-120 (10 tab)
    → DOSE: 1 daily after lunch (iron absorption best)
    → Heavy periods = iron loss — replacement zaroori
    → Vitamin C saath lo (orange/nimbu) — absorption 3x
    → 🤰 PREGNANCY: ✅ ESSENTIAL — government mandated
    → Side effects: Black stool (normal), constipation, nausea
    → ⚠️ Chai/coffee iron absorption 50% kam karti hai
      — 2 ghante gap rakho

❌ MEDICINE DANGER ZONE — KABHI MAT LO:
→ Aspirin — period mein NAHI — bleeding badh sakti hai significantly
→ Khaali pet koi bhi NSAID — stomach ulcer/bleeding risk
→ 2 alag NSAIDs ek saath NAHI (Mefenamic + Ibuprofen together = danger)
→ 3 din se zyada continuous NSAIDs — doctor dikhao
→ Kidney problem mein Ibuprofen/Naproxen AVOID
→ Liver problem mein Paracetamol dose kam lo
→ Allergy history check karo — pehle kabhi reaction aaya?
→ Alcohol + ANY painkiller = stomach bleeding risk

🤰 PREGNANCY SAFE LIST (Period-like cramps in pregnancy):
→ ✅ Paracetamol 500mg — ONLY safe painkiller
→ ❌ Ibuprofen — AVOID
→ ❌ Mefenamic — AVOID
→ ❌ Aspirin — AVOID (unless doctor specifically prescribes low-dose)
→ ❌ Meftal-Spas — AVOID
→ ✅ Hot water bottle — safe
→ ✅ Ginger tea — safe in moderation (3 cups max)
→ ⚠️ ANY pain in pregnancy — ALWAYS consult doctor first

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Yeh section sirf educational aur general awareness ke liye hai.
Koi bhi medicine lene se pehle QUALIFIED DOCTOR ya PHARMACIST
se zaroor salah lein. Har insaan ka body alag hota hai —
ek medicine jo kisi ko suit kare, doosre ko nuksaan kar sakti hai.
Self-medication serious health risks cause kar sakta hai.
NutriMama medical diagnosis ya prescription provide NAHI karta.
Yeh sirf informational guidance hai.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — WITHIN 1 HOUR (Ambulance 108 call karo):` },
      { severity: "YELLOW", text: `WITHIN 24 HOURS — URGENT (Doctor appointment turant lo):` },
    ],
    relatedIds: [2, 3],
  },
  {
    id: 2,
    slug: "irregular-periods",
    name: `Irregular Periods`,
    nameHi: `अनियमित माहवारी`,
    nameGu: `અનિયમિત માસિક`,
    emoji: "📅",
    category: "MENSTRUAL",
    summary: `Irregular periods means cycles shorter than 21 days, longer than 35 days, or unpredictable. Common causes include PCOS, thyroid issues, stress, weight changes, and perimenopause. Tracking patterns and identifying the root cause is the first step.`,
    whoGetsIt: `- 14-25% reproductive age women
- PCOS affects 1 in 5 Indian women
- First 2-3 years after menarche — normal (60% girls)
- Stress-related — extremely common in students/working women
- Thyroid disorders — 10% Indian women
- Athletes, dancers — over-exercise related

📊 WHEN TO WORRY vs WHEN NOT TO:
NORMAL — DON'T WORRY:
→ First 2-3 years of periods — body adjusting
→ 2-3 din aage peeche — normal variation hai
→ Stressful exam/event ke baad 1 month skip
→ Travel/schedule change ke baad
→ Just stopped birth control pills — 3 months tak normal

NEED ATTENTION:
→ Cycle consistently <21 din ya >35 din
→ 3+ months no period (pregnancy rule out ke baad)
→ Pattern suddenly change hua — pehle regular tha
→ Heavy bleeding WITH irregular pattern
→ Unusual weight gain + irregular + acne — PCOS?
→ Age 16+ — periods abhi tak shuru nahi hue`,
    sections: {
      overview: `Normal menstrual cycle 21-35 din ka hota hai. Agar periods
har month alag date pe aa rahe hain, ya cycle 35 din se zyada
ya 21 din se kam ka hai, ya 3+ months period nahi aaya — toh
yeh irregular periods hai.

TYPES:
OLIGOMENORRHEA: Cycle 35 din se zyada — periods rare/infrequent
POLYMENORRHEA: Cycle 21 din se kam — periods zyada frequent
METRORRHAGIA: Periods ke beech mein bleeding (inter-menstrual)
AMENORRHEA: 3+ months period nahi aaya (not pregnant)

COMMON CAUSES:
→ HORMONAL: PCOS (sabse common), thyroid, prolactin high
→ STRESS: Cortisol hormones disturb karta hai — very common
→ WEIGHT: Too thin (BMI<18.5) ya too heavy (BMI>30)
→ EXERCISE: Excessive exercise — athletes mein common
→ AGE: First 2-3 years of periods — normal irregular hona
→ AGE: 40+ approaching menopause — normal
→ DIET: Extreme dieting, eating disorders
→ MEDICAL: Uterine fibroids, polyps, endometriosis
→ MEDICATIONS: Contraceptive pills, steroids
→ TRAVEL: Jet lag, schedule change
→ BREASTFEEDING: Lactational amenorrhea — normal`,
      gharelu: `⚡ MOST EFFECTIVE HOME REMEDIES:

1. ADRAK (GINGER / अदरक / આદુ)
   → 1 inch fresh adrak — grate karo
   → 1 cup paani mein 5 min ubalo + shahad
   → Din mein 2-3 baar — period expected date se 7 din pehle
   → Emmenagogue — period laane mein madad karta hai
   → Blood flow uterus mein badhata hai
   → Research: Ginger significantly effective for oligomenorrhea

2. KACHCHA PAPITA (Raw Papaya / कच्चा पपीता / કાચું પપૈયું)
   → Green papaya daily khaao — sabzi ya salad
   → Period se 5-7 din pehle regular khaao
   → Papain enzyme — uterine contractions stimulate
   → Carotene — estrogen production support
   → ⚠️⚠️ PREGNANCY MEIN BILKUL NAHI — miscarriage risk

3. HALDI (TURMERIC / हल्दी / હળદર)
   → 1/4 tsp haldi + 1 tsp shahad + garam doodh
   → Daily raat ko — hormonal balance
   → Curcumin = anti-inflammatory + emmenagogue
   → Uterine blood flow improve karta hai
   → Safe for long term daily use

4. DALCHINI (CINNAMON / दालचीनी / તજ)
   → 1/2 tsp powder garam paani ya doodh mein
   → Din mein 2 baar — 3 months continue
   → RESEARCH: Significantly improves menstrual cyclicity
     in PCOS women (Columbia University study)
   → Insulin resistance bhi improve — PCOS mein bonus
   → Blood sugar balance — weight bhi help

5. ALSI (FLAXSEED / अलसी / અળસી)
   → 1-2 tbsp freshly ground daily
   → Smoothie, dahi, roti mein mix karo
   → Lignans — phytoestrogen — hormonal balance
   → Omega-3 — anti-inflammatory
   → 3 months regular use — cycle improve hota hai
   → Research supported for menstrual regularity

6. TIL (SESAME / तिल / તલ)
   → 1-2 tsp daily — chabao ya ladoo
   → Til + gur combination = powerful
   → Warming nature — blood flow improve
   → Zinc, magnesium — hormone production support
   → Traditionally used to bring on delayed periods

7. AJWAIN + GUR (Carom Seeds + Jaggery)
   → 1 tsp ajwain + 1 tsp gur
   → Garam paani mein ubaal ke piyo
   → Subah khali pet — period expected date se 5 din pehle
   → Uterine stimulant — period flow shuru karta
   → Antispasmodic — agar cramp bhi aaye toh manage

8. ALOE VERA / GHRITKUMARI (एलोवेरा / ઘૃતકુમારી)
   → 2 tbsp fresh gel + 1 tsp shahad
   → Subah khali pet daily
   → Hormonal balancer — menstrual regulator
   → Uterine tonic — reproductive health improve
   → ⚠️ PREGNANCY MEIN AVOID — uterine contractions
   → ⚠️ Period ke DAURAN mat lo — flow zyada ho sakta

9. SAUNF (FENNEL / सौंफ / વરિયાળી)
   → 2 tsp saunf 1 glass paani mein raat ko bhigao
   → Subah khali pet piyo + saunf chabao
   → Phytoestrogen — menstrual regulation
   → Antispasmodic — agar dard bhi ho toh relief
   → Very safe — teen girls bhi regularly le sakti

10. CARROT + BEETROOT JUICE (गाजर + चुकंदर / ગાજર + બીટ)
    → 1 glass mixed juice daily
    → Iron rich — blood production boost
    → Beta-carotene — hormonal support
    → Beetroot specifically — uterine blood flow improve
    → Taste: Add apple/orange juice to sweeten

🍽️ DIETARY CHANGES:
→ Iron rich: Palak, chana, rajma, gur, dates, beetroot
→ Vitamin C: Amla, orange, nimbu — iron absorption
→ Zinc: Pumpkin seeds, kaju, til — hormone production
→ Healthy fats: Ghee, coconut oil, nuts — hormone synthesis
→ Protein: Dal, paneer, eggs, chicken — building blocks
→ Complex carbs: Jowar, bajra, brown rice — blood sugar stable
→ AVOID: Excess sugar, refined carbs, processed food
→ AVOID: Extreme dieting / crash diets — worst for periods
→ AVOID: Excess caffeine — max 2 cups daily
→ AVOID: Soy in excess — phytoestrogen overload

🏃 LIFESTYLE CHANGES:
→ Weight management — BMI 18.5-24.9 target
  (Even 5% weight loss in overweight = periods improve)
→ Exercise: 30 min moderate — walk, yoga, swim
  (NOT excessive — over-exercise causes irregularity)
→ Sleep: 7-8 hours regular time pe — circadian rhythm
→ Stress reduction: Meditation, pranayam, journaling
→ Screen time before bed kam karo — melatonin disturb
→ Maintain routine — body clock loves consistency`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Irregular periods = Anartava ya Kashtartava — primarily
Vata dosha vitiation. Vata responsible hai for all movements
in body, including downward flow of menstruation (Apana Vayu).
When Vata disturbed → flow disturbed → irregular periods.

🌿 SINGLE HERBS:

1. ASHOKA / अशोक / અશોક (Saraca Indica) — ★ BEST
   → 3-6g bark powder doodh ke saath daily
   → Ya Ashoka Ghana Vati: 2 tablets 2 baar
   → Uterine tonic — regulates menstrual cycle
   → Brand: Himalaya, Baidyanath
   → Price: ₹80-150/100g powder | ₹120-200/60 tab
   → DOSE TEEN: 2-3g ya 1 tab 2 baar
   → DOSE ADULT: 3-6g ya 2 tab 2 baar
   → 🤰 PREGNANCY: ⚠️ AVOID
   → Duration: 3-6 months for cycle regulation
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. SHATAVARI / शतावरी / શતાવરી — ★ SAFEST HERB
   → 1 tsp churna garam doodh mein — raat ko
   → Ya 500mg tablet 2 baar
   → Hormonal balance + reproductive tonic
   → Estrogen modulator — cycle regular karta
   → Brand: Himalaya ₹180-250 | Organic India ₹200-350
   → DOSE TEEN: 1/2 tsp ya 1 tab 2 baar
   → DOSE ADULT: 1 tsp ya 2 tab 2 baar
   → 🤰 PREGNANCY: ✅ SAFE
   → 🤱 BREASTFEEDING: ✅ EXCELLENT
   → Duration: 3-6 months continuous
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. KUMARI / GHRITKUMARI (Aloe Vera)
   → Kumari Asava: 15-20ml + equal paani after food
   → Ya fresh gel: 2 tbsp daily
   → Pitta shamak — cooling + hormone balance
   → Brand: Dabur, Baidyanath ₹120-180/450ml
   → 🤰 PREGNANCY: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. GUDUCHI / GILOY / ગળો (Tinospora Cordifolia)
   → 500mg tablet din mein 2 baar
   → Ya Guduchi satva: 1/2 tsp garam paani mein
   → Immunomodulator + hormonal balance
   → Stress-induced irregularity mein especially good
   → Brand: Himalaya ₹120-180 | Patanjali ₹80-120
   → 🤰 PREGNANCY: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. JATAMANSI / जटामांसी (Nardostachys Jatamansi)
   → 1-3g churna doodh ya shahad ke saath
   → Nervine tonic — stress-related irregularity mein best
   → Brain + reproductive axis ko connect karta hai
   → Brand: Baidyanath ₹150-250/50g
   → 🤰 PREGNANCY: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 AYURVEDIC FORMULATIONS:

6. ASHOKARISHTA — 15-20ml + paani, 2 baar, after food
   → Best for all menstrual irregularities
   → (Full details in Condition #1 above)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. RAJAHPRAVARTINI VATI — 2 tab, 2 baar, garam paani se
   → Specifically for delayed/absent periods
   → Strong emmenagogue — period laata hai
   → Brand: Baidyanath ₹80-120/40tab
   → TEEN: 1 tab 2 baar
   → ❌❌ PREGNANCY: STRICTLY AVOID
   → Use only 5-7 din max — strong formula
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. DASHMOOLARISHTA — 15-20ml + paani, 2 baar
   → Vata shamak — cycle regulation
   → Post-delivery recovery mein bhi excellent
   → Brand: Dabur ₹120-170 | Baidyanath ₹110-160
   → 🤰: ❌ AVOID during pregnancy, ✅ post-delivery
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

9. CHANDRAPRABHA VATI — 2 tab, 2 baar, garam paani
   → Hormonal balance + urinary health
   → PCOS-related irregularity mein helpful
   → Brand: Baidyanath ₹100-160/80tab | Patanjali ₹60-90
   → TEEN: 1 tab 2 baar
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

10. PHALA GHRITA — 1-2 tsp daily
    → Medicated ghee — reproductive health
    → Fertility + cycle regulation
    → Brand: Kottakkal ₹200-350/200ml
    → 🤰: ✅ Safe — traditionally used for conception
    → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

🍽️ AYURVEDIC DIET:
→ Warm, fresh, cooked food — agni (digestive fire) strong
→ Ghee 1-2 tsp daily — hormone building block
→ Til, dates, almonds — reproductive nutrients
→ Avoid cold, raw, leftover food
→ Avoid excess curd — Kapha badhata
→ Drink warm water throughout day
→ Eat at regular times — routine builds rhythm

⚠️ SECTION DISCLAIMER:
Ye sab Ayurvedic information general guidance ke liye hai.
Har insaan ki Prakriti alag hoti hai. Koi bhi Ayurvedic
medicine shuru karne se pehle qualified Vaidya ya
Ayurvedic Doctor se zaroor salah lein.`,
      modern: `💊 HORMONAL TREATMENTS (Doctor Prescribed Only):

1. ORAL CONTRACEPTIVE PILLS (OCPs)
   Hindi: गर्भनिरोधक गोलियाँ | Gujarati: ગર્ભનિરોધક ગોળીઓ
   
   LOW DOSE COMBINED OCPs:
   → Brand: Novelon ₹100-150 | Ovral-L ₹25-40 |
     Yasmin ₹250-350 | Femilon ₹80-120 (21-28 tab pack)
   → How: 1 pill daily — same time — 21 days on, 7 days off
   → Estrogen + Progesterone — cycle regulate karta hai
   → Benefits: Regular periods, less pain, lighter flow
   → Takes: 2-3 months to regulate fully
   
   DOSE TEEN (16-17): Low-dose only, doctor supervision
   DOSE ADULT (18+): As prescribed by gynecologist
   
   🤰 PREGNANCY: ❌ STOP immediately if pregnant
   🤱 BREASTFEEDING: ⚠️ Progesterone-only (mini-pill) okay
   
   SIDE EFFECTS:
   → COMMON: Nausea (first 1-3 months), headache
   → COMMON: Breast tenderness, mood swings
   → UNCOMMON: Weight gain (2-3 kg), spotting
   → RARE: Blood clots (risk very low but serious)
   → RISK: Smokers 35+ = significantly higher clot risk
   
   WHO SHOULD NOT TAKE:
   → Smokers age 35+
   → History of blood clots
   → Migraine with aura
   → Breast cancer history
   → Uncontrolled hypertension
   → Liver disease active
   
   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. PROGESTERONE-ONLY MEDICINES
   
   MEDROXYPROGESTERONE ACETATE (MPA) 10mg
   → Brand: Deviry ₹50-80 | Meprate ₹40-60 (10 tab)
   → How: 10mg daily for 10 days — period aayega 3-7 din baad
   → Used for: Delayed period ko laane ke liye
   → Cycle: Doctor batayega kab shuru, kab band
   
   NORETHISTERONE 5mg
   → Brand: Primolut-N ₹30-50 (10 tab)
   → How: 5mg 2-3 baar daily
   → Used for: Period postpone karne ke liye bhi
   → Also for: Irregular bleeding control
   
   BOTH:
   → DOSE: Only as doctor prescribes — self-adjust NAHI
   → 🤰 PREGNANCY: ❌ AVOID — rule out pregnancy first
   → SIDE EFFECTS: Bloating, mood changes, headache, breast pain
   
   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

3. METFORMIN 500mg (For PCOS-related irregularity)
   Hindi: मेटफॉर्मिन | Gujarati: મેટફોર્મિન
   → Brand: Glycomet ₹15-25 | Obimet ₹20-30 (10 tab)
   → How: 500mg 1-2 baar daily, khana ke saath
   → WHY: Insulin resistance fix → hormones balance → periods regular
   → Specifically for PCOS patients — not general use
   → Takes: 2-3 months to show cycle improvement
   
   DOSE: Doctor decides — usually start low, increase gradually
   🤰 PREGNANCY: ⚠️ Some doctors continue — discuss
   
   SIDE EFFECTS:
   → COMMON: Nausea, diarrhea, gas (first 2 weeks)
   → UNCOMMON: Metallic taste, appetite kam
   → TIP: Khana ke saath lo — GI side effects 50% kam
   → Start with 500mg once daily, slowly increase
   
   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 SUPPLEMENTS FOR IRREGULAR PERIODS:

4. INOSITOL (Myo-Inositol) 2000mg + D-Chiro-Inositol 50mg
   → Brand: Conceive Plus ₹400-600 | Inofolic ₹500-800 (30 sachets)
   → How: 1 sachet daily in water
   → RESEARCH: Significantly improves cycle regularity in PCOS
   → Ovulation restore karta hai — fertility bhi improve
   → Side effects: Almost none — very safe
   → 🤰 PREGNANCY: ✅ Safe — conception mein help
   → Duration: 3-6 months minimum

5. VITAMIN D3 (if deficient — 70% Indian women are!)
   → Brand: D-Rise 60K ₹30-50/4 capsules | Calcirol ₹15-25
   → How: 60,000 IU once weekly for 8 weeks (if deficient)
     Then maintenance: 1000-2000 IU daily
   → WHY: Vitamin D deficiency = hormonal imbalance = irregular
   → Get TESTED first — 25-OH Vitamin D blood test
   → 🤰 PREGNANCY: ✅ Essential
   → Side effects: Rare at normal doses

6. ZINC 15-30mg daily
   → Brand: Zinc supplements ₹100-200/60 tab
   → Hormone production support
   → Progesterone balance — luteal phase support
   → Food sources: Pumpkin seeds, kaju, chana
   → 🤰 PREGNANCY: ✅ Safe (up to 40mg)

7. VITAMIN B6 50-100mg daily
   → Progesterone support — luteal phase
   → PMS symptoms kam karta hai
   → Brand: Neurobion Forte ₹30-50
   → 🤰 PREGNANCY: ✅ Safe (up to 100mg)

💊 TESTS DOCTOR RECOMMEND KAREGA:
→ Thyroid Profile: TSH, T3, T4 — ₹300-500
→ Hormonal Panel: FSH, LH, Prolactin, Estradiol — ₹800-1500
→ PCOS Check: LH/FSH ratio, Testosterone, DHEA-S — ₹1000-2000
→ Ultrasound Pelvis: Uterus + ovaries check — ₹500-1000
→ CBC: Complete blood count — ₹200-400
→ Blood Sugar: Fasting + PP — ₹200-300
→ Vitamin D level — ₹500-800
→ HbA1c (if PCOS suspected) — ₹300-500
→ AMH (fertility assessment) — ₹1000-2000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Yeh section sirf educational aur general awareness ke liye hai.
Koi bhi medicine lene se pehle QUALIFIED DOCTOR ya PHARMACIST
se zaroor salah lein. Har insaan ka body alag hota hai.
Self-medication serious health risks cause kar sakta hai.
NutriMama medical diagnosis ya prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY:` },
      { severity: "YELLOW", text: `WITHIN 1 WEEK:` },
    ],
    relatedIds: [3],
  },
  {
    id: 3,
    slug: "pcos",
    name: `PCOS / PCOD`,
    nameHi: `पॉलीसिस्टिक ओवरी सिंड्रोम`,
    nameGu: `પોલીસિસ્ટિક ઓવરી સિન્ડ્રોમ`,
    emoji: "🌺",
    category: "PCOS_HORMONAL",
    summary: `PCOS (Polycystic Ovary Syndrome) is a hormonal disorder affecting 10-20% of Indian women. It causes irregular periods, excess androgens, and often insulin resistance. Lifestyle changes are the cornerstone of treatment, with medication added as needed.`,
    whoGetsIt: `- 1 in 5 Indian women (20%) — bahut common
- Urban women mein slightly zyada — lifestyle factors
- Often starts at puberty — diagnosed in 20s-30s
- Family history ho toh 50% zyada chances
- Increasing rapidly — junk food + sedentary lifestyle
- 60-70% PCOS women have insulin resistance
- 40-60% PCOS women are overweight/obese
- BUT thin women ko bhi ho sakta hai — "lean PCOS"

📊 SYMPTOMS:
MENSTRUAL:
→ Irregular periods — 35+ din cycle ya skip
→ Very light periods ya bahut heavy
→ No period for months (amenorrhea)
→ Difficulty getting pregnant (anovulation)

HORMONAL (ANDROGEN EXCESS):
→ Acne — jawline, chin, back pe especially
→ Hirsutism — face, chest, back pe unwanted hair
→ Hair thinning/loss on head (androgenic alopecia)
→ Oily skin
→ Skin tags — neck, armpits mein

METABOLIC:
→ Weight gain — especially belly fat (central obesity)
→ Difficulty losing weight — bahut frustrating
→ Acanthosis nigricans — neck/armpits mein dark patches
→ Fatigue / low energy
→ Sugar cravings — insulin resistance ki wajah se

EMOTIONAL:
→ Anxiety, depression — hormone related
→ Mood swings — especially before periods
→ Low self-esteem — acne, weight, hair issues
→ Sleep problems — cortisol imbalance`,
    sections: {
      overview: `PCOS ek hormonal disorder hai jismein ovaries mein chhote chhote
cysts (fluid-filled sacs) ban jaate hain. Hormones imbalanced
ho jaate hain — androgens (male hormones) badh jaate hain.
Isse periods irregular hote hain, weight badhta hai, acne aata hai,
unwanted hair growth hota hai, aur fertility pe bhi asar padta hai.

PCOS vs PCOD — KYA FARAK HAI?
→ PCOD (Polycystic Ovarian Disease): Milder form
  — Ovaries mein immature eggs collect hote hain
  — Lifestyle changes se manage ho sakta hai
  — Fertility pe kam asar — conceive kar sakti hain

→ PCOS (Polycystic Ovary Syndrome): More serious
  — Hormonal imbalance + metabolic issues
  — Insulin resistance common
  — Fertility pe zyada asar — treatment chahiye
  — Diabetes, heart disease risk badhta hai

ROTTERDAM CRITERIA (Diagnosis — 3 mein se 2):
1. Irregular/absent periods (oligo/anovulation)
2. High androgens — blood test ya symptoms (acne, hair)
3. Polycystic ovaries on ultrasound (12+ follicles)`,
      gharelu: `⚡ MOST EFFECTIVE HOME REMEDIES FOR PCOS:

1. DALCHINI (CINNAMON / दालचीनी / તજ) — ★ RESEARCH PROVEN
   → 1/2 tsp powder garam paani mein — din mein 2 baar
   → Ya 1 inch dalchini stick chai mein
   → RESEARCH: Columbia University study — significantly
     improves menstrual cyclicity in PCOS
   → Insulin sensitivity improve karta hai — key PCOS issue
   → Blood sugar spikes kam karta hai
   → 3 months continuous use se best results
   → ⚠️ Max 1 tsp/day — zyada se liver pe effect

2. METHI DANA (FENUGREEK / मेथी / મેથી) — ★ RESEARCH PROVEN
   → 1 tsp methi dana raat ko paani mein bhigao
   → Subah khali pet paani piyo + dana chabao
   → Ya methi powder 1/2 tsp daily
   → RESEARCH: Fenugreek extract significantly improves
     LH/FSH ratio + ovarian volume in PCOS
   → Insulin sensitizer — blood sugar balance
   → Weight loss support karta hai
   → 🤰 PREGNANCY: ⚠️ AVOID high doses — uterine stimulant

3. ALSI (FLAXSEED / अलसी / અળસી)
   → 1-2 tbsp freshly ground daily
   → Smoothie, dahi, roti mein
   → Lignans — anti-androgen effect
   → Testosterone kam karta hai — acne/hair issues help
   → Omega-3 — inflammation kam
   → SHBG (Sex Hormone Binding Globulin) badhata hai
   → 3 months regular use se visible difference

4. PUDINA (SPEARMINT TEA / पुदीना / ફુદીનો) — ★ ANTI-ANDROGEN
   → 2 cups spearmint tea daily (regular mint nahi — SPEARMINT)
   → Fresh leaves ya dried — garam paani mein steep
   → RESEARCH: Spearmint tea significantly reduces
     free testosterone levels in PCOS women
   → Hirsutism (unwanted hair) kam karta hai
   → Safe, tasty, easy — best anti-androgen home remedy
   → Buy: "Spearmint" specifically — not peppermint

5. APPLE CIDER VINEGAR (ACV / सेब का सिरका)
   → 1-2 tsp in 1 glass water — before meals
   → Din mein 2 baar — lunch + dinner se pehle
   → Insulin sensitivity improve karta hai
   → Blood sugar spike after meals kam
   → Weight loss support
   → ⚠️ Dilute ZAROOR karo — neat mat piyo (teeth damage)
   → ⚠️ Straw se piyo — enamel protection

6. HALDI (TURMERIC / हल्दी / હળદર)
   → 1 tsp haldi + garam doodh + kaali mirch + ghee
   → Daily raat ko
   → Curcumin — anti-inflammatory + insulin sensitizer
   → Hormonal balance support
   → Safe for long term daily use

7. AMLA (INDIAN GOOSEBERRY / आंवला / આમળાં)
   → 1-2 fresh amla daily ya amla juice 30ml
   → Ya amla powder 1 tsp garam paani mein
   → Vitamin C powerhouse — antioxidant
   → Blood sugar control — research proven
   → Liver detox — hormone metabolism improve
   → Weight management support

8. KARELA (BITTER GOURD / करेला / કારેલું)
   → 1 small karela juice — 30ml daily
   → Ya karela sabzi 2-3 times/week
   → Insulin sensitizer — blood sugar control
   → Bitter taste = liver cleansing
   → ⚠️ Taste bitter — mix with nimbu + kala namak
   → ⚠️ Excess se hypoglycemia — moderation mein

🥗 PCOS DIET — MOST IMPORTANT TREATMENT:

WHAT TO EAT:
→ HIGH FIBRE: Oats, daliya, jowar roti, bajra, vegetables
  (Fibre = slow sugar release = insulin stable)
→ LEAN PROTEIN: Eggs, chicken, fish, paneer, dal, tofu
  (Protein = satiety + muscle + hormone building)
→ HEALTHY FATS: Ghee, coconut oil, nuts, seeds, avocado
  (Fat = hormone production + satisfaction)
→ LOW GI FRUITS: Apple, pear, berries, papaya, orange
  (Low GI = no sugar spike)
→ ANTI-INFLAMMATORY: Haldi, adrak, green leafy, tomato
→ ZINC: Pumpkin seeds, cashew, chana — testosterone reduce
→ CHROMIUM: Broccoli, whole grains — insulin sensitivity
→ OMEGA-3: Fish, walnuts, flaxseed — inflammation reduce

WHAT TO AVOID:
→ SUGAR: Meetha, mithai, cold drinks, candy — insulin spike
  (BIGGEST trigger for PCOS symptoms)
→ REFINED CARBS: Maida, white bread, pasta, naan
  (Behave like sugar in body — spike + crash)
→ PROCESSED FOOD: Chips, biscuits, instant noodles
→ DAIRY (some women): Doodh, paneer excess — androgens badh
  (Try removing 1 month — see if symptoms improve)
→ SOY EXCESS: Phytoestrogen overload
→ TRANS FATS: Vanaspati ghee, bakery items, fried snacks
→ ALCOHOL: Liver pe load — hormone clearance slow

MEAL TIMING:
→ Regular meals — skip NAHI karna — blood sugar stable
→ Protein + fat + fibre EVERY meal
→ No carbs alone — always pair with protein
→ Last meal 3 hours before sleep
→ Dinner light — lunch heavy

🏃 EXERCISE — SECOND MOST IMPORTANT:
→ 30-45 min daily — 5 days/week minimum
→ BEST: Combination of:
  - Brisk walking/jogging — 20 min
  - Strength training — weights, resistance bands
    (Muscle mass badhi = insulin sensitivity improve)
  - Yoga — stress reduce + hormone balance
→ AVOID: Excessive cardio — cortisol badhta = worse PCOS
→ RESEARCH: Exercise alone can restore ovulation in
  some PCOS women without any medicine`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
PCOS = Kapha + Vata dushti primarily.
Kapha = cyst formation, weight gain, sluggish metabolism
Vata = irregular cycles, pain, anxiety
Pitta = acne, inflammation, anger
Treatment: Kapha + Ama (toxins) reduce karna zaroori.

🌿 KEY HERBS FOR PCOS:

1. SHATAVARI / शतावरी / શતાવરી
   → 1 tsp churna doodh mein — 2 baar
   → Hormonal balance + ovarian health
   → Brand: Himalaya ₹180-250 | Organic India ₹200-350
   → TEEN: 1/2 tsp 2 baar | ADULT: 1 tsp 2 baar
   → 🤰: ✅ SAFE | Duration: 3-6 months
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. KANCHNAR (BAUHINIA / कांचनार / કાંચનાર)
   → Kanchnar Guggulu tablets: 2 tab 2 baar garam paani se
   → BEST for cyst reduction — dissolves abnormal growths
   → Thyroid + PCOS dono mein effective
   → Brand: Baidyanath ₹100-160/80tab | Patanjali ₹60-90
   → TEEN: 1 tab 2 baar | ADULT: 2 tab 2 baar
   → 🤰: ❌ AVOID (Guggulu)
   → Duration: 3-6 months for cyst reduction
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. GUDUCHI / GILOY / ગળો
   → 500mg tablet 2 baar
   → Immunomodulator + insulin sensitizer
   → PCOS inflammation reduce karta hai
   → Brand: Himalaya ₹120-180
   → 🤰: ⚠️ Consult | Duration: 3 months
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. TRIPHALA (Three Fruits Combination)
   → 1 tsp churna garam paani mein — raat ko sone se pehle
   → Digestive cleanser — Ama (toxins) remove
   → Weight management — metabolism boost
   → Brand: Any ₹50-100/100g
   → Safe for all ages — gentle action
   → 🤰: ⚠️ AVOID in pregnancy (mild laxative)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. ASHWAGANDHA / अश्वगंधा / અશ્વગંધા
   → 500mg-1g churna doodh mein — raat ko
   → Ya KSM-66 tablet: 600mg daily
   → Cortisol reduce — stress hormones balance
   → Insulin sensitivity improve karta hai
   → Thyroid + PCOS combo mein especially good
   → Brand: KSM-66 ₹400-600 | Himalaya ₹200-300
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ❌ AVOID — may cause miscarriage
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

6. VARUNA / VARUN (Crataeva Nurvala)
   → Cyst dissolving property — traditional use
   → Often combined with Kanchnar
   → 500mg tablet 2 baar
   → Brand: Baidyanath
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
7. CHANDRAPRABHA VATI — 2 tab 2 baar
   → Hormonal + urinary + metabolic balance
   → Brand: Baidyanath ₹100-160/80tab
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. KAISHORE GUGGULU — 2 tab 2 baar
   → Anti-inflammatory + blood purifier
   → Acne + skin issues mein helpful
   → Brand: Baidyanath ₹80-130/80tab
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

9. SUKUMARA KASHAYAM — 15ml 2 baar before food
   → Reproductive tonic — ovarian function improve
   → Brand: Kottakkal ₹150-250/200ml
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

PANCHAKARMA FOR PCOS:
→ Vamana (therapeutic emesis) — Kapha reduce
→ Virechana (purgation) — toxin removal
→ Basti (medicated enema) — Vata balance
→ Uttara Basti — directly reproductive organ treatment
→ Udwarthanam — dry powder massage — weight + skin
→ ⚠️ Only under qualified Panchakarma specialist

⚠️ SECTION DISCLAIMER:
Ye sab Ayurvedic information general guidance ke liye hai.
PCOS ek complex condition hai jismein proper diagnosis aur
monitoring zaroori hai. Koi bhi Ayurvedic medicine shuru
karne se pehle qualified Vaidya se zaroor salah lein.
Allopathic treatment chal raha hai toh Ayurvedic saath
mein lena ho toh DONO doctors ko batao.`,
      modern: `💊 FIRST LINE TREATMENTS:

1. METFORMIN 500mg / 850mg / 1000mg
   Hindi: मेटफॉर्मिन | Gujarati: મેટફોર્મિન
   Brand: Glycomet (USV) | Obimet (Abbott) | Glucophage (Merck)
   Price: Glycomet 500mg ₹15-25 | 1000mg ₹25-40 (10 tab)

   DOSE ADULT (18+):
   → Start: 500mg once daily with dinner
   → Week 2: 500mg twice daily (breakfast + dinner)
   → Max: 1500-2000mg/day (doctor decides)
   → Always with food — empty stomach = nausea
   → Extended Release (SR/XR) = less GI side effects

   DOSE TEEN (15-17):
   → Start: 500mg once daily with dinner
   → Max: 1000mg/day
   → Doctor supervision mandatory

   🤰 PREGNANCY: ⚠️ Some doctors continue through pregnancy
     (helps prevent gestational diabetes in PCOS)
     Doctor decides — don't stop/start yourself
   🤱 BREASTFEEDING: ✅ Safe — minimal milk transfer

   WHY IT WORKS IN PCOS:
   → Reduces insulin resistance (ROOT CAUSE in 70% PCOS)
   → Lower insulin → lower androgens → less acne/hair
   → Periods become more regular
   → Ovulation may resume — fertility improve
   → Helps weight loss (not directly — through insulin)
   → May reduce cyst size over time

   SIDE EFFECTS:
   → COMMON (30-50% initially): Nausea, diarrhea, gas,
     stomach cramps — usually SETTLES in 2-4 weeks
   → UNCOMMON: Metallic taste, appetite reduction
   → RARE: Vitamin B12 deficiency (long term — test yearly)
   → VERY RARE: Lactic acidosis (kidney patients only)
   → TIP: Start LOW, go SLOW — 500mg se shuru, slowly badho
   → TIP: Extended Release (XR) version = 50% less GI issues

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. ORAL CONTRACEPTIVE PILLS (OCPs) — For PCOS
   
   BEST FOR PCOS:
   → Yasmin (Drospirenone + Ethinyl Estradiol)
     Price: ₹250-350/pack — anti-androgen effect
   → Diane-35 (Cyproterone + Ethinyl Estradiol)
     Price: ₹120-180/pack — strongest anti-androgen
   → Novelon (Desogestrel + Ethinyl Estradiol)
     Price: ₹100-150/pack — common choice

   HOW: 1 pill daily, 21 days, 7 day break, repeat
   
   WHY FOR PCOS:
   → Periods regular ho jaate hain
   → Androgens suppress hote hain → less acne, less hair
   → Endometrial protection — no period = endometrium thick
     = cancer risk — OCPs prevent this
   → Cyst formation reduce hota hai
   
   DOSE: Doctor prescribes based on specific needs
   🤰: ❌ STOP if pregnant/planning pregnancy
   
   SIDE EFFECTS: (Refer Condition #2 for detailed list)
   → Nausea, headache, mood changes first 2-3 months
   → Blood clot risk (rare but serious)
   
   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

3. SPIRONOLACTONE 25mg / 50mg / 100mg
   Hindi: स्पाइरोनोलैक्टोन | Gujarati: સ્પાઇરોનોલેક્ટોન
   Brand: Aldactone (RPG) ₹30-60 | Spiromide ₹25-45 (10 tab)
   
   DOSE ADULT (18+):
   → Start: 25mg daily
   → Usual: 50-100mg daily
   → Max: 200mg/day (doctor decides)
   → Takes: 3-6 months to see full anti-androgen effect

   DOSE TEEN: Generally NOT used under 18

   🤰 PREGNANCY: ❌❌ STRICTLY AVOID — TERATOGENIC
     (causes birth defects — especially male baby feminization)
     MUST use reliable contraception while taking
   🤱 BREASTFEEDING: ❌ AVOID

   WHY FOR PCOS:
   → Anti-androgen — blocks testosterone at receptor
   → Hirsutism (unwanted hair) significantly reduces
   → Acne improves dramatically
   → Hair loss on head slows/stops

   SIDE EFFECTS:
   → COMMON: Frequent urination (it's a diuretic)
   → COMMON: Irregular periods (that's why given with OCP)
   → UNCOMMON: Breast tenderness, fatigue, headache
   → RARE: High potassium (hyperkalemia) — blood test needed
   → TIP: Usually given WITH OCP for best results

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 SUPPLEMENTS SPECIFIC FOR PCOS:

4. MYO-INOSITOL 2000mg + D-CHIRO-INOSITOL 50mg — ★ BEST SUPPLEMENT
   Brand: Conceive Plus ₹400-600 | Inofolic ₹500-800
         OvaBlend ₹350-500 (30 sachets)
   → 1 sachet daily in water — usually before breakfast
   → 40:1 ratio (Myo:DCI) = physiological ratio
   → RESEARCH: Multiple studies — improves ovulation,
     insulin sensitivity, hormone levels, egg quality
   → Takes: 3-6 months for full effect
   → Almost NO side effects — very safe
   → 🤰: ✅ SAFE — helps conception + pregnancy
   → Can take WITH metformin — complementary
   → OTC — prescription not needed (but tell doctor)

5. OMEGA-3 (EPA + DHA) 2000mg daily
   → Brand: Generic fish oil ₹300-500 (60 caps) — 2 caps daily
   → Vegetarian: Algae-based DHA ₹400-600
   → Anti-inflammatory — PCOS inflammation reduce
   → Triglycerides kam + insulin sensitivity improve
   → 🤰: ✅ SAFE
   → Take with fatty meal for absorption

6. VITAMIN D3 (if deficient)
   → 60,000 IU weekly × 8 weeks, then 1000-2000 IU daily
   → 80% PCOS women are Vitamin D deficient
   → Deficiency worsens insulin resistance
   → Get tested first — 25-OH Vitamin D

7. CHROMIUM PICOLINATE 200-1000mcg
   → Brand: ₹200-400/60 caps
   → Insulin sensitivity improve
   → Sugar cravings kam karta hai
   → Research supported for PCOS

8. NAC (N-Acetyl Cysteine) 600mg 2-3 times daily
   → Brand: Mucomix ₹100-150 (10 sachets)
   → Antioxidant + insulin sensitizer
   → Ovulation improve karta hai
   → Research: Similar efficacy to Metformin in some studies
   → 🤰: ⚠️ Consult doctor — some studies show benefit

💊 FOR FERTILITY (When trying to conceive):

9. LETROZOLE 2.5mg (Femara)
   → Brand: Letoval ₹200-350 | Femara ₹400-600 (5 tab)
   → Ovulation induction — FIRST LINE for PCOS fertility
   → Better than Clomiphene for PCOS — research proven
   → How: Day 3-7 of cycle, 1 tab daily
   → ONLY under gynecologist — monitoring needed
   → Ultrasound follicle tracking zaroori hai

10. CLOMIPHENE CITRATE 50mg (Clomid)
    → Brand: Siphene ₹40-60 | Clofert ₹30-50 (5 tab)
    → Ovulation induction — older but still used
    → How: Day 2-6 of cycle, 1-2 tabs daily
    → Max 6 cycles usually
    → ONLY under gynecologist supervision

💊 TESTS FOR PCOS DIAGNOSIS:
→ Hormonal: FSH, LH, Testosterone (free + total),
  DHEA-S, Prolactin, Estradiol — ₹1500-2500
→ Metabolic: Fasting insulin, glucose, HbA1c,
  Lipid profile — ₹800-1500
→ Thyroid: TSH, T3, T4 — ₹300-500
→ Ultrasound: Pelvic — ovary size + follicle count — ₹500-1000
→ Others: Vitamin D, B12, CBC — ₹500-800
→ AMH (Anti-Mullerian Hormone) — ovarian reserve — ₹1000-2000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
PCOS ek lifelong condition hai — manage hota hai, cure nahi.
Koi bhi medicine lene se pehle QUALIFIED DOCTOR se zaroor
salah lein. PCOS management mein LIFESTYLE (diet + exercise)
medicines se bhi zyada important hai. Self-medication
serious health risks cause kar sakta hai.
NutriMama medical diagnosis ya prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY:` },
      { severity: "YELLOW", text: `WITHIN 1 WEEK:` },
    ],
    relatedIds: [2, 1],
  },
  {
    id: 4,
    slug: "morning-sickness",
    name: `Morning Sickness / Pregnancy Nausea`,
    nameHi: `गर्भावस्था में जी मिचलाना`,
    nameGu: `સગર્ભાવસ્થામાં ઉબકા`,
    emoji: "🤢",
    category: "PREGNANCY",
    summary: `Morning sickness is nausea and vomiting in early pregnancy, affecting 70-80% of pregnant women. It usually peaks at 9-10 weeks and resolves by 14-16 weeks. Severe cases (hyperemesis gravidarum) need medical care.`,
    whoGetsIt: `- 70-80% pregnant women — bahut common
- Severe (HG): 1-3% pregnant women
- First pregnancy mein zyada chances
- Previous pregnancy mein tha toh phir hoga (60-80%)
- Twin/multiple pregnancy mein zyada
- Family history — maa ko hua tha toh chances zyada
- Motion sickness history — predisposed
- Migraine history — predisposed

WHY HOTA HAI:
→ hCG hormone rapidly badhta hai — triggers nausea center
→ Estrogen surge — smell sensitivity badhti hai
→ Progesterone — digestion slow karta hai
→ Evolutionary theory: Protects baby from toxins in food
→ Stress/fatigue make it worse
→ Empty stomach worst trigger`,
    sections: {
      overview: `Pregnancy ke early weeks mein hone wali nausea (jee machlana)
aur/ya vomiting (ulti). "Morning sickness" naam misleading hai
— yeh din ke kisi bhi waqt ho sakta hai. Yeh normal pregnancy
symptom hai, baby ko koi nuksaan nahi hota usually.

TYPES:
MILD NAUSEA: Jee machlata hai but ulti nahi, kha pi leti hain
MODERATE NVP: Ulti din mein 1-3 baar, kuch kha leti hain
SEVERE NVP: Ulti zyada, khana mushkil, but hydrated hain
HYPEREMESIS GRAVIDARUM (HG): ❌ MEDICAL EMERGENCY
→ Din mein 5+ baar ulti, kuch bhi nahi kha/pi sakti
→ Weight loss >5% body weight
→ Dehydration — dark urine, dry lips, chakkar
→ Hospital admission + IV fluids zaroori

TIMELINE:
→ Start: Usually Week 6-7 (period miss ke 2-3 week baad)
→ Peak: Week 8-12 (sabse kharab)
→ Improvement: Week 12-14 (most women better)
→ End: Week 16-20 tak completely khatam usually
→ Some women: Poori pregnancy — rare but happens
→ Good news: Nausea = healthy pregnancy sign usually`,
      gharelu: `(🤰 ALL REMEDIES IN THIS SECTION ARE PREGNANCY SAFE)

⚡ INSTANT RELIEF:

1. ADRAK / GINGER — ★ MOST PROVEN REMEDY
   Hindi: अदरक | Gujarati: આદુ
   → Fresh adrak ka chhota piece — chabao (1-2g)
   → Ya adrak ki chai — 2-3 cup/day (3 cup MAX)
   → Ya ginger candy / ale (sugar-free best)
   → Ya dry ginger (saunth) powder — 1/4 tsp shahad mein
   → RESEARCH: Multiple clinical trials — as effective as
     Vitamin B6 for pregnancy nausea
   → Anti-emetic + digestive + anti-inflammatory
   → SAFE IN PREGNANCY: Up to 1g/day dried ginger
   → ⚠️ 1g/day se zyada mat lo — blood thinning effect
   → ⚠️ Bleeding history mein careful

2. NIMBU / LEMON — INSTANT AROMA THERAPY
   Hindi: नींबू | Gujarati: લીંબુ
   → Nimbu ko half cut karo — soongh lo (smell)
   → Ya nimbu ka ras garam/normal paani mein
   → Ya nimbu ke chhilke scratch karo — inhale
   → Citrus aroma nausea center ko block karta hai
   → RESEARCH: Lemon aromatherapy significantly reduces
     nausea in pregnancy
   → Zero risk — smell karna completely safe
   → Pocket mein nimbu rakh lo — jab bhi jee machle

3. SAUNF / FENNEL SEEDS — SOONGH YA CHABAO
   → 1/2 tsp saunf chabao — jab bhi nausea
   → Ya saunf ka paani piyo
   → Digestive + anti-nausea
   → Safe in moderate amounts in pregnancy
   → Traditional Indian remedy — centuries tested

4. ELAICHI / CARDAMOM — INSTANT ANTI-NAUSEA
   Hindi: इलाइची | Gujarati: એલચી
   → 1-2 elaichi ke dane chabao
   → Ya elaichi powder chai mein
   → Aroma = nausea relief
   → Digestive — gas/bloating bhi kam
   → Completely safe in pregnancy

🍽️ EATING STRATEGIES — MOST IMPORTANT:

5. SMALL FREQUENT MEALS — #1 RULE
   → Har 2-3 ghante kuch khaao — empty stomach = worst trigger
   → 6-8 chhote meals instead of 3 bade
   → Sone se pehle light snack — overnight empty stomach avoid
   → Uthte hi bedside pe rusk/biscuit rakh lo — khao BEFORE standing

6. BLAND CARBS FIRST:
   → Dry rusk, toast, plain biscuit (Marie/Parle-G)
   → Khichdi, plain rice, idli
   → Boiled potato, banana
   → Avoid: Spicy, oily, strong smell food

7. COLD FOODS OVER HOT:
   → Cold food = less smell = less nausea trigger
   → Fruits, salad (washed), cold sandwiches
   → Room temperature water — neither hot nor cold
   → Ice chips/popsicles — dehydration + nausea dono fix

8. HYDRATION TRICKS:
   → Small sips frequently — don't gulp
   → Nimbu paani — electrolytes + anti-nausea
   → Coconut water — natural electrolytes
   → ORS (Oral Rehydration Salt) — if vomiting a lot
   → Watermelon — water + nutrients
   → ⚠️ Don't drink WITH meals — 30 min pehle ya baad

🍵 DRINKS:

9. JEERA WATER (Cumin / जीरा / જીરું)
   → 1 tsp jeera ubalo 5 min — chhaan ke piyo
   → Digestive + anti-nausea
   → Gas/bloating bhi fix karta hai
   → Safe in pregnancy — traditional remedy

10. PUDINA / MINT LEAVES
    → Fresh pudina leaves chai mein ya plain paani mein
    → Ya pudina inhale karo — aroma therapy
    → Menthol = natural anti-emetic
    → ⚠️ Peppermint OIL (concentrated) avoid — pudina LEAF okay

11. COCONUT WATER / NARIYAL PAANI
    → 1-2 glasses daily
    → Natural electrolytes — dehydration prevent
    → Light, easy on stomach
    → Potassium rich — vomiting se lost minerals replace
    → ⚠️ Room temperature — fridge se seedha mat piyo

ACUPRESSURE — DRUG-FREE RELIEF:
12. P6 / NEI GUAN POINT:
    → Wrist ke andar ki taraf — 3 finger width below crease
    → Press firmly 1-2 min — circular motion
    → Anti-nausea point — clinically proven
    → Sea-Bands available: Wristband jo constantly press kare
    → Brand: Sea-Band ₹300-500 — pharmacies mein milta
    → Completely safe — zero side effects
    → Research: Cochrane review supports for pregnancy nausea

AROMATHERAPY:
13. SAFE ESSENTIAL OILS (inhale only — don't apply):
    → Lemon — most proven for pregnancy nausea
    → Ginger — anti-emetic aroma
    → Peppermint — refreshing + anti-nausea
    → Cardamom — traditional remedy
    → HOW: 1-2 drops on tissue/handkerchief — inhale
    → ⚠️ DON'T apply on skin during pregnancy
    → ⚠️ DON'T ingest essential oils ever`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Pregnancy nausea = "Garbha Chardi" in Ayurveda.
Caused by Vata + Pitta dushti affecting Amashaya (stomach).
The growing fetus's influence on doshas causes digestive
disturbance. Treatment focuses on settling Vata + Pitta.

🌿 PREGNANCY-SAFE AYURVEDIC REMEDIES:

1. SHATAVARI / शतावरी / શતાવરી — ★ SAFEST PREGNANCY HERB
   → 1/2 - 1 tsp churna garam doodh mein
   → Cooling, Pitta shamak — nausea kam
   → Nutrition absorption improve karta hai
   → Traditional "pregnancy herb" — centuries of use
   → Brand: Himalaya ₹180-250/60 tab
   → DOSE: 500mg-1g daily (conservative in pregnancy)
   → ✅ SAFE IN PREGNANCY — researched and traditional
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. YASHTIMADHU / MULETHI / LICORICE — (MODERATE DOSE)
   Hindi: मुलेठी | Gujarati: જેઠીમધ
   → Small piece chabao — jab bhi nausea
   → Ya 1/4 tsp powder shahad ke saath
   → Cooling, anti-inflammatory, stomach soothing
   → ⚠️ PREGNANCY: Small amounts ONLY — max 1-2g/day
   → ⚠️ HIGH DOSE AVOID — BP badh sakta hai
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. DHANIYA / CORIANDER — COOLING ANTI-NAUSEA
   Hindi: धनिया | Gujarati: ધાણા
   → Fresh dhaniya leaves ka juice — 2 tsp + nimbu
   → Ya dhaniya seeds — 1 tsp ubaal ke piyo
   → Pitta shamak — cooling + digestive
   → Completely safe in pregnancy — food item
   → Traditional remedy for pregnancy nausea

4. AMLA / INDIAN GOOSEBERRY
   → 1 fresh amla daily ya amla candy
   → Ya amla juice 15-20ml + shahad
   → Pitta shamak — nausea reduce
   → Vitamin C — immunity boost
   → Iron absorption improve — anaemia prevention
   → ✅ Safe in pregnancy — nutritious too

📦 AYURVEDIC FORMULATIONS:

5. DRAKSHADI KASHAYAM
   → 15ml + equal warm water, before food
   → Grape-based — Pitta shamak + nourishing
   → Brand: Kottakkal ₹120-200/200ml
   → Traditionally used for pregnancy nausea
   → ✅ Generally safe — but consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

6. DADIMADI GHRITA (Pomegranate Medicated Ghee)
   → 1 tsp twice daily before food
   → Excellent for pregnancy nausea + nutrition
   → Brand: Kottakkal ₹250-400/150ml
   → ✅ Traditional pregnancy formulation
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

⚠️ IMPORTANT AYURVEDA IN PREGNANCY:
→ AVOID all strong purgatives (Virechana dravyas)
→ AVOID hot potency herbs: Hing, Ajwain excess, Kali mirch excess
→ AVOID Guggulu-containing formulations
→ AVOID Rajahpravartini Vati — emmenagogue
→ AVOID Aloe vera internal — uterine contractions
→ ALWAYS consult qualified Vaidya for pregnancy prescriptions
→ "Natural" does NOT mean "safe in pregnancy"

⚠️ SECTION DISCLAIMER:
Pregnancy mein koi bhi Ayurvedic medicine lene se pehle
QUALIFIED VAIDYA + GYNAECOLOGIST dono se salah lein.
First trimester mein extra careful rehna zaroori hai.`,
      modern: `💊 SAFE IN PREGNANCY — OTC / FIRST LINE:

1. VITAMIN B6 (PYRIDOXINE) 10-25mg
   Hindi: विटामिन बी6 | Gujarati: વિટામિન બી6
   Brand: Pyridoxine tablets (generic) ₹20-40 (10 tab)
         Pregastar (combo) | B-Long (generic)
   Price: ₹20-50 per strip

   DOSE:
   → 10-25mg, 3 times daily (every 8 hours)
   → Max: 200mg/day (but usually 75mg enough)
   → Can take empty stomach or with food
   → Start LOW — 10mg — increase if needed

   🤰 PREGNANCY: ✅ SAFE — Category A
     (FDA Category A = proven safe in human studies)
   🤱 BREASTFEEDING: ✅ Safe

   WHY IT WORKS:
   → First-line treatment recommended by ACOG
   → Exact mechanism unclear — may regulate serotonin
   → Reduces nausea by 30-40% in most women
   → Very well tolerated — minimal side effects

   SIDE EFFECTS:
   → Almost none at recommended doses
   → Very high doses (>500mg long term): nerve damage
   → At normal pregnancy doses: VERY SAFE

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. DOXYLAMINE 10mg (often combined with B6)
   Hindi: डॉक्सीलामीन | Gujarati: ડોક્સીલામીન
   Brand: Doxinate (Taurus) | Duclam (Zuventus)
         Doxinate Plus = Doxylamine 10mg + Pyridoxine 10mg
   Price: ₹60-100 per strip (10 tab)

   DOSE:
   → 10mg at bedtime (raat ko sone se pehle)
   → If needed: 10mg morning + 10mg afternoon + 10mg night
   → Take 30 min before bed for best results

   🤰 PREGNANCY: ✅ SAFE — extensively studied
     (Only FDA-approved drug for pregnancy nausea in USA)
   🤱 BREASTFEEDING: ⚠️ May cause drowsiness in baby

   SIDE EFFECTS:
   → COMMON: Drowsiness (that's why take at night)
   → UNCOMMON: Dry mouth, constipation
   → RARE: Blurred vision
   → ⚠️ Neend bahut aati hai — drive NAHI karna

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

3. DOXINATE PLUS ★ MOST PRESCRIBED IN INDIA FOR MORNING SICKNESS
   Composition: Doxylamine 10mg + Pyridoxine 10mg
   Brand: Doxinate Plus (Taurus) | Pregvom (GSK)
   Price: ₹80-120 per strip (10 tab)

   DOSE:
   → 1 tab at bedtime
   → Moderate nausea: 1 morning + 1 bedtime
   → Severe: 1 morning + 1 afternoon + 1 bedtime
   → MAX: 4 tablets/day

   🤰 PREGNANCY: ✅ SAFEST ANTI-NAUSEA MEDICINE
   
   MOST GYNAECOLOGISTS IN INDIA PRESCRIBE THIS FIRST.
   Safe, effective, well-studied combination.

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 PRESCRIPTION ONLY (If above doesn't work):

4. ONDANSETRON 4mg (Zofran)
   Brand: Emeset (Cipla) ₹30-50 | Vomikind (Mankind) ₹25-40
   → Strong anti-emetic — chemotherapy-grade
   → 4mg every 8 hours, or SOS basis
   → 🤰: ⚠️ PREGNANCY Category B
     Generally safe but some debate — doctor decides
     Usually used when other options fail
   → SIDE EFFECTS: Headache, constipation
   → ⚠️ PRESCRIPTION ONLY — doctor supervision

5. METOCLOPRAMIDE 10mg (Reglan/Perinorm)
   Brand: Perinorm (Ipca) ₹15-25
   → 10mg before meals, 3 times daily
   → Gastric motility improve — nausea reduce
   → 🤰: ⚠️ Short-term safe — doctor prescribes
   → SIDE EFFECTS: Drowsiness, restlessness
   → ⚠️ Not for long term use — movement disorders

6. IV FLUIDS + THIAMINE (Hyperemesis Gravidarum)
   → Hospital admission required
   → IV normal saline + dextrose
   → Thiamine (B1) injection — prevents Wernicke's
   → Anti-emetics IV: Ondansetron + Metoclopramide
   → Potassium correction if needed
   → Usually 1-3 day admission

💊 SUPPLEMENTS DURING PREGNANCY:
→ Prenatal vitamins — continue even with nausea
  (Take at night or with food to reduce nausea from pills)
→ Iron — may worsen nausea, take at night
  (Some women need iron-free prenatals first trimester)
→ Folic acid 5mg — CONTINUE no matter what
→ DHA 200mg — brain development, take with food
→ Calcium 500mg — take separately from iron (2 hr gap)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Pregnancy mein koi bhi medicine lene se pehle APNE
GYNAECOLOGIST se zaroor salah lein. Har pregnancy alag
hoti hai. Self-medication pregnancy mein dangerous hai.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — HOSPITAL JAO (Hyperemesis Gravidarum):` },
      { severity: "YELLOW", text: `WITHIN 24 HOURS — DOCTOR CALL KARO:` },
    ],
    relatedIds: [5],
  },
  {
    id: 5,
    slug: "iron-deficiency-anaemia",
    name: `Iron Deficiency Anaemia`,
    nameHi: `खून की कमी`,
    nameGu: `લોહીની ઓછપ`,
    emoji: "💉",
    category: "NUTRITION_DEFICIENCY",
    summary: `Iron deficiency anaemia affects more than half of Indian women of reproductive age. Symptoms include fatigue, pale skin, breathlessness, and dizziness. Treatment combines iron-rich foods, supplements, and addressing the underlying cause.`,
    whoGetsIt: ``,
    sections: {
      overview: `Iron deficiency anaemia matlab body mein iron ki kami ho gayi hai
jis wajah se haemoglobin (Hb) — jo blood mein oxygen carry karta
hai — kam ban raha hai. Result: Thakan, kamzori, chakkar, saans
fulna. India mein yeh women ka SABSE BADA health problem hai.

HAEMOGLOBIN (Hb) LEVELS — KNOW YOUR NUMBER:
→ NORMAL:        12-16 g/dL (women)
→ MILD ANAEMIA:  10-11.9 g/dL — often no symptoms
→ MODERATE:      7-9.9 g/dL — noticeable symptoms
→ SEVERE:        <7 g/dL — DANGEROUS — treatment urgent
→ PREGNANCY:     11+ g/dL = normal
                  10-10.9 = mild | 7-9.9 = moderate | <7 = severe

INDIA STATISTICS — SHOCKING:
→ 53% Indian women (15-49 years) are anaemic (NFHS-5)
→ 57% pregnant women are anaemic
→ Rural: 58% | Urban: 47%
→ Maternal deaths ka leading cause — 20% maternal deaths
→ Gujarat specifically: 55-60% women anaemic

CAUSES:
→ DIET: Not enough iron-rich food — vegetarian diet risk
→ PERIODS: Heavy bleeding = iron loss every month
→ PREGNANCY: Baby needs iron — mother's stores deplete
→ ABSORPTION: Chai/coffee with meals = 50% less absorption
→ INFECTION: Worms, malaria — destroy red blood cells
→ DISEASE: Thalassemia (common in Gujarat), Sickle cell
→ GI: Ulcer, piles — chronic blood loss
→ POST-SURGERY: Blood loss during/after delivery

👩 SYMPTOMS — PEHCHANO:
EARLY (Mild — Hb 10-12):
→ Thakan — subah se hi tired feeling
→ Kamzori — chhoti si mehnat mein thak jaana
→ Pale skin — rang peela/safed dikhna
→ Pale nails — nakhun mein pink colour nahi

MODERATE (Hb 7-10):
→ Saans fulna — seeediyan chadne mein
→ Chakkar aana — suddenly uthne pe
→ Sir dard — especially shaam ko
→ Dil ki dhadkan tez — palpitation
→ Haath pair thande rehna
→ Baal girna — jhaadne pe zyada baal
→ Nails kamzor — toot-te hain, spoon-shaped ho jaate
→ Mooh ke kone fatna (angular cheilitis)
→ Jeebh mein dard ya smooth ho jaana
→ Ice/mitti khaane ka mann (Pica) — warning sign

SEVERE (Hb <7):
→ Saans bahut zor se fulti — resting mein bhi
→ Chest pain / tightness
→ Extreme fatigue — bed se uth nahi pa rahe
→ Behoshi aana
→ Haath pair sunn hona
→ Restless leg syndrome — pair mein bechain feeling`,
      gharelu: `🥗 IRON-RICH FOODS — SABSE IMPORTANT TREATMENT:

VEGETARIAN IRON SOURCES (Non-Heme Iron):
1. GUR / JAGGERY (गुड़ / ગોળ) — ★ CHEAPEST IRON SOURCE
   → 1-2 pieces daily (15-20g) — after meals
   → Iron: ~11mg per 100g
   → Replace sugar with gur everywhere — chai, halwa, ladoo
   → Gur + chana = power combo (iron + protein)
   → Gujarat special: Gur na ladoo bahut beneficial
   → ⚠️ Diabetes mein limit karo — still sugar hai

2. CHANA / CHICKPEAS (चना / ચણા)
   → 1 cup cooked daily — sabzi, chaat, salad
   → Iron: 6.2mg per cup cooked
   → Protein bhi milta hai — double benefit
   → Bhigoke khaao — iron absorption better
   → Nimbu dalke khaao — Vitamin C = 3x absorption

3. PALAK / SPINACH (पालक / પાલક)
   → Daily sabzi, paratha, smoothie mein
   → Iron: 3.6mg per cup cooked
   → Cook lightly — raw mein oxalates block iron
   → Nimbu dal ke khaao — Vitamin C boost

4. DATES / KHAJUR (खजूर / ખજૂર)
   → 4-5 daily — snack ke roop mein
   → Iron: 1mg per 5 dates + natural energy
   → Doodh mein bhigo ke khaao — traditional tonic
   → Pregnancy mein especially beneficial
   → Gujarat: Khajur pak — winter superfood

5. BEETROOT / CHUKANDAR (चुकंदर / બીટ)
   → 1 medium daily — juice, salad, sabzi
   → Iron: 1.1mg per cup + folate bonus
   → Juice: Beetroot + carrot + amla = iron smoothie
   → Beetroot halwa — tasty way to increase iron

6. POMEGRANATE / ANAAR (अनार / દાડમ)
   → 1 cup seeds ya 1 glass juice daily
   → Iron + Vitamin C — absorption mein help
   → Blood production boost karta hai
   → Traditional: Anaar ka juice pregnancy mein daily

7. RAJMA / KIDNEY BEANS (राजमा / રાજમા)
   → 1 cup cooked 2-3 times/week
   → Iron: 3.9mg per cup cooked
   → Protein + Iron combo
   → Pressure cook — well cooked khaao

8. LOH PAANI / IRON WATER (Traditional)
   → Iron kadhai/tawa mein khana banao
   → Especially tomato/lemon based dishes
   → Acidic food iron kadhai se iron absorb karta hai
   → Cheapest, most natural iron supplementation
   → Research supported — significantly increases iron intake

9. KALA TIL / BLACK SESAME (काला तिल / કાળા તલ)
   → 1-2 tsp daily — chabao ya ladoo
   → Iron: 7.8mg per 100g — VERY HIGH
   → Til + gur ladoo = iron bomb
   → Gujarat: Til papdi — winter mein khaao

10. MURMURA + GUR (Puffed rice + Jaggery)
    → Traditional chikki/ladoo
    → Iron from both sources
    → Cheap, easily available, tasty
    → School mein bhi le ja sakte — healthy snack

🍊 ABSORPTION BOOSTERS — ZAROOR KHAAO SAATH:
→ Vitamin C foods WITH iron = 3x better absorption:
  - Nimbu (squeeze on dal, sabzi, salad)
  - Amla — 1 daily (richest Vitamin C source)
  - Orange / Santra — 1 daily
  - Tomato — sabzi/salad mein
  - Capsicum / Shimla mirch
  - Kiwi, strawberry, guava

🚫 ABSORPTION BLOCKERS — AVOID WITH IRON FOOD:
→ Chai/Coffee — tannins block 50-60% iron absorption
  RULE: 2 GHANTE ka gap — chai PEHLE ya 2 hr BAAD
→ Doodh/Calcium — 1-2 ghante gap from iron-rich meals
→ Whole grains phytates — soak/ferment reduces blockers
→ Soy products — isoflavones reduce absorption slightly

🍹 IRON TONIC RECIPES:

11. DADI KA IRON TONIC:
    → 5 khajur + 5 badam + 2 anjeer → raat ko doodh mein bhigao
    → Subah blend karo → garam piyo
    → Daily 1 glass — Hb 1-2 g/dL badh sakta 2 months mein

12. BEETROOT-AMLA-CARROT JUICE:
    → 1 medium beetroot + 1 amla + 1 carrot
    → Juice nikalo — nimbu ka ras daalo
    → Daily subah khali pet
    → Iron + Vitamin C + Folate combo

13. PALAK-DATES SMOOTHIE:
    → Handful palak + 3 dates + 1 banana + doodh
    → Blend — daily peena
    → Iron + energy + taste

14. TRADITIONAL GUR-CHANA:
    → Bhuna chana + gur — equal parts
    → 1 mutthi (handful) daily as snack
    → Iron + protein — cheapest tonic
    → Har gaon mein available`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Anaemia = "Pandu Roga" in Ayurveda.
Caused by Pitta dushti → Rasa-Rakta dhatu kshaya.
(Pitta vitiation → blood tissue depletion)
Agni (digestive fire) weak → nutrition absorb nahi hota.

🌿 KEY HERBS:

1. LOHA BHASMA (Iron Ash / लौह भस्म / લોહ ભસ્મ) — ★ CLASSICAL
   → Ayurvedic iron preparation — nano-sized iron
   → 125-250mg shahad ya ghee ke saath
   → Din mein 2 baar — khali pet
   → Very well absorbed — better than some allopathic iron
   → Brand: Baidyanath ₹150-250 | Dabur ₹130-200 (10g)
   → DOSE TEEN: 125mg 2 baar
   → DOSE ADULT: 250mg 2 baar
   → 🤰 PREGNANCY: ✅ Safe — traditionally used
   → Duration: 2-3 months minimum for Hb rise
   → ⚠️ Bina Vaidya ki salah ke mat lo — dose important
   → ⚠️ Quality matters — buy from reputed brands only

2. MANDOOR BHASMA (Iron Oxide Ash / मंडूर भस्म)
   → Another classical iron preparation
   → 250-500mg shahad ke saath — 2 baar
   → Especially for anaemia with liver/spleen enlargement
   → Brand: Baidyanath ₹120-200/10g
   → 🤰: ✅ Safe in correct dose
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. PUNARNAVA / पुनर्नवा / પુનર્નવા (Boerhavia Diffusa)
   → 3-5g churna ya 500mg tablet 2 baar
   → Blood builder + kidney tonic
   → Haemoglobin badhane mein madad
   → Brand: Himalaya ₹120-180
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. DHATRI LOHA (Amla + Iron combination)
   → Classical formulation — Amla (Vitamin C) + Loha (Iron)
   → 2 tablets 2 baar shahad ke saath
   → Amla ensures iron absorption — smart traditional science!
   → Brand: Baidyanath ₹100-160/40tab
   → 🤰: ✅ Safe — excellent pregnancy supplement
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. NAVAYASA LOHA
   → Multi-herb iron preparation — 9 ingredients
   → 250mg 2 baar shahad ke saath
   → Liver function improve — iron metabolism boost
   → Brand: Baidyanath ₹100-180/40tab
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:

6. DRAKSHARISHTA (Grape-based Arishta)
   → 15-20ml + equal paani, after food, 2 baar
   → Blood builder + digestive + energizer
   → Taste achha — grape flavored
   → Brand: Dabur ₹120-170/450ml
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. LOHASAVA
   → 15-20ml + equal paani, after food, 2 baar
   → Classical iron tonic — liquid form
   → Brand: Baidyanath ₹100-150/450ml
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. KUMARYASAVA — 15-20ml + paani, 2 baar
   → Aloe vera based — digestive + blood builder
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

AYURVEDIC DIET FOR PANDU ROGA:
→ Gur daily — replace sugar
→ Green leafy vegetables — daily
→ Dates + almonds soaked — morning tonic
→ Pomegranate — 1 daily
→ Amla — 1 daily (MUST — Vitamin C for absorption)
→ Black sesame (kala til) — daily
→ Iron kadhai mein khana banao
→ Avoid: Excess chai — iron blocker
→ Avoid: Maida, junk food — no nutrition

⚠️ SECTION DISCLAIMER:
Ayurvedic iron preparations (Bhasma) quality pe bahut
depend karti hain. Sirf reputed brands se kharido.
Koi bhi treatment shuru karne se pehle Vaidya se salah lo.`,
      modern: `💊 IRON SUPPLEMENTS — ORAL:

1. FERROUS SULPHATE 200mg (65mg elemental iron)
   Hindi: फेरस सल्फेट | Gujarati: ફેરસ સલ્ફેટ
   Brand: Generic widely available
   Price: ₹10-20 per strip (10 tab)

   DOSE ADULT (18+):
   → 1 tablet daily — MODERATE anaemia
   → 1 tablet 2 times daily — SEVERE anaemia
   → Empty stomach preferred (better absorption)
   → BUT if nausea — after food okay (less absorbed)

   DOSE TEEN (13-17):
   → 1 tablet daily
   → After lunch — easier to tolerate

   🤰 PREGNANCY: ✅ ESSENTIAL — WHO recommends
     60mg elemental iron + 400mcg folic acid daily
   🤱 BREASTFEEDING: ✅ Safe + recommended

   HOW TO TAKE (IMPORTANT):
   → Vitamin C saath lo — nimbu paani ya orange
   → 2 ghante BAAD chai/coffee piyo — NOT with/before
   → Calcium alag time pe lo — 2 hr gap
   → Antacids se 2 hr gap
   → Consistent time daily — routine banao

   SIDE EFFECTS:
   → COMMON (30-50%): Black stool (NORMAL — don't panic)
   → COMMON: Constipation — paani zyada piyo + fibre
   → COMMON: Nausea, pet mein heaviness
   → UNCOMMON: Dast, pet dard
   → TIP: Start alternate day if can't tolerate daily
     (Research: Alternate day = almost equal absorption!)
   → TIP: Liquid form = less constipation

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. FERROUS ASCORBATE (Iron + Vitamin C combo)
   Brand: Orofer XT ₹80-120 | Autrin ₹60-100 |
         Ferium XT ₹70-110 (10 tab)
   (Usually: Iron 100mg + Folic Acid 1.5mg + Zinc)

   DOSE:
   → 1 tablet daily after lunch
   → Some need 2/day if severe (doctor decides)

   🤰 PREGNANCY: ✅ SAFE — commonly prescribed
   
   ADVANTAGE: Vitamin C already included = better absorption
   Less GI side effects than Ferrous Sulphate
   Most commonly prescribed iron in India today

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

3. IRON POLYMALTOSE COMPLEX (IPC)
   Brand: Mumfer ₹60-100 | Feronia XT ₹70-110 (10 tab)

   ADVANTAGE:
   → Chewable/liquid forms available
   → MUCH less GI side effects — no nausea, less constipation
   → Can take with food without losing absorption
   → Stool colour change LESS

   DISADVANTAGE:
   → Slightly less absorbed than ferrous salts
   → May need longer treatment duration

   🤰 PREGNANCY: ✅ Safe — good option if can't tolerate others
   → Best for those who vomit with other iron forms

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 GOVERNMENT FREE SUPPLY:
→ IFA (Iron Folic Acid) tablets — free at:
  → Anganwadi centres
  → Primary Health Centres (PHC)
  → ASHA workers distribute
  → Government hospitals
→ Weekly Iron Supplementation Programme for adolescent girls
→ Pregnant women: 180 IFA tablets free (6 months supply)
→ TAKE THESE — they work!

💊 INJECTABLE IRON (When Oral Fails):

4. IRON SUCROSE IV
   Brand: Orofer IV ₹400-600/ampoule
   → Hospital/clinic mein dete hain — IV drip
   → When: Oral tolerate nahi ho raha, Hb<7,
     delivery near hai, blood loss zyada
   → FAST: Hb 2-3 weeks mein badh jaata hai
   → 🤰: ✅ Safe after first trimester
   → Side effects: Rarely — headache, nausea, low BP
   → Need: 3-5 doses usually — doctor calculates

5. FERRIC CARBOXYMALTOSE (Ferinject)
   Brand: Ferinject ₹3000-5000/vial — EXPENSIVE
   → Single dose mein 1000mg iron de sakte — just 1 sitting!
   → No need to come back multiple times
   → Very safe, minimal side effects
   → 🤰: ✅ Safe after first trimester
   → When: Severe anaemia + time kam hai

💊 ESSENTIAL CO-SUPPLEMENTS:

6. FOLIC ACID 5mg
   Brand: Folvite ₹10-20 (10 tab)
   → 1 daily — WITH iron
   → Blood cell formation ke liye zaruri
   → 🤰: ✅ ESSENTIAL — prevents neural tube defects
   → Start BEFORE pregnancy ideally — 3 months pehle
   → Side effects: Almost none

7. VITAMIN C 500mg
   Brand: Celin ₹30-50 | Limcee ₹20-30 (10 tab)
   → 1 daily WITH iron tablet
   → Iron absorption 3x improve karta hai
   → Immune boost — bonus
   → 🤰: ✅ Safe

8. VITAMIN B12 (if deficient — common in vegetarians)
   Brand: Methylcobalamin ₹80-150 (10 tab)
   → 1500mcg daily
   → Vegetarian diet = B12 deficient usually
   → Without B12, iron alone won't fix anaemia
   → GET TESTED — B12 level check karo
   → 🤰: ✅ Safe + important

💊 TESTS DOCTOR RECOMMEND KAREGA:
→ CBC: Hb, MCV, MCH, MCHC, RDW — ₹200-400
  (MCV low = iron deficiency usually)
→ Iron Studies: Serum Iron, TIBC, Ferritin — ₹500-1000
  (Ferritin <30 = iron deficient even if Hb normal)
→ Peripheral Smear: Blood cell shape — ₹200-300
→ Vitamin B12 + Folate — ₹500-800
→ Stool test: Worms, occult blood — ₹100-200
→ Hb Electrophoresis: Thalassemia check — ₹500-800
  (IMPORTANT in Gujarat — Thalassemia belt)

MONITORING:
→ Recheck Hb after 4 weeks of treatment
→ Expect: Hb rise 1-2 g/dL per month with proper treatment
→ Continue iron 3 months AFTER Hb normalizes — stores fill
→ Ferritin >50 = stores adequate
→ If Hb NOT rising — tell doctor — investigate further

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Koi bhi medicine lene se pehle QUALIFIED DOCTOR se zaroor
salah lein. Iron overdose dangerous ho sakta hai — especially
children mein. Self-medication se liver damage risk hai.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — HOSPITAL:` },
      { severity: "YELLOW", text: `WITHIN 1 WEEK:` },
    ],
    relatedIds: [],
  },
  {
    id: 6,
    slug: "heavy-bleeding",
    name: `Heavy Bleeding (Menorrhagia)`,
    nameHi: `अत्यधिक रक्तस्राव`,
    nameGu: `ભારે રક્તસ્ત્રાવ`,
    emoji: "🩸",
    category: "MENSTRUAL",
    summary: `Heavy menstrual bleeding (menorrhagia) means soaking through pads/tampons every 1-2 hours, periods longer than 7 days, or passing large clots. It often leads to anaemia and warrants investigation for fibroids, hormonal issues, or other causes.`,
    whoGetsIt: `- 1 in 3 women experience heavy periods at some point
- Most common age: 30-50 (perimenopause)
- Fibroids: 20-50% women by age 50
- PCOS women — anovulatory heavy bleeding
- Family history — genetic component
- Obesity — estrogen excess from fat tissue`,
    sections: {
      overview: `Periods mein normal se bahut zyada bleeding hona — itna ki
daily life disturb ho jaye. Medical term: Menorrhagia.
Normal period blood loss = 30-40ml (2-3 tablespoons).
Heavy = 80ml+ (soaking pad/tampon har 1-2 ghante).

HOW TO KNOW IT'S HEAVY — SIGNS:
→ Pad/tampon har 1-2 ghante mein full soak ho raha
→ Double protection chahiye (pad + tampon ya 2 pads)
→ Raat ko kapde/bed kharab ho jaate hain
→ Blood clots golf ball size ya bade nikal rahe
→ Period 7 din se zyada chal raha hai
→ Daily kaam nahi kar pa rahe — school/office miss
→ Anaemia symptoms — thakan, chakkar, kamzori
→ Har month aise hi ho raha hai consistently

CAUSES:
HORMONAL (50-60% cases):
→ Anovulation — ovulation nahi ho raha — estrogen excess
→ PCOS — hormonal imbalance
→ Thyroid — hypothyroid common cause
→ Perimenopause — 40+ age mein hormones fluctuate

STRUCTURAL (30-40%):
→ Fibroids (Myoma) — uterus mein non-cancerous growths
→ Polyps — endometrial lining mein growths
→ Adenomyosis — endometrial tissue uterus wall mein
→ Endometriosis — tissue outside uterus

MEDICAL:
→ Blood clotting disorders — Von Willebrand disease
→ Blood thinners — Aspirin, Warfarin
→ IUD (Copper-T) — first 3-6 months heavy
→ Liver/Kidney disease
→ Rarely: Uterine/Cervical cancer (screening important)

PREGNANCY RELATED:
→ Miscarriage — heavy bleeding + clots + pain
→ Ectopic pregnancy — bleeding + one-sided pain
→ ⚠️ ANY heavy bleeding in pregnancy = EMERGENCY`,
      gharelu: `⚡ QUICK RELIEF DURING HEAVY FLOW:

1. NAGKESAR + SHAHAD (नागकेसर / નાગકેસર)
   → 1/2 tsp Nagkesar powder + 1 tsp shahad
   → Din mein 3 baar — period ke time
   → Hemostatic — bleeding control karta hai
   → Traditional #1 remedy for heavy periods
   → Safe for all ages

2. BANANA FLOWER / KELE KA PHOOL (केले का फूल / કેળાનું ફૂલ)
   → Sabzi banao ya juice nikalo
   → Progesterone level badhata hai naturally
   → Bleeding reduce karta hai significantly
   → South Indian traditional remedy — very effective
   → 1 cup daily during periods

3. DAALCHINI + SHAHAD (Cinnamon / दालचीनी / તજ)
   → 1 tsp daalchini powder + 1 tsp shahad
   → Garam paani mein mix — din mein 2 baar
   → Blood clotting help karta hai
   → Uterine spasm reduce — flow regulate
   → Research supported for menstrual blood loss reduction

4. CORIANDER SEEDS / DHANIYA (धनिया / ધાણા)
   → 2 tsp dhaniya seeds — 2 cup paani mein ubalo
   → Jab aadha rahe — chhaan ke piyo
   → Din mein 2-3 baar — period ke time
   → Cooling + hemostatic properties
   → Very safe — food grade remedy

5. AMLA / INDIAN GOOSEBERRY (आंवला / આમળાં)
   → 1-2 fresh amla daily ya 30ml juice
   → Ya amla powder 1 tsp shahad ke saath
   → Vitamin C — blood vessel strength
   → Iron absorption — anaemia prevention (blood loss se)
   → Pitta shamak — cooling for heavy flow

6. MANGO BARK / AAM KI CHHAAL (आम की छाल / આમની છાલ)
   → Small piece aam ki chhaal — 1 glass paani mein ubalo
   → Chhaan ke 1 tsp shahad daal ke piyo
   → Astringent — bleeding control
   → Traditional remedy — centuries ka use
   → Din mein 2 baar period ke time

7. BANANA (RIPE) / PAKKA KELA (पक्का केला / પાકું કેળું)
   → 1-2 daily during heavy periods
   → Potassium — muscle cramp reduce
   → Energy — blood loss se weakness compensate
   → Easy to digest — no stomach issues

8. IRON-RICH FOODS — MANDATORY DURING HEAVY PERIODS:
   → Gur + chana — daily snack
   → Beetroot juice + amla — morning
   → Palak sabzi — daily
   → Dates — 4-5 daily
   → Pomegranate — 1 daily
   → (Heavy bleeding = iron loss — MUST replace)

🍵 DRINKS:

9. RASPBERRY LEAF TEA
   → 1-2 cups daily — uterine tonic
   → Tones uterine muscles — flow regulate
   → Available online — ₹300-500/box
   → ⚠️ PREGNANCY: Only 3rd trimester — not before

10. SHEPHERD'S PURSE TEA (if available)
    → Strong hemostatic — stops bleeding
    → Used in European herbal medicine
    → Available: Online herb stores

LIFESTYLE DURING HEAVY PERIODS:
→ Rest zyada lo — body blood loss recover kar rahi hai
→ Iron-rich food double karo
→ Hydration zyada — water, coconut water, ORS
→ Cold compress on lower abdomen — vasoconstriction
→ Avoid: Hot baths, heavy exercise, heating pad on abdomen
→ Keep extra pads/clothes — be prepared
→ Night pads use karo — longer, more absorbent`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Heavy bleeding = "Raktapradar" or "Asrigdara" in Ayurveda.
Primarily Pitta dushti — excess heat in Rakta dhatu (blood).
Pitta aggravation → blood vessels dilate → excess flow.
Also Vata involvement — irregular heavy episodes.

🌿 KEY HERBS:

1. ASHOKA / अशोक / અશોક — ★★★ BEST FOR HEAVY BLEEDING
   → 3-6g bark powder doodh ke saath — 2 baar
   → Ya Ashoka Ghana Vati: 2 tab 2 baar
   → Uterine astringent — bleeding significantly reduce
   → THE herb for all uterine bleeding in Ayurveda
   → Brand: Himalaya ₹120-200 | Baidyanath ₹80-150
   → TEEN: 2-3g ya 1 tab 2 baar
   → ADULT: 3-6g ya 2 tab 2 baar
   → 🤰: ⚠️ AVOID — uterine stimulant
   → Duration: 2-3 months for lasting effect
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. LODHRA / लोध्र / લોધ્ર (Symplocos Racemosa) — ★★ ASTRINGENT
   → 3-5g churna paani ya doodh ke saath — 2 baar
   → Strongest astringent herb — bleeding rokta hai
   → Uterine tissue ko tone karta hai
   → Brand: Baidyanath ₹100-180/100g
   → TEEN: 2-3g 2 baar | ADULT: 3-5g 2 baar
   → 🤰: ⚠️ AVOID first trimester
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. NAGKESAR / नागकेसर / નાગકેસર (Mesua Ferrea)
   → 1-3g shahad ke saath — 2-3 baar during period
   → Hemostatic — directly blood clotting support
   → Combined with Ashoka = most powerful combo
   → Brand: Baidyanath ₹80-150/50g
   → TEEN: 1-2g | ADULT: 2-3g
   → 🤰: ✅ Safe in small doses
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. DURVA / DOOB GRASS / दूर्वा / દૂર્વા (Cynodon Dactylon)
   → Fresh grass juice: 20-30ml — 2 baar
   → Ya durva swaras + shahad
   → Classical Pitta shamak — cooling + hemostatic
   → Specifically for Raktapradar in texts
   → Easily available — garden mein bhi
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. PRAVAL PISHTI (Coral Calcium / प्रवाल पिष्टी)
   → 250-500mg shahad ya gulkand ke saath — 2 baar
   → Pitta shamak — cooling + calcium
   → Bleeding + burning sensation dono mein relief
   → Brand: Baidyanath ₹200-350/10g
   → 🤰: ✅ Safe — calcium supplement bhi
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:

6. ASHOKARISHTA — 15-20ml + paani, 2 baar after food
   → #1 formulation for heavy periods
   → Full details in Condition #1
   → Duration: 2-3 months minimum
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. PUSHYANUG CHURNA — 3-6g shahad/ghee ke saath, 2 baar
   → Classical formulation — broad spectrum for all
     menstrual bleeding disorders
   → Brand: Baidyanath ₹80-130 | Dabur ₹90-140
   → TEEN: 2-3g | ADULT: 3-6g
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. BOLBADDHA RAS — 1-2 tab 2 baar shahad ke saath
   → Specifically for Raktapradar (heavy bleeding)
   → Ras Aushadhi — mineral-based, very potent
   → Brand: Baidyanath ₹100-180/40tab
   → ⚠️ ONLY under Vaidya supervision — potent formulation
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

9. PRADARANTAK LAUHA — 2 tab 2 baar
   → Iron + herbs combination for bleeding + anaemia
   → Addresses both: stops bleeding + builds blood
   → Brand: Baidyanath ₹100-160/40tab
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

10. CHANDANASAVA — 15-20ml + paani, 2 baar
    → Sandalwood-based — extreme Pitta shamak
    → For bleeding with burning sensation
    → Brand: Dabur ₹120-170/450ml
    → 🤰: ⚠️ Consult Vaidya
    → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

AYURVEDIC DIET:
→ Cooling foods — cucumber, coconut, coriander
→ Gulkand (rose petal jam) — 1-2 tsp daily — Pitta shamak
→ Sattu drink — cooling + nutritious
→ Coconut water — natural coolant
→ Avoid: Spicy, hot, fermented, sour excess
→ Avoid: Alcohol, caffeine — heat badhate
→ Iron-rich food daily — blood loss compensate

⚠️ SECTION DISCLAIMER:
Heavy bleeding ek serious symptom hai jiska investigate
karna zaroori hai. Ayurvedic remedies symptoms manage karte
hain lekin underlying cause (fibroid, polyp, cancer) ke liye
proper medical investigation MANDATORY hai.
Koi bhi medicine shuru karne se pehle Vaidya se salah lein.`,
      modern: `💊 FIRST LINE — NON-HORMONAL:

1. TRANEXAMIC ACID 500mg
   Hindi: ट्रेनेक्सामिक एसिड | Gujarati: ટ્રેનેક્સેમિક એસિડ
   Brand: Trenaxa (Macleods) | Pause (Sun) | Trapic (Intas)
   Price: ₹50-90 per strip (10 tab)

   DOSE ADULT (18+):
   → 500mg-1g (1-2 tablets) 3 times daily
   → Start on Day 1 of heavy flow
   → Continue for 3-5 days (during heavy days only)
   → Reduces blood loss by 40-50%

   DOSE TEEN (13-17):
   → 500mg 2-3 times daily
   → Maximum 4 days
   → Doctor supervision recommended

   🤰 PREGNANCY: ⚠️ Only if doctor prescribes —
     used in PPH (post-partum haemorrhage)
   🤱 BREASTFEEDING: ✅ Safe — minimal milk transfer

   HOW IT WORKS:
   → Anti-fibrinolytic — stops clots from dissolving
   → Blood clots stable rehte — bleeding kam
   → Does NOT cause blood clots elsewhere (safe)
   → NOT a hormone — no hormonal side effects

   SIDE EFFECTS:
   → COMMON (5-10%): Nausea, diarrhea, headache
   → UNCOMMON: Stomach cramps, back pain
   → RARE: Blood clot in legs (DVT) — very rare
   → ⚠️ History of blood clots mein AVOID
   → ⚠️ Kidney disease mein dose adjust

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. MEFENAMIC ACID 500mg
   Brand: Meftal-500 | Ponstan
   Price: ₹30-50 per strip
   → Reduces blood loss by 20-30%
   → PLUS pain relief — dual benefit
   → 500mg 3 times daily during period
   → Details in Condition #1
   → 🤰: ❌ AVOID
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 HORMONAL TREATMENTS (Doctor Prescribed):

3. ORAL CONTRACEPTIVE PILLS (OCPs)
   → Regulate cycle + reduce flow by 40-50%
   → Brand: Novelon, Yasmin, Ovral-L
   → Details in Condition #2
   → 🤰: ❌ STOP if pregnant
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. LEVONORGESTREL IUD (Mirena / LNG-IUS)
   Hindi: हार्मोनल आईयूडी | Gujarati: હોર્મોનલ આઈયુડી
   Brand: Mirena ₹8000-12000 (5 year device)
   → Intrauterine device — doctor insert karta hai
   → Reduces bleeding by 70-90% — MOST EFFECTIVE
   → Works for 5 years
   → Progesterone locally release — minimal systemic effects
   → Gynaecologist procedure — OPD mein hota hai
   → 🤰: ❌ Remove if pregnant
   → SIDE EFFECTS: Irregular spotting first 3-6 months
     (settles — then periods very light ya stop)
   → BEST option for heavy bleeding who don't want surgery
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. NORETHISTERONE 5mg
   Brand: Primolut-N ₹30-50 (10 tab)
   → 5mg 2-3 times daily — Days 5-26 of cycle
   → Or: 5mg 3 times daily to STOP acute heavy bleeding
   → Progesterone — endometrium thin karta hai
   → Short-term use — not long-term solution
   → 🤰: ❌ AVOID
   → SIDE EFFECTS: Bloating, mood, headache, breast pain
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

6. MEDROXYPROGESTERONE (MPA) 10mg
   Brand: Deviry ₹50-80 | Meprate ₹40-60
   → 10mg for 10-14 days per month
   → Regulates cycle + reduces flow
   → 🤰: ❌ AVOID
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 SUPPLEMENTS — ESSENTIAL WITH HEAVY BLEEDING:

7. IRON SUPPLEMENT — MANDATORY
   → Heavy bleeding = iron loss = anaemia
   → Ferrous Ascorbate (Orofer XT) — 1 daily after lunch
   → With Vitamin C for absorption
   → Details in Condition #5
   → 🤰: ✅ Essential

8. VITAMIN K (if deficiency suspected)
   → Helps blood clotting
   → Food sources: Green leafy, broccoli
   → Supplement: Only if doctor says

💊 INVESTIGATIONS DOCTOR WILL DO:
→ CBC + Iron Studies — anaemia assessment
→ Thyroid Profile — TSH
→ Hormonal: FSH, LH, Prolactin
→ Pelvic Ultrasound — fibroids, polyps, thickness
→ Endometrial biopsy — if age 40+ or not responding
→ Coagulation profile — bleeding disorder check
→ Pap smear — cervical screening
→ Hysteroscopy — camera inside uterus (if needed)

💊 SURGICAL OPTIONS (When medicine fails):
→ Endometrial Ablation — destroys uterine lining
  (OPD procedure — no big surgery)
→ Myomectomy — fibroid removal (uterus saved)
→ Polypectomy — polyp removal (hysteroscopy)
→ Hysterectomy — uterus removal (LAST resort)
  (Only when nothing else works + family complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Heavy bleeding ka CAUSE find karna mandatory hai.
Koi bhi medicine lene se pehle QUALIFIED DOCTOR se
zaroor salah lein. Cancer rule out karna important hai
especially 40+ age mein. Self-medication risky hai.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — HOSPITAL (108 CALL):` },
      { severity: "YELLOW", text: `WITHIN 24-48 HOURS:` },
    ],
    relatedIds: [1, 5, 3],
  },
  {
    id: 7,
    slug: "missed-period",
    name: `Missed Period`,
    nameHi: `माहवारी न आना`,
    nameGu: `માસિક ન આવવું`,
    emoji: "❓",
    category: "MENSTRUAL",
    summary: `A missed period (amenorrhea) can be due to pregnancy, stress, weight changes, PCOS, thyroid issues, or perimenopause. The first step is a pregnancy test; if negative, look for the underlying cause based on patterns and history.`,
    whoGetsIt: ``,
    sections: {
      overview: `Period expected date pe na aana — miss ho jaana.
Alag situation ke hisaab se meaning alag hai:

TYPES:
PRIMARY AMENORRHEA:
→ Age 15-16 tak periods SHURU hi nahi hue
→ Breast development hai but periods nahi — by age 15
→ No breast development by age 13 — investigate
→ Rare — genetic/hormonal causes

SECONDARY AMENORRHEA:
→ Periods pehle aa rahe the but ab 3+ months se nahi aaye
→ MOST COMMON type
→ Sabse pehle: PREGNANCY RULE OUT KARO

OLIGOMENORRHEA:
→ Periods aate hain but 35+ din ka gap
→ Saal mein <9 periods
→ Often PCOS related

PHYSIOLOGICAL (NORMAL) AMENORRHEA:
→ Pregnancy — sabse common reason
→ Breastfeeding — lactational amenorrhea (normal)
→ Menopause — 45-55 age mein (normal)
→ Puberty first 2-3 years — irregular normal

CAUSES — SECONDARY AMENORRHEA:
PREGNANCY — #1 CAUSE — ALWAYS RULE OUT FIRST
→ Sexually active + missed period = pregnancy test FIRST
→ Even contraception use ke baad — no method 100%

HORMONAL:
→ PCOS — most common non-pregnancy cause in India
→ Thyroid — hypothyroid common
→ Prolactin high (Hyperprolactinemia)
→ Premature ovarian failure — early menopause
→ Pituitary tumour (rare)

LIFESTYLE:
→ STRESS — exam, job, relationship — VERY common
→ Extreme weight loss / eating disorder
→ Excessive exercise — athletes, dancers
→ Sudden weight gain
→ Travel / schedule change
→ Recently stopped birth control pills (1-3 months normal)

MEDICAL:
→ Uterine scarring (Asherman syndrome)
→ Medications — antidepressants, antipsychotics
→ Chronic illness

👩 WHEN TO WORRY vs NOT:
DON'T PANIC:
→ 1-2 weeks late — common, especially with stress
→ Just stopped pills — 1-3 months irregular normal
→ Breastfeeding — no period for months = normal
→ Recent stressful event — one cycle skip normal
→ Travel/timezone change — body adjusting

SEE A DOCTOR:
→ Sexually active + 1 week late — pregnancy test
→ 3+ months no period (not pregnant/breastfeeding)
→ Pattern suddenly changed
→ Other symptoms: weight gain, hair growth, acne (PCOS?)
→ Milky discharge from nipples (prolactin issue?)
→ Hot flashes under age 40 (premature menopause?)
→ Age 16+ — never had a period`,
      gharelu: `(⚠️ PREGNANCY RULE OUT KARO PEHLE — phir remedies try karo)

⚡ TO BRING ON DELAYED PERIOD:

1. ADRAK (GINGER / अदरक / આદુ) — ★ MOST EFFECTIVE
   → 1 inch fresh adrak — grate karo
   → 1 cup paani mein 5-7 min ubalo
   → Shahad daalo — din mein 2-3 baar
   → Emmenagogue — period laane mein madad
   → Blood flow uterus mein badhata hai
   → Period expected date se 4-5 din pehle shuru
   → ⚠️⚠️ PREGNANCY CONFIRM HAI TOH BILKUL NAHI

2. KACHCHA PAPITA (Raw Papaya / कच्चा पपीता / કાચું પપૈયું)
   → Green papaya daily — sabzi, salad, juice
   → Papain enzyme — uterine contractions stimulate
   → Period se 5-7 din pehle regular khaao
   → Traditionally used to induce periods
   → ⚠️⚠️ PREGNANCY MEIN BILKUL MAT KHAO — miscarriage risk

3. HALDI + DOODH + GUR (Turmeric Milk)
   → 1 tsp haldi + garam doodh + 1 tsp gur
   → Daily raat ko — 7-10 din tak
   → Emmenagogue + hormonal balance
   → Warming — uterine blood flow improve

4. AJWAIN + GUR (Carom + Jaggery)
   → 1 tsp ajwain + 1 tsp gur
   → Garam paani mein ubaal ke piyo
   → Subah khali pet — 5-7 din
   → Uterine stimulant — flow initiate karta hai
   → ⚠️ PREGNANCY MEIN NAHI

5. ALOE VERA / GHRITKUMARI (एलोवेरा / ઘૃતકુમારી)
   → 2 tbsp fresh gel + shahad — subah khali pet
   → Hormonal balancer — delayed period mein helpful
   → ⚠️ PREGNANCY MEIN AVOID
   → ⚠️ Period ke DAURAN mat lo — flow badh sakta

6. TIL (SESAME / तिल / તલ)
   → 1-2 tsp roasted til daily — chabao
   → Til + gur ka ladoo — traditional
   → Warming — blood flow stimulate
   → Hormone production support — zinc, magnesium

7. SAUNF + METHI (Fennel + Fenugreek)
   → 1 tsp saunf + 1 tsp methi dana
   → Raat ko paani mein bhigao
   → Subah khali pet piyo + seeds chabao
   → Combined hormonal + uterine effect

8. DALCHINI (CINNAMON / दालचीनी / તજ)
   → 1/2 tsp powder garam paani/doodh mein
   → Din mein 2 baar — daily
   → Insulin sensitivity + cycle regulation
   → PCOS-related missed period mein best
   → Research supported

9. VITAMIN C RICH FOODS — LOADING
   → Amla, orange, nimbu — excess mein khaao
   → Vitamin C progesterone level affect karta hai
   → High dose Vitamin C = period trigger kar sakta hai
   → 2-3 amla + 2 oranges daily for 5-7 days
   → ⚠️ Excess se acidity — pair karo kuch khaake

10. PARSLEY / AJMODA (अजमोद — different from ajwain)
    → Fresh parsley tea — 2-3 cups daily
    → Apiol + myristicin = emmenagogue
    → Strong effect — 3-5 din mein period aa sakta
    → ⚠️ PREGNANCY MEIN STRICTLY AVOID
    → ⚠️ Kidney issues mein avoid

LIFESTYLE CHANGES:
→ STRESS REDUCE — #1 if stress is the cause
  Meditation, yoga, deep breathing daily
→ Sleep 7-8 hours — circadian rhythm restore
→ Moderate exercise — not excessive
→ Warm foods + drinks — cold avoid
→ Hot water bath — relaxation + blood flow
→ Weight management — not too thin, not too heavy
→ Stop crash dieting — body needs nutrition for periods`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Missed period = "Nashta-artava" (absent menstruation) or
"Artava-kshaya" (diminished menstruation).
Vata dosha vitiation primary — Apana Vayu disrupted.
Also Kapha involvement — channels blocked (Srotavrodha).
Rasa-Rakta dhatu kshaya — nutritional deficiency.

🌿 KEY HERBS:

1. KUMARI / GHRITKUMARI (Aloe Vera / कुमारी / કુમારી)
   → Kumaryasava: 15-20ml + paani, after food, 2 baar
   → Ya fresh gel: 2 tbsp + shahad daily
   → Hormonal regulator + emmenagogue
   → Brand: Dabur ₹120-180/450ml
   → TEEN: 10-15ml | ADULT: 15-20ml
   → 🤰: ❌❌ STRICTLY AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. ASHOKA / अशोक / અશોક
   → 3-6g bark powder doodh ke saath — 2 baar
   → Menstrual cycle regulator — both heavy + absent
   → Brand: Himalaya ₹120-200
   → TEEN: 2-3g | ADULT: 3-6g
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. SHATAVARI / शतावरी / શતાવરી
   → 1 tsp churna doodh mein — 2 baar
   → Hormonal balance — estrogen modulator
   → Stress-related amenorrhea mein especially good
   → Brand: Himalaya ₹180-250
   → TEEN: 1/2 tsp | ADULT: 1 tsp
   → 🤰: ✅ SAFE
   → Duration: 3-6 months continuous
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. DASHMOOL / दशमूल / દશમૂળ
   → Kwath 20-30ml + garam paani — 2 baar
   → Vata shamak — Apana Vayu regulate
   → Brand: Baidyanath ₹120-200/450ml
   → 🤰: ✅ Safe post-delivery
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:

5. RAJAHPRAVARTINI VATI — ★ SPECIFICALLY FOR MISSED PERIOD
   → 2 tablets subah shaam garam paani se
   → Name literally = "that which induces menstruation"
   → STRONGEST Ayurvedic emmenagogue
   → Brand: Baidyanath ₹80-120/40tab
   → TEEN: 1 tab 2 baar | ADULT: 2 tab 2 baar
   → Use: Maximum 7-10 din — not long term
   → 🤰: ❌❌❌ ABSOLUTELY AVOID — abortifacient risk
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

6. ASHOKARISHTA — 15-20ml + paani, 2 baar
   → Menstrual cycle regulator — all types
   → Details in Condition #1
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. CHANDRAPRABHA VATI — 2 tab 2 baar
   → Hormonal + metabolic balance
   → PCOS-related amenorrhea mein helpful
   → Brand: Baidyanath ₹100-160/80tab
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. PHALA GHRITA — 1-2 tsp daily
   → Medicated ghee — reproductive tonic
   → Fertility + cycle restoration
   → Brand: Kottakkal ₹200-350/200ml
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

⚠️ SECTION DISCLAIMER:
Missed period ka SABSE COMMON kaaran PREGNANCY hai.
Koi bhi emmenagogue (period laane wali) dawa lene se pehle
PREGNANCY TEST karwa lein. Pregnant hone pe emmenagogue
lena BABY KE LIYE KHATARNAK hai. Koi bhi medicine
shuru karne se pehle Vaidya se salah lein.`,
      modern: `STEP 1 — PREGNANCY TEST (SABSE PEHLE):
→ Urine Pregnancy Test kit — ₹30-80
  Brand: Prega News, i-can, Velocit
→ Best: Morning first urine — most concentrated
→ Wait till 1 week after missed period for accuracy
→ Positive = CONGRATULATIONS (or see doctor for options)
→ Negative but still no period = try again in 1 week
→ Blood test (Beta hCG) — 100% accurate — ₹300-500

💊 IF NOT PREGNANT — TREATMENTS:

1. MEDROXYPROGESTERONE ACETATE (MPA) 10mg
   Hindi: मेड्रोक्सीप्रोजेस्टेरोन | Gujarati: મેડ્રોક્સીપ્રોજેસ્ટેરોન
   Brand: Deviry ₹50-80 | Meprate ₹40-60 (10 tab)
   
   DOSE ADULT:
   → 10mg daily for 5-10 days
   → Period aayega: 3-7 din BAAD medicine band karne ke
   → This is called "withdrawal bleed"
   → Doctor decides duration

   DOSE TEEN: Doctor decides — usually same dose

   🤰 PREGNANCY: ❌ RULE OUT FIRST — then take
   🤱 BREASTFEEDING: ⚠️ Consult doctor

   HOW IT WORKS:
   → Progesterone supplement — endometrium build-up support
   → When stopped — progesterone drop = period trigger
   → Also confirms: Uterus is functioning
   → If period doesn't come even after MPA — deeper cause

   SIDE EFFECTS:
   → COMMON: Bloating, mood changes, headache
   → UNCOMMON: Breast tenderness, nausea
   → RARE: Weight change, depression

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. NORETHISTERONE 5mg
   Brand: Primolut-N ₹30-50 (10 tab)
   → 5mg 1-3 times daily for 5-10 days
   → Period aayega 2-4 din baad stopping
   → Also used to POSTPONE periods (travel etc.)
   → 🤰: ❌ AVOID
   → SIDE EFFECTS: Nausea, headache, breast pain, mood
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. ORAL CONTRACEPTIVE PILLS — For Regulation
   → If underlying cause = hormonal imbalance
   → Provides regular artificial cycle
   → Doctor selects based on specific hormone issue
   → Details in Condition #2
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. METFORMIN — If PCOS is the cause
   → Details in Condition #3
   → 500-1500mg daily
   → Insulin → Hormones → Periods regulate
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. CABERGOLINE / BROMOCRIPTINE — If Prolactin High
   Brand: Caberlin ₹200-400 | Proctinal ₹150-300
   → Lowers prolactin → periods resume
   → ONLY when blood test confirms high prolactin
   → SIDE EFFECTS: Nausea, dizziness, headache
   → 🤰: ❌ Stop when pregnant
   → ⚠️ SPECIALIST PRESCRIBED — Endocrinologist

💊 SUPPLEMENTS:

6. VITAMIN D3 — If deficient
   → 60,000 IU weekly × 8 weeks
   → 70% Indian women deficient — affects hormones
   → GET TESTED — don't guess
   → 🤰: ✅ Safe + Essential

7. INOSITOL (Myo-Inositol) — If PCOS
   → 2000mg + 50mg DCI daily
   → Details in Condition #3
   → 🤰: ✅ Safe

8. OMEGA-3 + ZINC + B-COMPLEX
   → General hormonal support
   → All safe in normal doses
   → 🤰: ✅ Safe

💊 TESTS:
→ Pregnancy test — FIRST
→ Hormonal panel: FSH, LH, Prolactin, Estradiol, AMH
→ Thyroid: TSH, T3, T4
→ PCOS check: Testosterone, DHEA-S, Fasting insulin
→ Ultrasound: Pelvic — ovaries + uterus
→ If needed: MRI pituitary (prolactinoma check)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Missed period ka sabse common kaaran PREGNANCY hai.
Koi bhi medicine lene se pehle PREGNANCY TEST ZAROOR karo.
Doctor se consult karo — self-medication risky hai.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY:` },
      { severity: "YELLOW", text: `WITHIN 1 WEEK:` },
    ],
    relatedIds: [3, 2, 4],
  },
  {
    id: 8,
    slug: "pregnancy-back-pain",
    name: `Pregnancy Back Pain`,
    nameHi: `गर्भावस्था में कमर दर्द`,
    nameGu: `સગર્ભાવસ્થામાં કમર દુખાવો`,
    emoji: "🦴",
    category: "PREGNANCY",
    summary: `Pregnancy back pain affects 50-80% of pregnant women, especially in the second and third trimesters. It is caused by weight shift, hormonal ligament softening, and posture changes. Most cases improve with posture, support, and gentle exercise.`,
    whoGetsIt: ``,
    sections: {
      overview: `Pregnancy mein lower back pain (kamar dard) bahut common hai —
50-70% pregnant women ko hota hai. Baby ka weight badhne se
spine pe pressure aata hai, hormones ligaments loose karte hain,
aur posture change hota hai — yeh sab milke back pain cause
karte hain. Usually 2nd aur 3rd trimester mein zyada hota hai.

TYPES:
LUMBAR PAIN (Lower Back):
→ Kamar ke nichle hisse mein — spine ke paas
→ Baithne, khade hone, jhukne mein badh jaata hai
→ Sabse common type — 60-70% cases

POSTERIOR PELVIC PAIN:
→ Kamar se neeche — buttocks ke area mein
→ Deep, aching pain — one or both sides
→ Walking, stairs, bed pe side turn mein badh jaata
→ Sacroiliac joint pain — hormone relaxin ki wajah se
→ 30-40% pregnant women ko yeh specific pain hota

SCIATICA:
→ Kamar se pair tak dard jaata hai — nerve compression
→ Shooting, sharp, electric-like pain
→ Usually one leg mein — numbness/tingling bhi
→ Rare in pregnancy — 1% women
→ Usually 3rd trimester mein

WHY HAPPENS IN PREGNANCY:
→ WEIGHT GAIN: 10-15 kg extra — spine pe load
→ RELAXIN HORMONE: Ligaments loose karta hai — joints unstable
→ CENTER OF GRAVITY: Baby aage badhta hai — posture change
→ MUSCLE SEPARATION: Diastasis recti — abdominal muscles alag
→ STRESS: Emotional stress = muscle tension = back pain
→ POSTURE: Lordosis badh jaata hai (back curve)

TIMELINE:
→ 1st Trimester: Mild — hormonal changes starting
→ 2nd Trimester: Increasing — baby growing
→ 3rd Trimester: Peak — maximum weight + pressure
→ After Delivery: Usually resolves 3-6 months (most women)`,
      gharelu: `(🤰 ALL REMEDIES PREGNANCY SAFE)

⚡ INSTANT RELIEF:

1. GARAM SIKAI / WARM COMPRESS (गर्म सिकाई / ગરમ શેક)
   → Garam paani ki bottle ya heating pad — lower back pe
   → 15-20 min — din mein 2-3 baar
   → Kapda wrap karo — seedha skin pe nahi
   → Muscles relax hote hain — pain reduce
   → ⚠️ PREGNANCY: ✅ SAFE — moderate temperature
   → ⚠️ Pet/abdomen pe mat rakho — sirf BACK pe
   → ⚠️ Bahut garam nahi — comfortable warm

2. COLD COMPRESS (for acute pain/inflammation)
   → Ice pack wrapped in towel — 10-15 min
   → Inflammation aur swelling ke liye better
   → Alternate: 20 min warm → 20 min cold
   → ⚠️ Direct ice skin pe nahi — always wrap

3. HALDI WALA DOODH (Golden Milk / हल्दी दूध / હળદરનું દૂધ)
   → 1 tsp haldi + garam doodh + chutki kaali mirch
   → Raat ko sone se pehle — daily
   → Curcumin = natural anti-inflammatory
   → Pain reduce + neend achhi
   → ✅ SAFE in pregnancy — moderate amounts
   → ⚠️ 1 tsp/day max — zyada nahi

4. ADRAK KI CHAI (Ginger Tea / अदरक चाय)
   → 1 inch adrak grated + garam paani
   → Din mein 2 cup max — pregnancy mein limit
   → Anti-inflammatory + warming
   → ✅ SAFE — but 3 cups/day se zyada nahi

5. TIL KA TEL MASSAGE (Sesame Oil / तिल तेल / તલ તેલ)
   → Halka garam til ka tel — lower back pe gentle massage
   → 10-15 min circular motion
   → Partner se karwao — khud jhukna mushkil
   → Warming + muscle relaxant + traditional remedy
   → ✅ SAFE in pregnancy — external use
   → ⚠️ Gentle pressure ONLY — deep tissue nahi

6. NAMAK PANI SOAK (Epsom Salt Bath)
   → 1-2 cup Epsom salt garam paani mein (bath ya bucket)
   → Pair daalo ya half-body soak — 15-20 min
   → Magnesium absorb hota hai — muscle relaxant
   → Pain + swelling dono kam
   → ✅ SAFE in pregnancy
   → ⚠️ Paani bahut garam nahi — warm enough
   → ⚠️ Hot tub/jacuzzi AVOID — temperature too high

🧘 PREGNANCY-SAFE EXERCISES — MOST IMPORTANT:

7. CAT-COW STRETCH (Marjaryasana) — ★ BEST FOR PREGNANCY BACK
   → Hands & knees position (all fours)
   → Inhale: Back neeche, sir upar (Cow)
   → Exhale: Back upar (arch), chin chest pe (Cat)
   → 10 slow reps — din mein 2-3 baar
   → Spine flexibility + pelvic floor activation
   → ✅ SAFE all trimesters

8. PELVIC TILT (Standing / Lying)
   → Standing: Wall ke against khade ho
   → Lower back ko wall mein press karo — hold 5 sec
   → Ya lying: Knees bent, flat on back
   → Lower back floor mein press — hold 5 sec
   → 10 reps — 3 times daily
   → Core strength — spine support
   → ✅ SAFE all trimesters (lying position avoid after 20 weeks)

9. PRENATAL YOGA — RECOMMENDED POSES:
   → Tadasana (Mountain Pose) — posture improve
   → Trikonasana (Triangle) — side stretch
   → Viparita Karani (Legs up wall) — swelling + back
   → Baddha Konasana (Butterfly) — hip open
   → Side-lying Shavasana — relaxation
   → ⚠️ AVOID: Deep twists, lying flat on back (after 20 weeks),
     inversions, hot yoga, anything uncomfortable

10. SWIMMING / WATER WALKING
    → Water mein body weight 50% kam feel hota hai
    → Back pe pressure dramatically reduce
    → Gentle exercise — cardiovascular + muscular
    → ✅ SAFE — most doctors recommend
    → ⚠️ Clean pool — infection risk avoid

11. WALKING — 20-30 min daily
    → Gentle, moderate pace — flat surface
    → Blood circulation improve — back muscles active
    → ✅ SAFE throughout pregnancy
    → Good shoes zaruri — cushioned, supportive

POSTURE & DAILY TIPS:
→ SITTING: Back straight, lumbar support cushion, feet flat
  (Computer pe kaam? Chair adjust karo — back supported)
→ STANDING: Weight equally on both feet, don't lock knees
  (Lamba khade rehna ho toh ek pair stool pe rakho alternate)
→ SLEEPING: Left side — pillow between knees
  (Pregnancy pillow invest karo — ₹500-1500 — worth it)
→ BENDING: Knees bend karo — back se mat jhuko
  (Neeche ki cheez uthani ho toh squat karo)
→ DRIVING: Seat achhi position mein, lumbar support
→ SHOES: Flat, comfortable — heels BILKUL NAHI
→ LIFTING: Heavy cheezein mat uthao — help lo`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Pregnancy back pain = Vata prakopa in Kati pradesha (lumbar region).
Pregnancy mein Vata naturally badh jaata hai — Apana Vayu.
Weight gain + Vata = pain in bones, joints, muscles.
Treatment: Vata shamak (Vata reducing) — warm, oily, gentle.

🌿 PREGNANCY-SAFE AYURVEDIC REMEDIES:

1. BALA TAIL MASSAGE (बला तैल / બળા તેલ) — ★ BEST
   → Halka garam Bala tail — lower back pe massage
   → 15-20 min — gentle, circular
   → Vata shamak — #1 oil for pregnancy
   → Traditionally used throughout pregnancy
   → Brand: Kottakkal ₹200-350/200ml | Arya Vaidya ₹180-300
   → ✅ SAFE in pregnancy — external use
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. DHANWANTARAM TAILAM (धन्वन्तरम तैलम / ધન્વન્તરમ તૈલમ)
   → Most famous pregnancy oil in Ayurveda
   → Lower back + legs + full body massage
   → Vata shamak + muscle strengthening
   → Brand: Kottakkal ₹250-400/200ml
   → ✅ SAFE — specifically designed for pregnancy
   → Used from 7th month onwards traditionally
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. DASHMOOL KWATH (दशमूल काढ़ा / દશમૂળ ક્વાથ)
   → 20ml + equal warm water — 2 baar daily
   → Anti-inflammatory + Vata shamak
   → Bone and joint pain specifically
   → Brand: Baidyanath ₹120-200/450ml
   → ✅ SAFE in pregnancy — traditionally used
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. SHATAVARI / शतावरी / શતાવરી
   → 1/2 - 1 tsp churna doodh mein — daily
   → Nutritive + cooling + muscle support
   → General pregnancy wellness herb
   → ✅ SAFE — pregnancy tonic
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. ERANDA TAIL (Castor Oil / एरंड तेल / એરંડ તેલ) — EXTERNAL
   → Warm castor oil — lower back pe massage
   → Followed by warm compress — 20 min
   → Deep muscle penetration — pain relief
   → ✅ SAFE externally in pregnancy
   → ⚠️ DO NOT TAKE INTERNALLY in pregnancy — laxative

AYURVEDIC LIFESTYLE (GARBHINI PARICHARYA):
→ Abhyanga (oil massage) daily — Bala tail ya til tel
→ Warm milk with ghee at bedtime
→ Avoid Vata aggravating: cold food, excess travel, late nights
→ Gentle yoga — Vata shamak poses only
→ Warm water bath — not too hot
→ Adequate rest — overexertion avoid

⚠️ SECTION DISCLAIMER:
Pregnancy mein koi bhi Ayurvedic treatment lene se pehle
QUALIFIED VAIDYA + GYNAECOLOGIST dono se salah lein.
External oil massage generally safe hai but conditions
jaise placenta previa mein abdomen massage avoid karo.`,
      modern: `💊 SAFE PAIN RELIEF IN PREGNANCY:

1. PARACETAMOL / ACETAMINOPHEN 500mg
   Hindi: पैरासिटामोल | Gujarati: પેરાસિટામોલ
   Brand: Crocin (GSK) | Dolo (Micro) | Calpol (GSK)
   Price: ₹10-25 per strip (10 tab)

   DOSE ALL TRIMESTERS:
   → 500mg-1g (1-2 tablets) every 6-8 hours
   → Max: 4g/day (8 tablets of 500mg) — but try minimum
   → With or without food — both okay

   🤰 PREGNANCY: ✅ SAFEST PAINKILLER — Category B
     ONLY painkiller considered safe throughout pregnancy
   🤱 BREASTFEEDING: ✅ Safe

   SIDE EFFECTS:
   → Very few at normal doses
   → RARE: Liver damage (only at very high/chronic doses)
   → ⚠️ Max 4g/day HARD LIMIT — liver damage risk above
   → ⚠️ Don't combine with other paracetamol-containing meds
     (Many cold/flu meds contain paracetamol — check)

   NOTE: Paracetamol is for pain relief, not anti-inflammatory.
   For back pain, it helps moderate pain but may not be
   enough for severe cases — then physical therapy more important.

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

❌ MEDICINES TO AVOID IN PREGNANCY:
→ ❌ Ibuprofen (Brufen) — especially 3rd trimester
→ ❌ Naproxen — avoid all trimesters
→ ❌ Mefenamic Acid (Meftal) — avoid
→ ❌ Aspirin (high dose) — avoid (low-dose okay if doctor says)
→ ❌ Diclofenac (Voveran) — avoid
→ ❌ Muscle relaxants (Myospaz) — most unsafe
→ ❌ Any NSAID in 3rd trimester = DANGEROUS

💊 NON-MEDICINE TREATMENTS (Doctor Recommended):

2. PHYSIOTHERAPY — ★ MOST EFFECTIVE TREATMENT
   → Pelvic tilt exercises
   → Core strengthening (transverse abdominis)
   → Stretching program — hamstring, hip flexor
   → Posture correction training
   → Water therapy (hydrotherapy)
   → 6-8 sessions usually — ₹500-1000/session
   → ✅ SAFE + most evidence-based treatment

3. PREGNANCY SUPPORT BELT / MATERNITY BELT
   Brand: Various — ₹500-2000
   → Velcro belt — lower back + belly support
   → Takes weight off spine — instant relief
   → Wear during walking, standing, chores
   → ✅ SAFE — no risk
   → Don't wear while sleeping
   → Don't wear too tight — circulation

4. TRANSCUTANEOUS ELECTRICAL NERVE STIMULATION (TENS)
   → Small device — electrical pulses for pain
   → Applied on back — blocks pain signals
   → ✅ SAFE in pregnancy (NOT on abdomen)
   → Available: ₹1500-3000 for home device
   → ⚠️ Not on abdomen, not on acupuncture points
     that stimulate uterus

5. PRENATAL MASSAGE — BY TRAINED THERAPIST
   → Specifically trained pregnancy massage therapist
   → Side-lying position — never flat on stomach
   → ✅ SAFE after first trimester
   → ₹500-1500 per session
   → ⚠️ Not in first trimester
   → ⚠️ Avoid if: high-risk pregnancy, preeclampsia,
     deep vein thrombosis history

💊 SUPPLEMENTS:

6. CALCIUM 500mg + VITAMIN D3 — Daily
   → Bone + muscle support
   → Brand: Shelcal ₹100-150
   → ✅ ESSENTIAL in pregnancy
   → Take at night — separate from iron (2 hr gap)

7. MAGNESIUM 250-350mg — Daily
   → Muscle relaxant — cramps + back pain reduce
   → Magnesium glycinate preferred — less laxative
   → ✅ SAFE in pregnancy — often recommended
   → May also help with sleep

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
Pregnancy mein PARACETAMOL ke alawa koi bhi painkiller
doctor ke bina mat lo. Physical therapy + exercise + posture
correction = medicines se zyada effective hai.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — HOSPITAL:` },
      { severity: "YELLOW", text: `WITHIN 24 HOURS:` },
    ],
    relatedIds: [4],
  },
  {
    id: 9,
    slug: "gestational-diabetes",
    name: `Gestational Diabetes (GDM)`,
    nameHi: `गर्भकालीन मधुमेह`,
    nameGu: `સગર્ભાવસ્થા ડાયાબિટીસ`,
    emoji: "🍬",
    category: "PREGNANCY",
    summary: `Gestational Diabetes Mellitus (GDM) is high blood sugar that develops during pregnancy, usually diagnosed at 24-28 weeks. It affects around 10-15% of Indian pregnancies and is managed through diet, monitoring, and sometimes insulin.`,
    whoGetsIt: `→ Age >25 years
→ Overweight/obese before pregnancy (BMI>25)
→ Family history of diabetes (parent/sibling)
→ Previous GDM in earlier pregnancy
→ PCOS history
→ Previous large baby (>4 kg)
→ Previous stillbirth/miscarriage
→ South Asian ethnicity — HIGHER risk than global average
→ Sedentary lifestyle

SCREENING — WHEN & HOW:
→ All Indian pregnant women: 24-28 weeks (compulsory)
→ High risk: First visit + repeat at 24-28 weeks
→ Test: OGTT (Oral Glucose Tolerance Test)
  — 75g glucose drink → blood test at fasting, 1 hour, 2 hours
→ Diagnostic values (WHO/DIPSI):
  Fasting ≥92 mg/dL = GDM
  1 hour ≥180 mg/dL = GDM
  2 hour ≥153 mg/dL = GDM
  (ANY one value above = GDM diagnosis)

EFFECTS ON BABY IF UNCONTROLLED:
→ Macrosomia — baby bahut bada (>4 kg) — delivery problem
→ Birth injuries — shoulder dystocia
→ Neonatal hypoglycemia — baby ka sugar low after birth
→ Jaundice in newborn
→ Respiratory problems
→ LONG TERM: Baby ko future mein obesity + diabetes risk

EFFECTS ON MOTHER:
→ Preeclampsia risk badhta hai (high BP in pregnancy)
→ C-section chances zyada
→ Polyhydramnios (excess amniotic fluid)
→ Future Type 2 diabetes — 50% risk
→ Recurrence in next pregnancy — 30-50%`,
    sections: {
      overview: `Pregnancy ke dauran diabetes (blood sugar badh jaana) jo
pehle nahi tha. Pregnancy hormones insulin ko properly kaam
karne nahi dete — "insulin resistance" — aur blood sugar badh
jaata hai. Usually 24-28 weeks pe diagnose hota hai.

KEY FACTS:
→ 10-15% Indian pregnant women ko GDM hota hai
→ India = "diabetes capital" — genetic risk HIGH
→ Usually resolves after delivery (90% cases)
→ BUT: 50% women ko later life mein Type 2 diabetes hota hai
→ If untreated: Baby too large, delivery complications,
  baby's blood sugar low after birth

WHO IS AT RISK:
→ Age >25 years
→ Overweight/obese before pregnancy (BMI>25)
→ Family history of diabetes (parent/sibling)
→ Previous GDM in earlier pregnancy
→ PCOS history
→ Previous large baby (>4 kg)
→ Previous stillbirth/miscarriage
→ South Asian ethnicity — HIGHER risk than global average
→ Sedentary lifestyle

SCREENING — WHEN & HOW:
→ All Indian pregnant women: 24-28 weeks (compulsory)
→ High risk: First visit + repeat at 24-28 weeks
→ Test: OGTT (Oral Glucose Tolerance Test)
  — 75g glucose drink → blood test at fasting, 1 hour, 2 hours
→ Diagnostic values (WHO/DIPSI):
  Fasting ≥92 mg/dL = GDM
  1 hour ≥180 mg/dL = GDM
  2 hour ≥153 mg/dL = GDM
  (ANY one value above = GDM diagnosis)

EFFECTS ON BABY IF UNCONTROLLED:
→ Macrosomia — baby bahut bada (>4 kg) — delivery problem
→ Birth injuries — shoulder dystocia
→ Neonatal hypoglycemia — baby ka sugar low after birth
→ Jaundice in newborn
→ Respiratory problems
→ LONG TERM: Baby ko future mein obesity + diabetes risk

EFFECTS ON MOTHER:
→ Preeclampsia risk badhta hai (high BP in pregnancy)
→ C-section chances zyada
→ Polyhydramnios (excess amniotic fluid)
→ Future Type 2 diabetes — 50% risk
→ Recurrence in next pregnancy — 30-50%`,
      gharelu: `🥗 GDM DIET — SABSE IMPORTANT (Yeh MEDICINE se zyada kaam karta):

GOLDEN RULES:
→ SMALL FREQUENT MEALS — 6 meals/day (3 main + 3 snacks)
→ NO meal skipping — blood sugar crash bhi dangerous
→ Protein + Fat + Fibre EVERY meal — slow sugar release
→ NO carbs alone EVER — always pair with protein/fat
→ Measure portions — quantity matters
→ Consistent meal times — body clock stable
→ Last snack before bed — overnight sugar stable

WHAT TO EAT — SAFE FOODS:
→ COMPLEX CARBS (Low GI):
  Jowar roti ★ (lowest GI)
  Bajra roti ★
  Ragi/Nachni — calcium bonus
  Brown rice (small portion)
  Whole wheat roti (1-2 max per meal)
  Oats — steel cut, not instant
  Daliya — savoury better than sweet

→ PROTEIN (EVERY meal mein):
  Dal/Lentils — moong, masoor, toor
  Paneer — 50-80g per serving
  Eggs — 1-2 daily (excellent protein)
  Chicken/Fish — grilled/baked (non-veg)
  Curd/Yogurt — plain, unsweetened (probiotic)
  Chana/Rajma — protein + fibre combo
  Tofu — soy protein

→ HEALTHY FATS:
  Ghee — 2-3 tsp daily (slows carb absorption!)
  Nuts — 10 badam, 5 akhrot daily
  Seeds — til, alsi, pumpkin
  Coconut — fresh/oil in moderation
  Avocado — if available

→ VEGETABLES (Unlimited — most):
  Green leafy — palak, methi, sarson
  Bottle gourd (lauki), Ridge gourd (turai)
  Karela (bitter gourd) ★ — natural sugar reducer
  Broccoli, beans, cabbage, cauliflower
  Capsicum, tomato, cucumber
  ⚠️ LIMIT: Potato, arbi, yam — starchy

→ FRUITS (Limited — high sugar):
  ✅ SAFE: Apple, pear, guava, jamun, orange (1-2/day)
  ⚠️ LIMIT: Banana (half), mango (small piece)
  ❌ AVOID: Grapes, chiku, custard apple, watermelon excess

WHAT TO AVOID — STRICTLY:
→ ❌ Sugar/Meetha — mithai, chocolate, biscuit, cake
→ ❌ White rice (large portions) — switch to brown/jowar
→ ❌ Maida — naan, pasta, white bread, maggi
→ ❌ Cold drinks/Soda — liquid sugar bomb
→ ❌ Fruit juice — fibre removed = sugar spike
  (Eat WHOLE fruit instead — fibre slows sugar)
→ ❌ Honey/Jaggery excess — still sugar!
→ ❌ Potatoes/Chips — high GI starch
→ ❌ Instant oats, cornflakes — processed = high GI

🍵 BLOOD SUGAR REDUCING DRINKS:

1. METHI DANA WATER (Fenugreek / मेथी / મેથી) — ★ PROVEN
   → 1-2 tsp methi dana — raat ko paani mein bhigao
   → Subah khali pet paani piyo + dana chabao
   → RESEARCH: Significantly reduces fasting glucose in GDM
   → Fibre + compounds = insulin sensitivity improve
   → ✅ SAFE in pregnancy in food amounts
   → ⚠️ Excess avoid — uterine stimulant in very high doses

2. KARELA JUICE (Bitter Gourd / करेला / કારેલું) — ★ PROVEN
   → 30ml fresh juice — subah khali pet
   → Ya karela sabzi 2-3 times/week
   → Charatin + polypeptide-p = insulin-like effect
   → ✅ SAFE in pregnancy — food item
   → ⚠️ Taste bitter — mix with nimbu + kala namak
   → ⚠️ Excess se hypoglycemia (sugar too low)

3. DALCHINI (CINNAMON) WATER
   → 1/2 tsp dalchini garam paani mein — subah
   → Insulin sensitivity improve karta hai
   → ✅ SAFE in food amounts
   → ⚠️ Max 1/2 tsp/day in pregnancy

4. AMLA (Indian Gooseberry)
   → 1 fresh amla daily ya 15ml juice
   → Chromium content — glucose metabolism
   → Vitamin C — antioxidant
   → ✅ SAFE in pregnancy

5. JEERA WATER (Cumin)
   → 1 tsp jeera ubalo — chhaan ke piyo
   → Insulin sensitivity support
   → Digestive + blood sugar — dual benefit
   → ✅ SAFE in pregnancy

SAMPLE MEAL PLAN:

06:30 — Wake-up: Methi paani
07:00 — Breakfast: 1 jowar roti + sabzi + 1 egg
10:00 — Snack: 10 badam + 1 apple
12:30 — Lunch: 1 roti + dal + sabzi + salad + curd
03:30 — Snack: Chana chaat + chai (no sugar)
06:30 — Dinner: 1 roti + paneer sabzi + green salad
09:00 — Bedtime snack: 1 glass doodh + 2 akhrot

🏃 EXERCISE — SECOND PILLAR:
→ 30 min walk after EVERY major meal — blood sugar 20% kam
→ Most effective: 10-15 min walk after dinner
→ Prenatal yoga — insulin sensitivity improve
→ Swimming — gentle + effective
→ ⚠️ Doctor se clearance lo pehle
→ ⚠️ Heavy exercise avoid — moderate only
→ ⚠️ Blood sugar monitor karo before/after exercise`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
GDM = "Garbhini Prameha" (pregnancy diabetes).
Kapha + Meda dhatu dushti — excess sweetness in body.
Agni mandya (weak digestion) → improper metabolism.
Treatment: Agni strengthen + Kapha reduce + Meda dhatu balance.

🌿 PREGNANCY-SAFE AYURVEDIC SUPPORT:

1. METHI / FENUGREEK (as above — food level)
   → Ayurveda mein bhi Prameha ke liye classical remedy
   → ✅ SAFE in pregnancy — food amounts
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. JAMUN (Indian Blackberry / जामुन / જાંબુ)
   → Fresh fruit in season — eat freely
   → Jamun seed powder: 1/2 tsp daily
   → Classical Prameha remedy — sugar reducing
   → ✅ SAFE in pregnancy — food item
   → ⚠️ Seed powder — consult Vaidya for dose

3. KARELA (as above — food level)
   → Classical Prameha nashak — sugar destroyer
   → ✅ SAFE as food

4. TURMERIC (HALDI) — moderate daily
   → Anti-inflammatory + mild sugar reducer
   → ✅ SAFE in food amounts
   → ⚠️ Supplement form avoid — food amount only

5. TRIPHALA — ⚠️ CAUTION IN PREGNANCY
   → Classical for Prameha — metabolism improve
   → BUT: Mild laxative → uterine stimulation risk
   → ⚠️ ONLY under Vaidya supervision in pregnancy
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

AYURVEDIC DIET PRINCIPLES FOR GDM:
→ Yava (Barley) — lowest GI grain in Ayurveda
→ Mudga (Moong dal) — light, digestible, low sugar
→ Bitter vegetables (tikta rasa) — karela, methi
→ Warm, freshly cooked food — agni support
→ Avoid: Sweet (madhura), heavy, cold, leftovers
→ Avoid: Dahi at night — Kapha badhta

⚠️ SECTION DISCLAIMER:
GDM serious pregnancy complication hai. Ayurvedic
remedies SUPPLEMENT hain, REPLACEMENT nahi. Medical
monitoring (blood sugar testing, doctor visits) MANDATORY
hai. Insulin zaruri ho toh avoid mat karo.`,
      modern: `💊 TREATMENT APPROACH (Step-wise):

STEP 1: DIET + EXERCISE (2 weeks try karo)
→ 80% GDM women mein sirf diet se control hota hai
→ Blood sugar monitoring start — glucometer kharido
→ Targets:
  Fasting: <95 mg/dL
  1 hour after meal: <140 mg/dL
  2 hours after meal: <120 mg/dL

STEP 2: IF DIET FAILS → MEDICINE

1. METFORMIN 500mg (First choice oral medicine)
   Hindi: मेटफॉर्मिन | Gujarati: મેટફોર્મિન
   Brand: Glycomet (USV) ₹15-25 | Glucophage ₹20-35
   
   DOSE:
   → Start: 500mg once daily with dinner
   → Increase: 500mg twice (if needed) — doctor decides
   → Max usually: 2000mg/day in pregnancy
   → ALWAYS with food — reduces side effects

   🤰 PREGNANCY: ⚠️ Growing evidence of safety
     Many doctors now use it first before insulin
     Crosses placenta but no birth defect evidence
     Doctor decides based on your case

   HOW IT WORKS:
   → Reduces insulin resistance
   → Liver sugar output kam karta hai
   → Doesn't cause low sugar (hypoglycemia) — safe

   SIDE EFFECTS:
   → COMMON: Nausea, diarrhea (first 2 weeks, settles)
   → TIP: Start low, increase slowly, with food
   → Extended release (XR) = less GI issues

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

STEP 3: IF METFORMIN NOT ENOUGH → INSULIN

2. INSULIN — GOLD STANDARD FOR GDM
   → Injection — subcutaneous (skin ke neeche)
   → Self-inject karna seekho — nurse/doctor sikhaayenge
   → DOES NOT cross placenta — baby ko nahi pahunchta
   → SAFEST medicine for GDM — proven

   TYPES:
   → Rapid-acting: Before meals (Insulin Aspart/Lispro)
   → Long-acting: Once daily (Insulin Detemir/NPH)
   → Doctor decides which type + dose — very individualized
   
   Brand: Humalog ₹400-600 | NovoRapid ₹500-700
         Insulatard ₹200-300 (per vial)
   
   🤰 PREGNANCY: ✅ SAFEST — doesn't reach baby
   
   SIDE EFFECTS:
   → Hypoglycemia (blood sugar too low) — learn symptoms:
     Sweating, shaking, confusion, hunger, dizziness
     → Treatment: Glucose tablet/juice immediately
   → Injection site: Redness, pain (rotates sites)
   → Weight gain

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 BLOOD SUGAR MONITORING:

3. GLUCOMETER — KHARIDO (₹800-2000)
   Brand: Accu-Chek ₹900-1500 | OneTouch ₹800-1200
         Dr. Morepen ₹600-900
   Test Strips: ₹15-25 per strip
   
   MONITORING SCHEDULE (as doctor advises):
   → Fasting: Subah uthke, kuch khaane se pehle
   → Post-breakfast: 1 hour after first bite
   → Post-lunch: 1 hour after first bite
   → Post-dinner: 1 hour after first bite
   → Bedtime: Optional
   
   LOG BOOK rakhlo — har reading likho — doctor ko dikhao

   TARGETS:
   → Fasting: 70-95 mg/dL ✅
   → 1 hour post-meal: <140 mg/dL ✅
   → 2 hours post-meal: <120 mg/dL ✅
   → HbA1c: <6.0% ✅

💊 SUPPLEMENTS:

4. CHROMIUM — 200mcg daily
   → Insulin sensitivity improve
   → Some evidence for GDM benefit
   → ✅ Safe in pregnancy at this dose

5. VITAMIN D — If deficient
   → Deficiency worsens insulin resistance
   → Test karo → supplement karo
   → ✅ Safe

6. INOSITOL — Myo-inositol 2000mg
   → Some evidence for GDM prevention/management
   → ✅ Safe in pregnancy
   → May reduce insulin need

💊 IMPORTANT MONITORING DURING GDM:
→ Blood sugar: Daily (4-6 times as advised)
→ Doctor visits: Every 2-4 weeks
→ Ultrasound: Every 4 weeks (baby size + fluid)
→ Non-stress test: Week 32 onwards (baby heartbeat)
→ HbA1c: Every 4-6 weeks
→ Kidney function: Periodic
→ Eye check: If diabetes prolonged

💊 DELIVERY PLANNING:
→ Well-controlled GDM: Normal delivery possible at 39-40 weeks
→ Poorly controlled: Early delivery may be needed (37-39)
→ Very large baby: C-section may be recommended
→ Blood sugar monitoring during labor
→ Baby's sugar checked after birth (first 24 hours)

💊 AFTER DELIVERY:
→ Usually GDM resolves within hours of delivery
→ OGTT at 6-12 weeks post-delivery — confirm resolved
→ Annual diabetes screening — lifelong (50% future risk)
→ Breastfeed — reduces diabetes risk for both mom + baby
→ Healthy diet + exercise — continue forever
→ Weight management — crucial for prevention

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
GDM medical monitoring MANDATORY hai. Diet pehle try karo
but agar doctor insulin kahe toh AVOID MAT KARO — baby ke
liye zaroori hai. Self-management se complications badh
sakte hain. NutriMama medical prescription NAHI deta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — HOSPITAL:` },
      { severity: "YELLOW", text: `WITHIN 24 HOURS:` },
    ],
    relatedIds: [8, 4, 3],
  },
  {
    id: 10,
    slug: "uti",
    name: `UTI (Urinary Tract Infection)`,
    nameHi: `मूत्र मार्ग संक्रमण`,
    nameGu: `પેશાબ માર્ગ ચેપ`,
    emoji: "💧",
    category: "GENERAL_HEALTH",
    summary: `A urinary tract infection (UTI) causes burning urination, frequency, and pelvic pain. Women are anatomically prone, with up to 50% experiencing one in their lifetime. Most respond to antibiotics; untreated UTIs can spread to the kidneys.`,
    whoGetsIt: `- Women > Men (30:1 ratio)
- Sexually active women — "honeymoon cystitis"
- Pregnant women — 4-10% get UTI
- Diabetic women
- Post-menopausal women
- Women using diaphragm/spermicide
- History of previous UTI — 20-30% recurrence

SYMPTOMS:
→ Peshab mein jalan (burning) — CLASSIC symptom
→ Baar baar peshab jaana (frequency) — thoda thoda
→ Peshab karne ki urgency — rok nahi paate
→ Lower abdomen/pelvis mein dard ya pressure
→ Cloudy peshab — clear nahi
→ Strong smell — peshab mein badbu
→ Pink/red peshab — blood ho sakta (hematuria)
→ Pelvic area mein heaviness

KIDNEY INFECTION ADDITIONAL SYMPTOMS:
→ Fever + chills — body tapp raha
→ Back pain — one or both sides, flank area
→ Nausea/vomiting
→ Extreme fatigue
→ ⚠️ These symptoms = URGENT medical attention`,
    sections: {
      overview: `Urinary tract (peshab ki nali) mein bacterial infection.
Women mein MEN se 30 times zyada common — anatomy ki wajah se
(urethra chhoti hoti hai — bacteria easily reach bladder).
Bahut common — 50% women ko life mein kam se kam ek baar hota.

TYPES:
CYSTITIS (Bladder Infection):
→ Sabse common type
→ Peshab mein jalan, baar baar jaana, lower abdominal pain
→ Usually not dangerous — but treatment zaroori

URETHRITIS (Urethra Infection):
→ Peshab ki nali mein infection
→ Jalan + discharge
→ Sexually transmitted bhi ho sakta (Chlamydia, Gonorrhea)

PYELONEPHRITIS (Kidney Infection):
→ SERIOUS — infection kidney tak pahunch gayi
→ Fever, chills, back/side pain, vomiting
→ 🔴 EMERGENCY — hospital admission zaroori
→ Pregnancy mein especially dangerous

CAUSES:
→ E. coli bacteria — 80-90% UTIs
→ Sexual activity — bacteria push hota hai
→ Poor hygiene — back to front wiping
→ Dehydration — concentrated urine = bacteria grow
→ Holding urine — zyada der tak rokna
→ Diabetes — sugar in urine = bacteria love
→ Pregnancy — uterus bladder pe pressure + slow urine flow
→ Menopause — estrogen kam = mucosal protection kam
→ Kidney stones — urine flow obstruction
→ Catheter use — hospital mein`,
      gharelu: `⚠️ IMPORTANT: UTI bacterial infection hai — antibiotics chahiye.
Gharelu nuskhe SUPPORT karte hain but REPLACE nahi karte.
Mild symptoms mein try karo — 24-48 hours mein better na ho
toh DOCTOR ZAROOR jao. Kidney infection mein SIRF doctor.

⚡ IMMEDIATE RELIEF + PREVENTION:

1. PAANI — ZYADA PIYO — ★ #1 MOST IMPORTANT
   → Minimum 3-4 liters daily — jab tak infection ho
   → Har 2 ghante peshab jaao — bacteria flush out
   → Diluted urine = kam jalan
   → Prevention: Daily 2.5-3L water habit
   → CHEAPEST aur MOST EFFECTIVE remedy
   → ✅ SAFE — pregnancy mein bhi

2. COCONUT WATER / NARIYAL PAANI (नारियल पानी / નારિયેળ પાણી)
   → 2-3 glasses daily
   → Natural diuretic — peshab zyada, bacteria flush
   → Electrolytes — dehydration prevent
   → Alkaline — acidic urine neutralize (comfort)
   → ✅ SAFE in pregnancy

3. CRANBERRY — ★ RESEARCH PROVEN FOR UTI
   → Cranberry juice (unsweetened) — 200-300ml daily
   → Ya Cranberry capsules/tablets — 500mg 2 baar
   → Brand: Himalaya UriCare ₹200-350 | Now Foods ₹400-600
   → HOW: PAC (Proanthocyanidins) = bacteria bladder wall se
     chipak nahi paate — wash out ho jaate
   → RESEARCH: Cochrane review — reduces UTI recurrence by 26%
   → PREVENTION more effective than TREATMENT
   → ✅ SAFE in pregnancy
   → ⚠️ Unsweetened juice — sugar wala counterproductive

4. DHANIYA PANI (Coriander Water / धनिया / ધાણા)
   → 2 tsp dhaniya seeds — raat ko paani mein bhigao
   → Subah chhaan ke piyo — din mein 2-3 baar
   → Cooling + diuretic — urine infection classic remedy
   → Anti-inflammatory — jalan kam
   → ✅ SAFE — pregnancy mein bhi

5. SAUNF PANI (Fennel Water / सौंफ / વરિયાળી)
   → 1 tsp saunf — garam paani mein steep 10 min
   → Din mein 3-4 baar piyo
   → Anti-bacterial + diuretic
   → Cooling effect — burning reduce
   → ✅ SAFE in pregnancy

6. JEERA PANI (Cumin Water / जीरा / જીરું)
   → 1 tsp jeera — ubalo 5 min — chhaan ke piyo
   → Anti-inflammatory + diuretic
   → Digestive + urinary dual benefit
   → ✅ SAFE in pregnancy

7. NIMBU PANI (Lemon Water / नींबू / લીંબુ)
   → 1 nimbu — warm water mein squeeze
   → Subah khali pet + din mein 2-3 baar
   → Alkaline effect body mein — UTI bacteria inhibit
   → Vitamin C — immune boost
   → ✅ SAFE in pregnancy

8. AMLA (Indian Gooseberry)
   → 1 fresh amla daily ya 30ml juice
   → Richest Vitamin C — anti-bacterial
   → Diuretic — kidney + bladder flush
   → ✅ SAFE in pregnancy

9. BAKING SODA — EMERGENCY JALAN RELIEF
   → 1/2 tsp baking soda + 1 glass water
   → SOS — jab jalan bahut zyada ho
   → Alkalinizes urine — immediate burning reduce
   → ⚠️ Max 1-2 times only — regular use nahi
   → ⚠️ BP high mein avoid (sodium content)
   → ⚠️ PREGNANCY mein avoid — doctor poochho

10. GARLIC / LEHSUN (लहसुन / લસણ)
    → 2-3 raw lehsun cloves crush karke khaao — daily
    → Ya lehsun ka paste shahad mein
    → Allicin = natural antibiotic compound
    → Research: Antibacterial against E. coli
    → ⚠️ PREGNANCY: Small amounts safe — excess avoid

PREVENTION HABITS — MOST IMPORTANT:
→ Peshab rokna NAHI — jab bhi lage, jao
→ Sex ke BAAD — 15-30 min mein peshab zaroor jao
→ Wiping: FRONT to BACK always — never back to front
→ Cotton underwear — breathable, bacteria kam
→ Tight jeans/synthetic underwear avoid — moisture trap
→ Gentle soap/water for washing — harsh products avoid
→ Douching NAHI — vaginal flora disturb
→ Before and after sex — wash gently
→ Wet clothes/swimsuit jaldi change karo
→ Cranberry daily — prevention ke liye`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
UTI = "Mutrakrichra" (painful urination) in Ayurveda.
Pitta dushti primary — heat + inflammation in Mutra vaha srotas
(urinary channels). Vata also involved — pain + frequency.
Treatment: Pitta shamak + Mutra virechan (urinary flush).

🌿 KEY HERBS:

1. GOKSHURA / GOKHRU (गोक्षुर / ગોખરું) (Tribulus Terrestris)
   — ★ #1 AYURVEDIC UTI HERB
   → 3-5g churna garam paani mein — 2-3 baar
   → Ya tablet: 500mg 2 baar
   → Diuretic + anti-inflammatory + urinary antiseptic
   → Kidney stone prevention bhi
   → Brand: Himalaya ₹150-250 | Baidyanath ₹80-130
   → TEEN: 2-3g ya 1 tab 2 baar
   → ADULT: 3-5g ya 2 tab 2 baar
   → 🤰 PREGNANCY: ⚠️ AVOID — may affect uterus
   → 🤱 BREASTFEEDING: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. PUNARNAVA / पुनर्नवा / પુનર્નવા (Boerhavia Diffusa)
   → 3-5g churna ya 500mg tablet 2 baar
   → Kidney tonic + diuretic + anti-inflammatory
   → UTI + kidney support dual action
   → Brand: Himalaya ₹120-180
   → TEEN: 2-3g | ADULT: 3-5g
   → 🤰: ✅ Safe in moderate doses
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. VARUNA / VARUN (Crataeva Nurvala)
   → 500mg tablet 2 baar ya bark decoction
   → Urinary calculi + UTI both
   → Stone dissolving + anti-bacterial
   → Brand: Himalaya Cystone contains this ₹150-250
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. CHANDANA / CHANDAN (Sandalwood / चंदन / ચંદન)
   → Chandan ka paste/powder — 1-3g garam paani mein
   → Extreme Pitta shamak — cooling + anti-inflammatory
   → Classical for burning urination
   → 🤰: ✅ Safe in small amounts
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. USHEER / VETIVER / KHAS (उशीर / ખસ)
   → Usheerasava: 15-20ml + paani, after food, 2 baar
   → Cooling + urinary antiseptic
   → Brand: Dabur ₹120-170/450ml
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:

6. CHANDRAPRABHA VATI — ★ MOST POPULAR FOR UTI
   → 2 tablets 2 baar garam paani se
   → Broad-spectrum urinary + reproductive
   → Anti-inflammatory + anti-microbial
   → Brand: Baidyanath ₹100-160/80tab | Patanjali ₹60-90
   → TEEN: 1 tab 2 baar | ADULT: 2 tab 2 baar
   → 🤰: ⚠️ Consult Vaidya — some ingredients caution
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. CYSTONE (Himalaya) — ★ MODERN AYURVEDIC
   → 2 tablets 2 baar
   → Gokshura + Punarnava + Varuna + more
   → UTI + kidney stone — dual action
   → Widely available — OTC
   → Brand: Himalaya ₹150-250/60tab
   → 🤰: ⚠️ Consult doctor — usually avoided
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. CHANDANASAVA — 15-20ml + paani, 2 baar after food
   → Sandalwood-based — extreme cooling
   → Burning urination — classic formulation
   → Brand: Dabur ₹120-170/450ml
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

9. GOKSHURADI GUGGULU — 2 tab 2 baar
   → Gokshura + Guggulu — urinary + anti-inflammatory
   → Brand: Baidyanath ₹100-160/80tab
   → 🤰: ❌ AVOID — Guggulu
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

10. SHILAJIT (शिलाजीत / શિલાજીત)
    → 300-500mg daily with warm milk
    → Urinary tract tonic + immune boost
    → Anti-bacterial + anti-inflammatory
    → Brand: Dabur ₹200-400 | Patanjali ₹100-200
    → 🤰: ❌ AVOID in pregnancy
    → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

⚠️ SECTION DISCLAIMER:
UTI bacterial infection hai — antibiotics ki zaroorat hoti hai.
Ayurvedic remedies SUPPORT mein le sakte ho but REPLACE
nahi karte. Agar 24-48 ghante mein sudhar na ho toh
DOCTOR zaroor jao. Kidney infection mein SIRF medical
treatment. Pregnancy UTI = doctor MANDATORY.`,
      modern: `💊 ANTIBIOTICS — MAINSTAY TREATMENT:

1. NITROFURANTOIN 100mg (First Choice for Uncomplicated UTI)
   Hindi: नाइट्रोफ्यूरेन्टोइन | Gujarati: નાઈટ્રોફ્યુરેન્ટોઈન
   Brand: Furadantin ₹40-60 | Uribid ₹50-70 (10 cap)
   
   DOSE ADULT (18+):
   → 100mg 2 times daily
   → Duration: 5-7 days (short course)
   → WITH FOOD — absorption better, less nausea
   → Complete full course — even if feeling better

   DOSE TEEN (13-17):
   → 100mg 2 times daily (same as adult usually)
   → Doctor decides based on weight

   🤰 PREGNANCY: ✅ SAFE — 1st and 2nd trimester
     ⚠️ AVOID at term (last 2-4 weeks) — baby jaundice risk
   🤱 BREASTFEEDING: ⚠️ Caution if baby <1 month

   HOW IT WORKS:
   → Bactericidal — bacteria ko marta hai
   → Concentrated in urine — works directly in bladder
   → Narrow spectrum — gut bacteria disturb nahi karta
   → Low resistance development — bacteria easily resist nahi

   SIDE EFFECTS:
   → COMMON: Nausea (take with food!), headache
   → COMMON: Urine dark yellow/brown — NORMAL, don't panic
   → UNCOMMON: Diarrhea, stomach upset
   → RARE: Lung issues (long-term use only)
   → ⚠️ Kidney disease mein avoid (creatinine clearance <30)

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

2. FOSFOMYCIN 3g SACHET (Single Dose — Very Convenient)
   Hindi: फॉस्फोमाइसिन | Gujarati: ફોસ્ફોમાઈસીન
   Brand: Monurol ₹200-350 | Fosfocin ₹150-250 (single sachet)
   
   DOSE:
   → 3g sachet — dissolve in water — SINGLE DOSE
   → Take at bedtime on empty stomach (2-3 hrs after food)
   → Bladder empty karo pehle — phir lo
   → ONE dose = treatment complete!

   🤰 PREGNANCY: ✅ SAFE — Category B
   🤱 BREASTFEEDING: ✅ Safe

   ADVANTAGE:
   → Single dose = full treatment — no forgetting
   → Very high cure rate — 90%+
   → Minimal resistance issues
   → No GI flora disturbance

   SIDE EFFECTS:
   → COMMON: Diarrhea (transient), nausea, headache
   → Usually resolves in 24 hours

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

3. CEPHALEXIN 500mg (Alternative / Pregnancy-safe)
   Brand: Phexin (GSK) ₹40-70 | Sporidex (Ranbaxy) ₹30-50
   
   DOSE ADULT: 500mg 2-4 times daily, 7 days
   DOSE TEEN: 500mg 2 times daily, 7 days
   🤰 PREGNANCY: ✅ SAFE — Category B, commonly used
   🤱 BREASTFEEDING: ✅ Safe

   Used when Nitrofurantoin not suitable
   Broader spectrum — works for more bacteria
   SIDE EFFECTS: Diarrhea, stomach upset, rash
   
   ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. AMOXICILLIN-CLAVULANATE 625mg
   Brand: Augmentin ₹100-160 | Moxikind-CV ₹70-120 (10 tab)
   DOSE: 625mg 2 times daily, 7 days
   🤰: ✅ SAFE — Category B
   For resistant UTIs or complicated cases
   ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 FOR KIDNEY INFECTION (PYELONEPHRITIS):
→ 🔴 HOSPITAL ADMISSION usually needed
→ IV antibiotics: Ceftriaxone, Gentamicin
→ IV fluids for hydration
→ Pregnancy mein: ALWAYS hospitalize
→ Duration: 10-14 days total antibiotics
→ Follow-up: Urine culture after treatment

💊 SYMPTOM RELIEF (Along with antibiotics):

5. ALKALINIZER — URINE PAIN RELIEF
   Brand: Citralka Syrup ₹80-120 | Alkacitron ₹60-90
   → 2 tsp in water, 3 times daily
   → Alkalinizes urine — burning instantly reduce
   → Use with antibiotics — not instead of
   → 🤰: ⚠️ Consult doctor — sodium content

6. HYOSCINE BUTYLBROMIDE 10mg (Buscopan)
   Brand: Buscopan ₹40-60 (10 tab)
   → 1-2 tab 3 times daily
   → Bladder spasm relief — urgency/frequency kam
   → 🤰: ⚠️ Category C — doctor decides
   → Side effects: Dry mouth, constipation

💊 PREVENTION (Recurrent UTI):

7. CRANBERRY SUPPLEMENTS — 500mg daily
   → Research: 26% reduction in recurrence
   → OTC — no prescription needed
   → ✅ SAFE including pregnancy

8. PROBIOTICS — Lactobacillus strains
   → Brand: Various ₹200-400/30 caps
   → Healthy bacteria maintain — prevents recurrence
   → Especially important after antibiotics course
   → ✅ SAFE in pregnancy

9. D-MANNOSE 500mg-2g daily
   → Natural sugar that prevents E. coli adhesion
   → Similar mechanism to cranberry
   → Brand: ₹500-800/60 caps (mostly online)
   → ✅ SAFE in pregnancy (limited data but food-derived)

10. PROPHYLACTIC ANTIBIOTICS (Recurrent — 3+ per year)
    → Low-dose Nitrofurantoin 50mg at bedtime
    → Or post-coital (after sex) single dose
    → 6-12 months course
    → ONLY doctor prescribed for recurrent UTI

💊 TESTS:
→ Urine Routine + Microscopy — ₹100-200
  (Pus cells + bacteria confirm UTI)
→ Urine Culture + Sensitivity — ₹300-500
  (Exact bacteria + which antibiotic will work)
→ Ultrasound KUB — ₹500-800
  (If recurrent — structural cause check)
→ Blood tests: CBC, Creatinine — ₹300-500
  (If kidney infection suspected)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      disclaimer: `⚠️ COMPLETE MEDICINE SECTION DISCLAIMER:
UTI bacterial infection hai — ANTIBIOTICS zaruri hain.
Gharelu nuskhe SUPPORT mein lo, replace NAHI karte.
Incomplete antibiotic course = resistant bacteria = worse.
FULL COURSE COMPLETE KARO. Pregnancy UTI = doctor MANDATORY.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY — HOSPITAL:` },
      { severity: "YELLOW", text: `WITHIN 24 HOURS:` },
    ],
    relatedIds: [8, 3],
  },
  {
    id: 11,
    slug: "leucorrhea",
    name: `Leucorrhea (White Discharge)`,
    nameHi: `सफेद पानी आना`,
    nameGu: `સફેદ પાણી આવવું`,
    emoji: "🌼",
    category: "GENERAL_HEALTH",
    summary: `Leucorrhea is white vaginal discharge — normal in moderate amounts and varying through the cycle. Discharge that becomes itchy, foul-smelling, coloured, or comes with pain may indicate infection (yeast, BV, STI) and needs treatment.`,
    whoGetsIt: `- Almost all women experience some discharge — NORMAL
- Yeast infection: 75% women at least once in lifetime
- BV: 15-30% women at any time
- Pregnancy mein increased discharge — 90% women
- Diabetes increases risk significantly
- Antibiotic use — common trigger for yeast`,
    sections: {
      overview: `Vaginal discharge — yoni se safed ya halka yellowish paani aana.
Yeh NORMAL bhi ho sakta hai aur ABNORMAL bhi — difference
samajhna zaroori hai. Normal discharge body ka natural cleaning
mechanism hai — vagina apne aap ko clean karti hai.

NORMAL vs ABNORMAL:

NORMAL DISCHARGE (WORRY MAT KARO):
→ Clear ya milky white colour
→ Mild smell ya no smell — foul nahi
→ Thin ya slightly thick — egg white jaisa
→ Ovulation ke time zyada — stretchy, clear
→ Period se pehle thoda zyada — normal
→ Pregnancy mein increase — normal
→ Sexual arousal pe — normal
→ No itching, no burning, no pain

ABNORMAL DISCHARGE (DOCTOR JAO):
→ Green/Yellow/Grey colour — infection sign
→ Foul/fishy smell — bacterial infection
→ Cottage cheese jaisa thick, chunky — yeast/fungal
→ Frothy/foamy — Trichomonas infection
→ Itching ke saath — infection
→ Burning/pain ke saath — infection
→ Blood mixed (not during period) — investigate
→ Bahut zyada amount — unusual for you

CAUSES OF ABNORMAL DISCHARGE:
INFECTIONS:
→ Yeast/Fungal (Candidiasis) — most common
  White, thick, cottage cheese, ITCHING ★
→ Bacterial Vaginosis (BV)
  Grey/white, fishy smell, thin
→ Trichomoniasis (STI)
  Green/yellow, frothy, foul smell, itching
→ Chlamydia/Gonorrhea (STI)
  Yellow/green, pain, bleeding between periods

NON-INFECTIOUS:
→ Hormonal changes — puberty, pregnancy, menopause
→ Antibiotics — kill good bacteria → yeast overgrowth
→ Diabetes — sugar → yeast growth
→ Tight clothing/synthetic underwear — moisture trap
→ Douching — vaginal flora disturb
→ Cervical erosion/polyp
→ Allergic reaction — soap, detergent, condom`,
      gharelu: `FOR NORMAL DISCHARGE (Reduce/Manage):

1. METHI DANA WATER (Fenugreek / मेथी / મેથી)
   → 2 tsp methi dana raat ko paani mein bhigao
   → Subah khali pet piyo + dana chabao
   → Hormonal balance — discharge regulate
   → Anti-inflammatory + anti-microbial
   → ✅ Safe for regular use
   → ⚠️ Pregnancy mein moderate amounts

2. DHANIYA BEEJ WATER (Coriander Seeds / धनिया / ધાણા)
   → 2 tsp dhaniya seeds raat ko bhigao
   → Subah chhaan ke piyo — din mein 2 baar bhi
   → Classical remedy for Shweta Pradar
   → Cooling + anti-inflammatory
   → ✅ Very safe — food grade

3. AMLA (Indian Gooseberry / आंवला / આમળાં)
   → 1-2 fresh amla daily ya 30ml juice
   → Ya amla powder 1 tsp shahad ke saath
   → Vitamin C — immune boost — infection fight
   → Reproductive health support
   → ✅ Safe in pregnancy too

4. BANANA (RIPE) / KELA
   → 1-2 daily — with shahad optional
   → Discharge reduce karta hai — traditional remedy
   → Hormonal support
   → Easy, cheap, available

5. TULSI (Holy Basil / तुलसी / તુલસી)
   → Tulsi leaves — 8-10 crush karke shahad mein
   → Ya tulsi ka juice — 1 tsp 2 baar
   → Anti-microbial + immune booster
   → Traditional remedy for leucorrhea
   → ✅ Safe — ⚠️ Pregnancy mein excess avoid

6. LAHSUN / GARLIC (लहसुन / લસણ)
   → 2-3 raw cloves crush karke khaao — daily
   → Ya garlic paste shahad mein
   → Allicin = natural antifungal + antibacterial
   → Yeast infection prevention
   → ⚠️ Pregnancy mein small amounts okay

7. DAHI / YOGURT (PLAIN) — FOR YEAST
   → 1 cup plain dahi daily — khaao
   → Lactobacillus = probiotic — good bacteria
   → Vaginal flora maintain karta hai
   → Yeast infection prevention + recovery
   → ✅ Safe — nutritious too

8. NEEM (नीम / લીમડો)
   → Neem leaves ka paani — external wash
   → Anti-fungal + anti-bacterial
   → Boil neem leaves → cool → external wash
   → ⚠️ EXTERNAL USE ONLY — internal avoid
   → ⚠️ Pregnancy mein avoid internal neem

9. ALOE VERA GEL — EXTERNAL
   → Fresh aloe gel — external area pe lagao
   → Soothing + anti-inflammatory
   → Itching relief
   → ⚠️ EXTERNAL only — vagina ke andar NAHI

10. RICE WATER / CHAWAL KA PAANI
    → Chawal dhone ka ya ubaalne ka paani
    → Piyo ya external wash ke liye use karo
    → Starch = soothing + mild anti-bacterial
    → Traditional remedy — very safe

HYGIENE PRACTICES — MOST IMPORTANT:
→ Cotton underwear ONLY — synthetic/nylon avoid
→ Loose clothing — tight jeans reduce karo
→ Wash external area with plain water — soap minimal
→ Wipe FRONT to BACK — always
→ DOUCHING KABHI NAHI — vaginal flora destroy karta hai
→ Wet underwear/swimsuit turant change karo
→ Panty liners — change every 4-6 hours
→ Scented products (spray, wipes) vaginal area pe NAHI
→ Partner hygiene bhi important — mutual cleanliness`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
White discharge = "Shweta Pradar" in Ayurveda.
Kapha dushti primary — excess moist, cold, heavy quality.
Rasa dhatu vitiation → excessive secretion.
Agni mandya (weak digestion) → Ama (toxins) → discharge.
Treatment: Kapha shamak + Agni deepan + Stambhan (astringent).

🌿 KEY HERBS:

1. ASHOKA / अशोक / અશોક — ★ BEST FOR LEUCORRHEA
   → 3-6g bark powder doodh ke saath — 2 baar
   → Uterine tonic + astringent — discharge reduce
   → Brand: Himalaya ₹120-200 | Baidyanath ₹80-150
   → TEEN: 2-3g 2 baar | ADULT: 3-6g 2 baar
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. LODHRA / लोध्र / લોધ્ર — ★★ STRONGEST ASTRINGENT
   → 3-5g churna doodh/paani ke saath — 2 baar
   → Most powerful astringent for discharge
   → Classical Shweta Pradar remedy
   → Brand: Baidyanath ₹100-180/100g
   → TEEN: 2-3g | ADULT: 3-5g
   → 🤰: ⚠️ AVOID first trimester
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. UDUMBER / GULAR (Ficus Glomerata / उदुम्बर / ઊમરો)
   → Bark powder: 3-5g doodh ke saath — 2 baar
   → Ya fresh latex — external application
   → Classical for all types of Pradar
   → Cooling + astringent
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. SPHATIKA / ALUM (फिटकरी / ફટકડી)
   → Sphatika Bhasma: 250-500mg shahad ke saath internal
   → External: Alum solution — vaginal wash
   → Powerful astringent — discharge rokta hai
   → ⚠️ External use carefully — irritation possible
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:

5. PUSHYANUG CHURNA — 3-6g shahad/ghee ke saath, 2 baar
   → #1 classical formulation for Shweta Pradar
   → 15+ herbs combination — comprehensive
   → Brand: Baidyanath ₹80-130 | Dabur ₹90-140
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

6. PRADARANTAK LAUHA — 2 tab 2 baar
   → Iron + herbs — discharge + anaemia both
   → Brand: Baidyanath ₹100-160/40tab
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

7. ASHOKARISHTA — 15-20ml + paani, 2 baar
   → All uterine disorders — discharge included
   → Brand: Dabur ₹130-170/450ml
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

8. CHANDRAPRABHA VATI — 2 tab 2 baar
   → Urinary + reproductive health
   → Brand: Baidyanath ₹100-160/80tab
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

⚠️ SECTION DISCLAIMER:
Abnormal discharge mein INFECTION ka test zaruri hai.
Ayurvedic remedies normal discharge manage karte hain
but infection ke liye proper diagnosis + treatment chahiye.
Koi bhi medicine shuru karne se pehle Vaidya se salah lein.`,
      modern: `💊 FOR YEAST / FUNGAL INFECTION (Candidiasis):

1. CLOTRIMAZOLE CREAM/PESSARY — ★ FIRST LINE
   Hindi: क्लोट्रिमाजोल | Gujarati: ક્લોટ્રિમાઝોલ
   Brand: Candid V (Glenmark) | Canesten (Bayer)
   Price: Cream ₹50-80 | Pessary ₹40-70

   DOSE:
   → Cream: Apply externally 2 times daily — 7 days
   → Pessary (vaginal tablet): 500mg single dose
     Ya 200mg at night for 3 nights
     Ya 100mg at night for 7 nights (mildest)
   → Insert pessary at bedtime — lie down after

   🤰 PREGNANCY: ✅ SAFE — topical, minimal absorption
     (Pessary may need longer course — 7 days)
   🤱 BREASTFEEDING: ✅ Safe

   SIDE EFFECTS:
   → COMMON: Mild burning/irritation at application site
   → UNCOMMON: Skin redness
   → Usually resolves quickly
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. FLUCONAZOLE 150mg — ORAL (Single Dose)
   Hindi: फ्लूकोनाजोल | Gujarati: ફ્લ્યુકોનાઝોલ
   Brand: Zocon ₹20-40 | Forcan ₹25-45 | Flucos ₹15-30
   
   DOSE ADULT: 150mg single dose — DONE
   DOSE TEEN: 150mg single dose (usually same)
   
   🤰 PREGNANCY: ❌❌ AVOID — TERATOGENIC
     (Birth defect risk — especially first trimester)
   🤱 BREASTFEEDING: ✅ Safe — single dose okay

   Very convenient — one pill fixes most yeast infections
   Recurrent: 150mg weekly for 6 months
   
   SIDE EFFECTS:
   → COMMON: Headache, nausea, stomach pain
   → RARE: Liver issues (long-term use)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 FOR BACTERIAL VAGINOSIS (BV):

3. METRONIDAZOLE 400mg (Oral or Vaginal)
   Brand: Flagyl (Abbott) ₹15-25 | Metrogyl (J&J) ₹10-20
   → Oral: 400mg 2 times daily × 7 days
   → Ya Vaginal gel: MetroGel — 1 applicator at bedtime × 5 nights
   → 🤰: ⚠️ Oral — 2nd/3rd trimester okay
     Vaginal gel preferred in pregnancy
   → ⚠️ NO ALCOHOL with Metronidazole — severe reaction
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. CLINDAMYCIN CREAM (Vaginal)
   Brand: Dalacin V cream ₹150-250
   → 1 applicator intravaginal at bedtime × 7 nights
   → 🤰: ✅ Safe — topical
   → Alternative to Metronidazole
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 FOR TRICHOMONIASIS:
→ Metronidazole 2g single dose (both partners)
→ Ya 400mg 2 times × 7 days
→ PARTNER TREATMENT MANDATORY — otherwise reinfection
→ 🤰: ⚠️ Doctor decides trimester-based
→ ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 PROBIOTICS — PREVENTION:
5. VAGINAL PROBIOTICS — Lactobacillus based
   Brand: V-Lac ₹200-350 | ProVag ₹250-400 (vaginal caps)
   → 1 cap intravaginal at bedtime × 7-14 nights
   → After antibiotic/antifungal course — restore flora
   → Prevention of recurrence
   → 🤰: ✅ Safe
   
6. ORAL PROBIOTICS — Lactobacillus rhamnosus/reuteri
   → Daily — long term prevention
   → Brand: Various ₹200-400/30 caps
   → 🤰: ✅ Safe

💊 TESTS:
→ Vaginal swab + microscopy — ₹200-400
→ Culture + sensitivity — ₹400-600
→ Pap smear — cervical screening — ₹300-500
→ STI screening — if sexually active + abnormal discharge`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Abnormal discharge = INFECTION usually. DOCTOR se test
karwao — correct diagnosis = correct treatment.
Wrong treatment se condition worse ho sakti hai.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY:` },
      { severity: "YELLOW", text: `WITHIN 1 WEEK:` },
    ],
    relatedIds: [10, 3, 1],
  },
  {
    id: 12,
    slug: "pms",
    name: `PMS (Premenstrual Syndrome)`,
    nameHi: `माहवारी पूर्व लक्षण`,
    nameGu: `માસિક પૂર્વ લક્ષણો`,
    emoji: "🌗",
    category: "MENSTRUAL",
    summary: `PMS (Premenstrual Syndrome) is a cluster of physical and emotional symptoms appearing 1-2 weeks before periods. Around 75% of women experience some PMS; 3-8% have severe PMDD. Lifestyle, diet, and sometimes medication help.`,
    whoGetsIt: ``,
    sections: {
      overview: `Period se 1-2 weeks pehle hone wale physical + emotional symptoms
jo period aate hi kam ya khatam ho jaate hain. 75% women ko kuch
na kuch PMS hota hai. Hormonal fluctuation (especially progesterone
drop) iska main cause hai.

PMS vs PMDD:
PMS: Mild-moderate symptoms — manageable
PMDD (Pre-Menstrual Dysphoric Disorder): SEVERE —
→ Depression so bad can't function
→ Extreme anger/anxiety — relationships affect
→ 3-8% women — needs medical treatment
→ Suicidal thoughts possible — SERIOUS condition

SYMPTOMS — PHYSICAL:
→ Breast tenderness/swelling (chhati mein dard)
→ Bloating — pet phulna
→ Headache/Migraine
→ Fatigue/tiredness
→ Acne breakout
→ Constipation or diarrhea
→ Appetite changes — food cravings (chocolate, salty)
→ Joint/muscle pain
→ Weight gain (water retention — 1-3 kg)
→ Sleep disturbance

SYMPTOMS — EMOTIONAL:
→ Mood swings — happy se sad suddenly
→ Irritability/anger — chhoti baat pe gussa
→ Anxiety/tension — bechain feeling
→ Crying spells — rona aa jaata hai
→ Depression — udaas, kuch achha nahi lagta
→ Difficulty concentrating
→ Social withdrawal — akele rehne ka mann
→ Low self-esteem

TIMELINE:
→ Start: 7-14 din before period
→ Worst: 2-3 din before period
→ Relief: Period start hone ke 1-2 din mein
→ If symptoms continue DURING period = may be something else`,
      gharelu: `🥗 DIET CHANGES — MOST EFFECTIVE:

1. CALCIUM RICH FOODS — ★ RESEARCH PROVEN
   → Doodh, dahi, paneer, ragi — daily
   → RESEARCH: 1200mg calcium/day = 48% PMS reduction
   → Start: Poore month khaao — sirf PMS time nahi
   → Ragi ladoo — calcium + iron combo
   → ✅ Safe for all ages

2. MAGNESIUM RICH FOODS
   → Kaju, badam, palak, kela, dark chocolate
   → Muscle relaxant + mood stabilizer
   → Bloating + cramps + anxiety sab kam
   → Dark chocolate (70%+) — magnesium + endorphins

3. COMPLEX CARBS — CRAVINGS MANAGE
   → Jowar, bajra, oats, daliya, brown rice
   → Serotonin production support — mood lift
   → Blood sugar stable — crash nahi, cravings kam
   → Avoid: Maida, sugar — spike + crash = worse mood

4. REDUCE SALT — BLOATING KAM
   → Period se 1 week pehle namak reduce karo
   → Water retention = bloating = weight gain
   → Processed food mein hidden salt — avoid
   → Instead: Nimbu, herbs for flavour

5. REDUCE CAFFEINE — ANXIETY KAM
   → Max 1 cup chai/coffee per day during PMS week
   → Caffeine = anxiety, breast tenderness, insomnia badhata
   → Switch to: Herbal tea, green tea (less caffeine)

SPECIFIC REMEDIES:

6. SAUNF (Fennel / सौंफ / વરિયાળી)
   → 1 tsp saunf paani mein ubaal ke piyo — din mein 2 baar
   → Bloating + cramps + mood — triple benefit
   → RESEARCH: Fennel extract reduces PMS significantly
   → ✅ Safe — food grade
   → Start 1 week before expected period

7. HALDI DOODH (Turmeric Milk)
   → 1 tsp haldi + doodh + kaali mirch — raat ko
   → Anti-inflammatory — pain + bloating reduce
   → Mood support — anti-depressant properties
   → ✅ Safe for all ages

8. ADRAK (Ginger)
   → Fresh adrak chai — 2 cups daily PMS week
   → Nausea + pain + bloating relief
   → ✅ Safe — ⚠️ Pregnancy mein limit 3 cups

9. KELA (Banana) — 1-2 daily
   → Vitamin B6 — natural mood lifter
   → Potassium — bloating reduce
   → Tryptophan — serotonin precursor — sleep better

10. FLAXSEED / ALSI
    → 1-2 tbsp ground daily — poore month
    → Lignans — hormonal balance
    → Omega-3 — inflammation reduce
    → Research: Reduces breast tenderness in PMS

🧘 LIFESTYLE — CRITICAL:
→ EXERCISE: 30 min daily — endorphins = natural mood lifter
  Walking, yoga, swimming — anything you enjoy
  Research: Regular exercise = 30% less PMS symptoms
→ SLEEP: 7-8 hours — PMS week mein extra important
  Melatonin disrupted = worse PMS
→ STRESS MANAGEMENT: Meditation, deep breathing, journaling
  Cortisol + PMS = terrible combo
→ WARM BATH: Epsom salt — relax muscles + magnesium absorb
→ LIMIT ALCOHOL: Worsens all PMS symptoms`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
PMS = Vata-Pitta dushti before menstruation.
Apana Vayu disturbed → physical symptoms.
Pitta aggravation → emotional symptoms (anger, irritability).
Kapha involvement → heaviness, bloating, lethargy.

🌿 HERBS:

1. SHATAVARI / शतावरी / શતાવરી — ★ BEST FOR PMS
   → 1 tsp churna doodh mein — daily, poore month
   → Hormonal balance — estrogen + progesterone
   → Mood stabilizer + breast tenderness reduce
   → Brand: Himalaya ₹180-250
   → TEEN: 1/2 tsp | ADULT: 1 tsp
   → 🤰: ✅ SAFE | Duration: 3+ months
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. ASHWAGANDHA / अश्वगंधा / અશ્વગંધા
   → 500mg-1g daily — raat ko doodh mein
   → Cortisol reduce — stress/anxiety kam
   → Mood stabilizer — depression help
   → Brand: KSM-66 ₹400-600 | Himalaya ₹200-300
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. BRAHMI / ब्राह्मी / બ્રાહ્મી (Bacopa Monnieri)
   → 500mg tablet 2 baar ya 1 tsp churna
   → Brain tonic — concentration + memory + mood
   → Anxiety + depression — clinically proven
   → Brand: Himalaya ₹150-250
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. JATAMANSI / जटामांसी
   → 250-500mg tablet ya 1-2g churna — raat ko
   → Nervine tonic — anxiety, insomnia, mood
   → Natural tranquilizer — without side effects
   → Brand: Baidyanath ₹150-250
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
5. ASHOKARISHTA — 15-20ml + paani, 2 baar — hormonal balance
6. SARASWATARISHTA — 15-20ml + paani — brain + mood tonic
   Brand: Dabur/Baidyanath ₹120-180/450ml
   → 🤰: ⚠️ Consult Vaidya
7. CHANDRAPRABHA VATI — 2 tab 2 baar — hormonal + metabolic

⚠️ Bina Vaidya/Doctor ki salah ke koi bhi medicine mat lo.`,
      modern: `💊 SUPPLEMENTS — FIRST LINE:

1. CALCIUM 1200mg daily — ★ MOST PROVEN
   Brand: Shelcal-500 ₹100-150 | Calcimax ₹120-180
   → 600mg morning + 600mg night (or 500mg × 2-3)
   → RESEARCH: 48% reduction in PMS symptoms (RCT)
   → Start daily — not just PMS week
   → 🤰: ✅ Essential | Side effects: Constipation

2. MAGNESIUM 250-400mg daily
   Brand: Magnesium Glycinate ₹300-500/60 caps
   → Bloating, mood, cramps, headache — all reduce
   → Glycinate form = best absorbed, least GI issues
   → 🤰: ✅ Safe

3. VITAMIN B6 50-100mg daily
   Brand: Pyridoxine / Neurobion Forte ₹30-50
   → Mood support — serotonin synthesis
   → Bloating reduce — mild diuretic effect
   → RESEARCH: Reduces depression + irritability in PMS
   → 🤰: ✅ Safe (up to 100mg)
   → ⚠️ Max 100mg/day — nerve damage if excess

4. CHASTEBERRY / VITEX (Vitex Agnus-Castus) 20-40mg
   → Herbal supplement — available as capsule
   → Regulates prolactin — breast tenderness reduce
   → Hormonal balance — PMS significant reduction
   → RESEARCH: Multiple trials support — moderately effective
   → Brand: Available online ₹400-800
   → 🤰: ❌ AVOID — hormonal effect
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. EVENING PRIMROSE OIL 500-1000mg daily
   → GLA (Gamma-linolenic acid) — prostaglandin balance
   → Breast tenderness specifically
   → Brand: ₹300-600/60 caps
   → 🤰: ⚠️ Avoid — may induce labor

💊 PRESCRIPTION MEDICINES (Moderate-Severe PMS):

6. SSRIs — For Severe PMS/PMDD
   → Fluoxetine (Prozac) 20mg — ₹30-60/10 tab
   → Sertraline (Zoloft) 50mg — ₹40-70/10 tab
   → Can take: Daily OR only luteal phase (Day 14-28)
   → 🤰: ⚠️ Doctor decides — risks vs benefits
   → SIDE EFFECTS: Nausea, headache, sexual dysfunction
   → VERY effective for PMDD — 60-70% respond
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

7. ORAL CONTRACEPTIVE PILLS — Continuous/Extended
   → Reduces hormonal fluctuation — PMS prevented
   → Yasmin (Drospirenone) — anti-bloating effect
   → 🤰: ❌ STOP if pregnant
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

8. SPIRONOLACTONE 25-100mg — For bloating + acne
   → Diuretic + anti-androgen
   → 🤰: ❌❌ AVOID
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 SYMPTOM-SPECIFIC OTC:
→ Headache: Paracetamol 500mg
→ Cramps: Mefenamic Acid 250mg (details Condition #1)
→ Bloating: Simethicone (Gas-O-Fast) — OTC
→ Breast pain: Evening Primrose Oil + well-fitted bra
→ Insomnia: Melatonin 3mg at bedtime (short term)`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
PMS manageable hai but PMDD serious condition hai.
Agar emotional symptoms itne severe hain ki daily life,
relationships, work affect ho raha hai — DOCTOR ZAROOR jao.
Suicidal thoughts = IMMEDIATE help — 988/KIRAN helpline.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `IMMEDIATELY:` },
      { severity: "YELLOW", text: `WITHIN 1 WEEK:` },
    ],
    relatedIds: [1],
  },
  {
    id: 13,
    slug: "heartburn",
    name: `Heartburn / Acidity (Pregnancy)`,
    nameHi: `गर्भावस्था में सीने में जलन`,
    nameGu: `સગર્ભાવસ્થામાં છાતીમાં બળતરા`,
    emoji: "🔥",
    category: "PREGNANCY",
    summary: `Heartburn (acid reflux) in pregnancy affects up to 80% of women, especially in later trimesters. Hormones relax the stomach valve and the growing uterus pushes acid up. Smaller meals, posture, and pregnancy-safe antacids usually help.`,
    whoGetsIt: ``,
    sections: {
      overview: `Pregnancy mein heartburn (seene/chest mein jalan) aur acid reflux
bahut common hai — 40-80% pregnant women ko hota hai. Progesterone
hormone food pipe ke valve ko relax karta hai → stomach acid
upar aata hai → jalan hoti hai. Baby bada hone se stomach pe
pressure bhi badhta hai.

TIMELINE:
→ 1st Trimester: 20-25% women — hormonal
→ 2nd Trimester: 40-50% — baby growing
→ 3rd Trimester: 60-80% — maximum pressure

SYMPTOMS:
→ Seene/chest mein jalan — burning feeling
→ Gale mein khatta/acidic taste
→ Khana khane ke baad worse
→ Lete pe badhta — especially right side
→ Belching/dakar — frequent
→ Nausea — food pipe irritation se
→ Sone mein difficulty — raat ko worse`,
      gharelu: `(🤰 ALL REMEDIES PREGNANCY SAFE)

⚡ INSTANT RELIEF:

1. COLD DOODH (Cold Milk)
   → 1 glass thanda doodh — turant rahat
   → Calcium = natural antacid
   → Alkaline — acid neutralize
   → Safe anytime — koi limit nahi
   → Best: Malai nikla hua — light

2. SAUNF (Fennel / सौंफ / વરિયાળી) — ★ BEST REMEDY
   → 1 tsp saunf chabao — jab bhi jalan
   → Ya saunf ka paani — din mein 3-4 baar
   → Anti-spasmodic — food pipe relax
   → Gas + acidity dono kam
   → ✅ Completely safe in pregnancy

3. ELAICHI (Cardamom / इलाइची / એલચી)
   → 2-3 elaichi ke dane chabao
   → Ya elaichi powder doodh mein
   → Cooling + digestive — instant relief
   → ✅ Safe in pregnancy

4. COCONUT WATER / NARIYAL PAANI
   → 1-2 glasses daily
   → Alkaline — acid neutralize
   → Electrolytes — hydration
   → ✅ Safe — nutritious too

5. MISHRI (Rock Sugar / मिश्री / મિશ્રી) + SAUNF
   → Saunf + mishri — equal parts — chabao
   → Post-meal — acidity prevent
   → Traditional Indian digestive
   → ✅ Safe (moderate amounts — sugar hai)

6. BANANA (RIPE)
   → 1 ripe kela — jab bhi acidity
   → Natural antacid — potassium + alkaline
   → Coating effect — stomach lining protect
   → ✅ Safe — nutritious

7. GULKAND (Rose Petal Jam / गुलकंद / ગુલકંદ) — ★ COOLING
   → 1-2 tsp daily — subah ya khana ke baad
   → Extreme cooling — Pitta shamak
   → Constipation bhi fix karta hai
   → ✅ Safe in pregnancy — traditional remedy
   → ⚠️ GDM mein limit — sugar content

8. JEERA WATER (Cumin)
   → 1 tsp jeera ubalo — chhaan ke piyo
   → Digestive — gas + acidity relief
   → ✅ Safe in pregnancy

9. AJWAIN (Carom Seeds)
   → 1/2 tsp ajwain + chutki kala namak — chabao
   → Instant gas relief
   → ✅ Safe in small amounts
   → ⚠️ Excess avoid in pregnancy

10. ALOE VERA JUICE — 20ml before meals
    → Cooling + soothing — food pipe lining protect
    → ⚠️ PREGNANCY: Very small amounts only
    → ⚠️ Excess = laxative effect — avoid

🍽️ EATING HABITS — MOST IMPORTANT:
→ SMALL FREQUENT MEALS — 6 per day
→ Last meal 3 hours before sleep
→ Don't lie down after eating — 30 min wait
→ Chew slowly — rush mat karo
→ Don't drink water WITH meals — before/after
→ Avoid: Spicy, fried, fatty, citrus, tomato, onion, garlic excess
→ Avoid: Chocolate, mint, caffeine — valve relax karte hain
→ Avoid: Carbonated drinks
→ Sleep: Left side — anatomy favours less reflux
→ Pillow: Head elevated — 6 inches upar`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Heartburn = "Amlapitta" — Pitta dushti in Amashaya (stomach).
Pregnancy mein Agni disturbed → acid excess → upward flow.

🌿 PREGNANCY-SAFE HERBS:
1. SHATAVARI — 1/2 tsp doodh mein — Pitta shamak, cooling
2. YASHTIMADHU/MULETHI — small piece chabao — stomach soothing
   → ⚠️ Small amounts only — BP risk in excess
3. AMALAKI (Amla) — 1 daily — Pitta shamak, digestive
4. DHANIYA (Coriander) — seeds water — cooling

📦 FORMULATIONS:
5. KAMADUGHA RAS — 1 tab 2 baar — Pitta shamak + antacid
   Brand: Baidyanath ₹80-130/40tab
   🤰: ✅ Generally safe — consult Vaidya
6. SOOTSHEKHAR RAS — 1 tab 2 baar — classical for Amlapitta
   Brand: Baidyanath ₹100-180/25tab
   🤰: ⚠️ Consult Vaidya — contains Rasa (mercury-based)
7. AVIPATTIKAR CHURNA — 1-2g before meals — digestive + antacid
   Brand: Baidyanath/Dabur ₹60-100/100g
   🤰: ⚠️ Consult Vaidya

⚠️ Bina Vaidya/Doctor ki salah ke mat lo — pregnancy hai.`,
      modern: `💊 ANTACIDS — FIRST LINE (OTC):

1. CALCIUM CARBONATE (Tums equivalent)
   Brand: Digene (Abbott) ₹30-50 | Gelusil (Pfizer) ₹35-55
   → Chewable tablet ya liquid — jab bhi jalan
   → Instant relief — acid neutralize in minutes
   → 🤰: ✅ SAFE — calcium bonus for baby
   → Max: 6-8 tablets/day
   → SIDE EFFECTS: Constipation, gas
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. ALUMINIUM + MAGNESIUM HYDROXIDE
   Brand: Maalox ₹40-60 | Mucaine ₹50-80 (syrup)
   → 10-15ml after meals and at bedtime
   → 🤰: ✅ SAFE — widely used
   → ⚠️ Aluminium-containing: Don't use excessively
   → SIDE EFFECTS: Constipation (Al) / Diarrhea (Mg)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 IF ANTACIDS NOT ENOUGH — H2 BLOCKERS:

3. RANITIDINE 150mg — ⚠️ RECALLED IN MANY COUNTRIES
   → Previously first choice — now availability issue
   → If available: 150mg twice daily
   → 🤰: ✅ Was considered safe

4. FAMOTIDINE 20mg
   Brand: Famocid ₹30-50 (10 tab)
   → 20mg twice daily (morning + bedtime)
   → 🤰: ✅ SAFE — Category B
   → Safer option now that Ranitidine recalled
   → SIDE EFFECTS: Headache, dizziness (rare)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 IF STILL NOT ENOUGH — PPIs:

5. OMEPRAZOLE 20mg / PANTOPRAZOLE 40mg
   Brand: Omez ₹30-50 | Pan-40 ₹25-40 (10 tab/caps)
   → 1 capsule morning before breakfast
   → 🤰: ⚠️ Category C — doctor decides
     Generally used when other options fail
     Short-term use preferred
   → SIDE EFFECTS: Headache, nausea, Vitamin B12 reduce
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 WHAT TO AVOID IN PREGNANCY:
→ ❌ Sodium Bicarbonate (Eno etc.) — excess sodium
→ ❌ Bismuth subsalicylate (Pepto-Bismol) — unsafe
→ ❌ Misoprostol — ABORTION risk`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Pregnancy mein medicine lene se pehle
GYNAECOLOGIST se zaroor salah lein. Lifestyle + diet
changes pehle try karo — 80% cases resolve ho jaate hain.`,
    },
    emergency: [
      { severity: "RED", text: `Chest pain + saans fulna + baayen haath mein dard` },
      { severity: "RED", text: `Vomiting blood (haematemesis) — ulcer bleeding` },
      { severity: "YELLOW", text: `Heartburn + difficulty swallowing — investigate` },
    ],
    relatedIds: [4, 9],
  },
  {
    id: 14,
    slug: "leg-cramps",
    name: `Leg Cramps (Pregnancy)`,
    nameHi: `गर्भावस्था में पैरों में ऐंठन`,
    nameGu: `સગર્ભાવસ્થામાં પગમાં ખેંચાણ`,
    emoji: "🦵",
    category: "PREGNANCY",
    summary: `Leg cramps in pregnancy are sudden painful calf or foot muscle spasms, most common at night in the 2nd and 3rd trimesters. Causes include mineral deficiency, dehydration, and pressure on nerves. Stretching and magnesium often help.`,
    whoGetsIt: ``,
    sections: {
      overview: `Pregnancy mein — especially 2nd and 3rd trimester — pair ki
muscles mein sudden, painful contraction/cramping hona. Usually
calf muscles (pindli) mein hota hai. Raat ko sote time sabse
zyada common. 50-75% pregnant women ko hota hai.

WHY HAPPENS:
→ MINERAL CHANGES: Calcium, Magnesium, Potassium imbalance
→ WEIGHT: Extra weight se pair ki muscles pe load
→ CIRCULATION: Uterus blood vessels pe pressure → blood flow slow
→ FATIGUE: Pair ki muscles thak jaati hain
→ DEHYDRATION: Paani kam = electrolyte imbalance
→ NERVE COMPRESSION: Baby's weight se nerve dabta hai

TIMELINE:
→ 1st Trimester: Rare
→ 2nd Trimester: Start — 30% women
→ 3rd Trimester: Peak — 50-75% women
→ Night time worst — especially 3rd trimester
→ After delivery: Usually resolves within weeks`,
      gharelu: `(🤰 ALL PREGNANCY SAFE)

⚡ INSTANT RELIEF (Jab cramp aaye):

1. STRETCH — IMMEDIATELY
   → Pair seedha karo — toes apni taraf kheencho (dorsiflex)
   → OPPOSITE direction of cramp
   → Hold 30 seconds — slowly release
   → Repeat 2-3 times
   → Partner se help lo — foot push karwao
   → ⚠️ Toes POINT mat karo — cramp worse hoga

2. MASSAGE — Cramp ke baad
   → Calf muscle ko gently massage karo
   → Upward strokes — towards heart
   → 5-10 minutes — blood flow restore
   → Til ka tel ya coconut oil use karo

3. WARM TOWEL / GARAM KAPDA
   → Garam paani mein kapda bheego → pair pe rakho
   → 10-15 min — muscles relax
   → Ya garam paani ki bottle — calf pe

🥗 PREVENTION — FOODS:

4. BANANA — 1-2 DAILY
   → Potassium rich — #1 cramp fighter
   → Magnesium + B6 bhi hai
   → Easy, cheap, available everywhere
   → Raat ko sone se pehle 1 kela — cramps kam

5. DOODH / MILK — GARAM, RAAT KO
   → 1 glass garam doodh before bed
   → Calcium — muscle function
   → Traditional: Doodh + badam + kesar
   → ✅ Best bedtime drink for pregnant women

6. COCONUT WATER — 1-2 GLASSES DAILY
   → Natural electrolyte — K, Na, Mg
   → Dehydration prevent
   → Cramp prevention — research supported

7. DATES + ALMONDS — DAILY SNACK
   → 4-5 dates + 8-10 soaked badam
   → Magnesium + Calcium + Iron
   → Energy bhi — multiple benefits
   → Traditional pregnancy superfood

8. RAGI / NACHNI (Finger Millet / रागी / રાગી)
   → Ragi roti, porridge, ladoo
   → HIGHEST calcium in any grain
   → Gujarat/South India: Ragi malt popular
   → ✅ Excellent pregnancy food

9. KELA KA PHOOL / BANANA STEM (केले का तना / કેળાનો દાંડો)
   → Sabzi ya juice
   → Rich in potassium + magnesium
   → South Indian traditional — cramp remedy
   → ✅ Safe in pregnancy

10. HYDRATION — 3+ LITERS WATER
    → Dehydration = cramps ka #1 trigger
    → Garam paani prefer karo
    → Electrolyte drinks — Nimbu + namak + sugar

🧘 EXERCISES:

11. CALF STRETCH — Daily (Prevention)
    → Wall ke saamne khade ho — haath wall pe
    → 1 pair peeche — heel floor pe — push
    → 30 sec hold — each leg — 3 reps
    → Morning + bedtime — daily

12. ANKLE CIRCLES — Before sleep
    → Bed pe baithe — pair lambe
    → Ankle rotate — 10 clockwise + 10 anti
    → Blood circulation improve — cramps prevent

13. WALKING — 20 min daily
    → Blood flow — pair ki muscles active
    → ⚠️ Flat comfortable shoes
    → Evening walk before dinner — best time

SLEEP TIPS:
→ Left side sleeping — circulation best
→ Pillow between knees — leg alignment
→ Blanket loose — pair pe tight sheet nahi
→ Pair slightly elevated — pillow under ankles
→ Stretch before bed — 5 min routine`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Leg cramps = Vata prakopa in Mamsa dhatu (muscle tissue).
Pregnancy mein Vata naturally disturbed — Apana Vayu.
Dhatu kshaya (tissue depletion) — baby nutrients use karta.

🌿 PREGNANCY-SAFE REMEDIES:

1. BALA TAIL MASSAGE — ★ BEST
   → Halka garam Bala tail — pair ki muscles pe
   → Sone se pehle — 15 min massage
   → Vata shamak — muscle nourishment
   → Brand: Kottakkal ₹200-350/200ml
   → ✅ SAFE in pregnancy — external

2. DHANWANTARAM TAILAM — Leg massage
   → Pregnancy-specific oil — traditional
   → Calf + thigh muscles — gentle massage
   → ✅ SAFE — designed for pregnancy

3. SHATAVARI — 1/2-1 tsp doodh mein daily
   → Nutritive — muscle + nerve support
   → ✅ SAFE — pregnancy tonic

4. DASHMOOL KWATH — 15-20ml warm water mein
   → Vata shamak — muscle cramp reduce
   → ✅ SAFE in pregnancy

5. WARM SESAME OIL FOOT SOAK
   → Basin mein garam paani + 2 tbsp til tel
   → 15 min pair daalo — sone se pehle
   → Warming + nourishing — cramp prevent
   → ✅ SAFE

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 SUPPLEMENTS — PRIMARY TREATMENT:

1. MAGNESIUM 250-350mg daily — ★ MOST EFFECTIVE
   Brand: Magnesium Glycinate ₹300-500/60 caps
   → Best form: Glycinate (absorbed well, less laxative)
   → Alternative: Magnesium Citrate
   → 🤰: ✅ SAFE — recommended by many OBs
   → RESEARCH: Cochrane review — reduces leg cramp frequency
   → Take at bedtime — double benefit (sleep + cramps)
   → SIDE EFFECTS: Loose stools (if excess)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. CALCIUM 500-1000mg daily
   Brand: Shelcal ₹100-150 | Calcimax ₹120-180
   → 🤰: ✅ ESSENTIAL in pregnancy
   → Take separately from iron — 2 hour gap
   → Bedtime best — absorption good, cramp prevent
   → SIDE EFFECTS: Constipation
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. POTASSIUM — Through diet preferred
   → Banana, coconut water, orange, potato
   → Supplements usually not needed if diet good
   → 🤰: ✅ From food — safe

4. VITAMIN D3 — If deficient
   → Calcium absorption ke liye zaruri
   → Test karo → supplement karo
   → 🤰: ✅ Essential

5. VITAMIN B COMPLEX
   → Nerve function support
   → B1, B6 particularly — muscle cramp related
   → 🤰: ✅ Safe

💊 PAIN RELIEF (If severe cramp):
→ Paracetamol 500mg — safe in pregnancy
→ Gentle massage + stretching > medicine
→ ❌ Quinine — previously used but UNSAFE in pregnancy
→ ❌ Muscle relaxants — most UNSAFE in pregnancy`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Most pregnancy leg cramps normal hain.
But persistent pain, swelling, redness, warmth in one leg
= DVT (blood clot) — EMERGENCY. Doctor ko batao.`,
    },
    emergency: [
      { severity: "RED", text: `One leg mein: Pain + Swelling + Redness + Warmth` },
      { severity: "RED", text: `Leg pain + saans fulna = Pulmonary embolism possible` },
      { severity: "YELLOW", text: `Cramps so severe can't sleep 3+ nights` },
      { severity: "YELLOW", text: `Numbness/tingling persistent — nerve issue` },
    ],
    relatedIds: [8, 5, 9],
  },
  {
    id: 15,
    slug: "hair-fall",
    name: `Hair Fall`,
    nameHi: `बालों का झड़ना`,
    nameGu: `વાળ ખરવા`,
    emoji: "💇",
    category: "GENERAL_HEALTH",
    summary: `Hair fall is common in women due to hormones, postpartum changes, iron or vitamin deficiency, thyroid issues, and stress. Losing 50-100 strands a day is normal; more than that warrants checking for an underlying cause.`,
    whoGetsIt: ``,
    sections: {
      overview: `Normal: 50-100 baal girna daily normal hai.
Problem: Agar isse zyada gir rahe, patla ho raha, bald patches
aa rahe, ya hairline peeche ja rahi — toh investigate karo.

Women mein hair fall ke TYPES:
TELOGEN EFFLUVIUM (TE):
→ Temporary, diffuse (poore sir se) hair fall
→ Trigger ke 2-3 months baad start
→ Triggers: Pregnancy/delivery, surgery, illness, stress,
  crash dieting, medication change
→ Usually self-resolving in 6-12 months
→ MOST COMMON type in women

FEMALE PATTERN HAIR LOSS (FPHL):
→ Genetic — runs in family
→ Gradual thinning — top of head/crown
→ Hairline usually preserved (unlike men)
→ Hormonal — androgens + genetics
→ Progressive — treatment slows but may not reverse

ALOPECIA AREATA:
→ Autoimmune — sudden round bald patches
→ Can affect any age
→ Sometimes grows back on its own
→ Dermatologist treatment needed

POST-PARTUM HAIR FALL:
→ Delivery ke 2-4 months baad — suddenly zyada girna
→ Pregnancy mein baal achhe the — ab turant gir rahe
→ NORMAL — hormonal shift (estrogen drop)
→ Resolves by baby's first birthday usually
→ 50% new mothers experience this

COMMON CAUSES IN INDIAN WOMEN:
→ IRON DEFICIENCY — #1 cause — 53% Indian women anaemic
→ THYROID — hypothyroid especially
→ VITAMIN D DEFICIENCY — 70% Indian women
→ PCOS — androgen excess
→ STRESS — physical or emotional
→ NUTRITIONAL: Protein deficient, zinc, biotin, B12
→ POST-PREGNANCY — hormonal
→ CRASH DIETING — body ke liye stress
→ HEAT/CHEMICAL — straightening, coloring, tight hairstyles
→ MEDICATIONS — certain drugs

SYMPTOMS:
→ Comb/brush mein zyada baal aana
→ Pillow pe zyada baal
→ Shower drain mein clumps
→ Ponytail thinner ho gayi
→ Scalp dikhne laga parting mein
→ Overall volume kam — baal patla
→ Bald patches (alopecia areata)`,
      gharelu: `🛢️ HAIR OILS & MASKS:

1. COCONUT OIL + CURRY LEAVES — ★ TRADITIONAL BEST
   Hindi: नारियल तेल + करी पत्ता | Gujarati: નારિયેળ તેલ + કડી પત્તા
   → 100ml coconut oil mein 15-20 curry leaves daalke garam karo
   → Jab leaves kali ho jayein → chhaan ke bottle mein
   → Scalp massage — 30 min → shampoo
   → Week mein 2-3 baar
   → Curry leaves = iron + beta-carotene + protein for hair
   → Research: Curry leaves strengthen hair follicle
   → ✅ Safe — including pregnancy

2. AMLA OIL / AMLA + COCONUT OIL
   → 3-4 amla kaddukash karo + coconut oil mein pakao
   → Ya: Amla powder + coconut oil — heat gently
   → Scalp massage — raat bhar chhodo → morning shampoo
   → Vitamin C + antioxidants — strongest hair tonic
   → ✅ Safe in pregnancy

3. ONION JUICE (प्याज का रस / ડુંગળીનો રસ) — ★ RESEARCH PROVEN
   → 1 medium onion — grate + squeeze juice
   → Scalp pe lagao — 30-45 min — phir shampoo
   → Week mein 2-3 baar
   → RESEARCH: 86.9% participants showed regrowth
     (Journal of Dermatology study)
   → Sulphur content — collagen production + blood flow
   → ⚠️ Smell strong — rinse well
   → ⚠️ Patch test first — skin reaction check
   → ✅ Safe externally — pregnancy bhi

4. METHI DANA (Fenugreek) HAIR MASK
   → 2 tbsp methi dana — raat ko paani mein bhigao
   → Subah grind karke paste banao
   → Scalp + hair pe lagao — 30 min — shampoo
   → Protein + nicotinic acid — hair growth stimulate
   → Dandruff bhi kam — antifungal
   → Week mein 1-2 baar

5. ALOE VERA GEL — SCALP PE
   → Fresh aloe vera gel — scalp pe lagao
   → 30 min — shampoo
   → pH balance — scalp health
   → Moisturizing — breakage prevent
   → ✅ Safe in pregnancy

6. HIBISCUS (GUDHAL) FLOWER + OIL
   Hindi: गुड़हल | Gujarati: જાસૂદ
   → 4-5 hibiscus flowers + leaves grind karo
   → Coconut oil mein mix → scalp pe lagao
   → 1 hour → shampoo
   → Hair growth stimulate + premature greying prevent
   → ✅ Safe — traditional remedy

7. BHRINGRAJ OIL (भृंगराज / ભૃંગરાજ) — ★ AYURVEDIC KING
   → Bhringraj infused oil — buy ready-made
   → Scalp massage — 30 min before wash
   → "Bhringraj" = "King of Hair" in Ayurveda
   → Brand: Kesh King ₹150-250 | Baidyanath ₹100-180
   → ✅ Safe externally — pregnancy bhi

8. EGG + OLIVE OIL MASK
   → 1 egg + 1 tbsp olive oil — mix well
   → Hair + scalp pe lagao — 30 min — cold water wash
   → Protein + fat — hair strengthen
   → Week mein 1 baar
   → ⚠️ COLD water se dhona — garam se egg pakk jaata

🥗 DIET — HAIR GROWS FROM INSIDE:

9. PROTEIN — SABSE IMPORTANT
   → Hair = keratin = PROTEIN
   → Daily: Dal, paneer, eggs, chicken, fish, soy, nuts
   → Minimum 50-60g protein daily
   → Protein deficient = hair fall GUARANTEED

10. IRON RICH FOODS — #1 DEFICIENCY
    → Same as Condition #5: palak, gur, chana, dates
    → GET TESTED — Ferritin <40 = hair fall cause
    → Even if Hb normal — low Ferritin = hair fall

11. BIOTIN FOODS
    → Eggs, nuts, seeds, sweet potato, mushroom
    → Biotin = hair growth vitamin
    → Supplement: 2500-5000mcg daily (details below)

12. ZINC + SELENIUM FOODS
    → Pumpkin seeds, til, kaju, seafood
    → Zinc = hair growth cycle
    → Selenium = scalp health

13. OMEGA-3
    → Walnuts, flaxseed, fish
    → Scalp health — dry, flaky scalp fix
    → Anti-inflammatory

14. VITAMIN C + E
    → Amla, orange, kiwi (C)
    → Almonds, sunflower seeds (E)
    → Antioxidant — oxidative damage prevent
    → Collagen production (C) — hair strength

AVOID:
→ Crash dieting — body hair ko sacrifice karta hai
→ Excessive heat styling — iron, dryer, straightener
→ Tight hairstyles — traction alopecia
→ Chemical treatments frequently — color, keratin, rebonding
→ Excess sugar/junk food — inflammation
→ Smoking — circulation reduce — scalp blood flow kam`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Hair = Kesha — Asthi dhatu mala (bone tissue byproduct).
Hair fall = Khalitya/Palitya.
Pitta dushti primary — excess heat damages hair root.
Also Vata (dryness) + Rakta dushti (blood impurity).
Treatment: Pitta shamak + Rakta shuddhi + Kesha poshak.

🌿 KEY HERBS:

1. BHRINGRAJ / भृंगराज / ભૃંગરાજ (Eclipta Alba) — ★★★ KING OF HAIR
   INTERNAL: 500mg tablet 2 baar ya 3-5g churna doodh mein
   EXTERNAL: Bhringraj tel — scalp massage
   → #1 Ayurvedic herb for ALL hair problems
   → Hair growth stimulate + premature greying prevent
   → Pitta shamak — cooling for scalp
   → Brand: Baidyanath ₹80-130 | Kesh King oil ₹150-250
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: EXTERNAL ✅ Safe | INTERNAL ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. AMALAKI / AMLA (Indian Gooseberry)
   INTERNAL: 1 fresh amla daily ya Chyawanprash 1 tsp
   EXTERNAL: Amla oil ya amla paste hair mask
   → Vitamin C + antioxidant — collagen + iron absorption
   → Hair growth + premature greying prevent
   → Brand: Any amla oil ₹100-200/200ml
   → 🤰: ✅ Safe both internal + external
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. BRAHMI / ब्राह्मी / બ્રાહ્મી
   INTERNAL: 500mg tablet 2 baar
   EXTERNAL: Brahmi oil — scalp massage
   → Scalp nourishment — hair root strengthen
   → Stress-related hair fall — mind calm
   → Brand: Himalaya ₹150-250
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. NARIKELA (Coconut) + HIBISCUS
   → Coconut oil — base for all hair treatments
   → Hibiscus — hair growth stimulant
   → Combined: Most popular Ayurvedic hair remedy
   → ✅ Safe externally — all ages, pregnancy too

📦 FORMULATIONS:
5. BHRINGARAJASAVA — 15-20ml + paani, 2 baar
   → Internal liquid tonic for hair
   → Brand: Baidyanath ₹120-180/450ml
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

6. NEELIBHRINGADI KERAM — hair oil
   → Kottakkal brand — premium Ayurvedic hair oil
   → Bhringraj + Neeli + Amla in coconut oil base
   → Brand: Kottakkal ₹200-350/200ml
   → ✅ Safe externally

7. KAYYUNYADI KERAM — hair oil
   → Another premium Kottakkal oil — hair growth
   → Brand: Kottakkal ₹200-350/200ml
   → ✅ Safe externally

AYURVEDIC HAIR CARE ROUTINE:
→ Oil massage (Abhyanga) 2-3 times/week — before wash
→ Shikakai/Reetha for washing — chemical-free
→ Triphala water rinse — after shampoo
→ Avoid: Hot water on hair — lukewarm
→ Avoid: Tight hairstyles
→ Nasya (nasal oil drops) — Anu tail 2 drops daily

⚠️ Hair fall agar 3 months se zyada ho toh investigate karo.
Ayurveda + testing saath mein karo — cause dhundho.`,
      modern: `💊 FIRST — FIND THE CAUSE (Tests):
→ CBC: Hb, Ferritin — Iron deficiency ₹200-500
→ THYROID: TSH, T3, T4 — ₹300-500
→ VITAMIN D: 25-OH — ₹500-800
→ VITAMIN B12 — ₹300-500
→ ZINC, Biotin — ₹400-600
→ HORMONAL: Testosterone, DHEA-S (if PCOS suspected)
→ ANA (if autoimmune suspected)
→ Trichoscopy — dermatologist magnified scalp exam

💊 TREAT THE CAUSE:

1. IRON (If Ferritin <40) — MOST COMMON FIX
   → Ferrous Ascorbate (Orofer XT) — 1 daily
   → Target: Ferritin >70 for optimal hair growth
   → Takes: 3-6 months for visible improvement
   → Details: See CONDITION #5
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. VITAMIN D3 (If deficient)
   → 60,000 IU weekly × 8 weeks → then 1000-2000 IU daily
   → 70% Indian women deficient
   → Hair follicle receptors need Vitamin D
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. THYROID MEDICINE (If hypothyroid)
   → Levothyroxine — as per TSH level
   → Hair grows back once thyroid controlled
   → 3-6 months for visible improvement
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 SUPPLEMENTS:

4. BIOTIN 2500-5000mcg daily
   Brand: Biotin tabs ₹200-400/60 tabs
   → Hair, skin, nails — all improve
   → Research: Modest evidence for hair growth
   → Takes: 3-6 months minimum
   → 🤰: ✅ Safe (in food-level doses)
   → SIDE EFFECTS: Almost none
   → ⚠️ Can affect THYROID TEST results — tell doctor

5. ZINC 15-30mg daily
   Brand: Zinc supplements ₹100-200/60 tab
   → Hair growth cycle — essential mineral
   → Deficiency = hair fall
   → 🤰: ✅ Safe

6. MULTIVITAMIN — HAIR SPECIFIC
   Brand: Keraglo ₹400-600/30 tab | Follihair ₹350-500/30 tab
         Hair Plus ₹300-500/30 tab
   → Contains: Biotin + Iron + Zinc + L-Cysteine + Selenium
   → 1 tablet daily — 6 months minimum
   → 🤰: ⚠️ Check ingredients — some not pregnancy safe

💊 TOPICAL TREATMENTS (Dermatologist):

7. MINOXIDIL 2% SOLUTION — ★ MOST PROVEN TOPICAL
   Brand: Mintop ₹300-500 | Hair4U ₹250-450 (60ml)
   → Apply 1ml on scalp — 2 times daily
   → Rub gently — don't wash for 4 hours
   → Takes: 3-6 months for visible results
   → Continue: Stopping = hair fall returns
   → 🤰: ❌❌ AVOID IN PREGNANCY — teratogenic
   → 🤱: ❌ AVOID during breastfeeding
   → SIDE EFFECTS: Scalp irritation, initial shedding (normal),
     unwanted facial hair (if drips), headache
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

8. MINOXIDIL 5% — For more severe cases
   Brand: Mintop Forte ₹400-600/60ml
   → Stronger version — faster results
   → But more side effects
   → Women: Usually 2% recommended, 5% for severe cases
   → 🤰: ❌❌ ABSOLUTELY AVOID
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 ADVANCED (Dermatologist/Trichologist):

9. PRP THERAPY (Platelet Rich Plasma)
   → Your own blood → centrifuge → platelet extract
   → Inject into scalp — growth factors
   → 3-6 sessions — 1 month apart — ₹3000-8000/session
   → Research: Moderate evidence for hair regrowth
   → ✅ Safe — your own blood
   → 🤰: ⚠️ Usually postponed to after delivery

10. DERMA ROLLER / MICRONEEDLING
    → 0.5-1.5mm needles — scalp pe roll
    → Growth factor stimulation
    → Combined with Minoxidil — better absorption
    → ₹500-2000 per session (or home device ₹300-800)
    → 🤰: ⚠️ AVOID during pregnancy

💊 FOR PCOS-RELATED HAIR LOSS:
→ Spironolactone 25-100mg — anti-androgen (Condition #3)
→ OCP with anti-androgen (Yasmin/Diane-35)
→ 🤰: ❌❌ Both AVOID in pregnancy

💊 FOR POST-PARTUM HAIR FALL:
→ Usually TEMPORARY — resolves by 12 months
→ Continue prenatal vitamins
→ Iron supplement — check Ferritin
→ Biotin 2500mcg daily
→ Protein intake increase — 60g+ daily
→ Minoxidil: ❌ Not while breastfeeding
→ Be patient — hair WILL come back`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Hair fall ka CAUSE dhundhna sabse important hai.
Without cause → supplements = money waste.
Blood test ZAROOR karwao — Ferritin, Thyroid, Vitamin D.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Sudden bald patches overnight — Alopecia areata — dermatologist` },
      { severity: "RED", text: `Hair fall + extreme weakness + weight change — Thyroid check` },
      { severity: "RED", text: `Hair fall + scalp burning/pain — scarring alopecia — urgent` },
      { severity: "YELLOW", text: `Post-delivery excessive hair fall — check iron, thyroid` },
      { severity: "YELLOW", text: `Hair fall + acne + irregular periods — PCOS check` },
    ],
    relatedIds: [5, 3],
  },
  {
    id: 16,
    slug: "thyroid",
    name: `Thyroid Disorders`,
    nameHi: `थायराइड की समस्या`,
    nameGu: `થાઇરોઇડ સમસ્યા`,
    emoji: "🦋",
    category: "PCOS_HORMONAL",
    summary: `Thyroid disorders (hypothyroid and hyperthyroid) are very common in Indian women. Symptoms range from weight, mood, and period changes to energy issues. A simple TSH blood test diagnoses it; most cases are easily managed with medication.`,
    whoGetsIt: ``,
    sections: {
      overview: `Thyroid gland (gale mein butterfly-shaped gland) body ka
metabolism control karti hai. Jab yeh properly kaam nahi karti
toh sab kuch affect hota hai — weight, energy, periods, mood,
hair, skin, pregnancy sab. Women mein men se 5-8 times zyada
common hai.

TYPES:
HYPOTHYROID (Kam active — MOST COMMON in India):
→ Thyroid hormone KAM ban raha hai
→ Body SLOW ho jaati hai
→ Weight badhna, thakan, hair fall, depression
→ Periods heavy/irregular
→ Hashimoto's thyroiditis — autoimmune cause

HYPERTHYROID (Zyada active):
→ Thyroid hormone ZYADA ban raha hai
→ Body FAST ho jaati hai
→ Weight kam hona, anxiety, palpitation, tremor
→ Periods light/irregular/stop
→ Graves' disease — autoimmune cause

SUBCLINICAL:
→ TSH slightly abnormal but T3/T4 normal
→ Symptoms mild ya absent
→ May need treatment — doctor decides

INDIA SPECIFIC:
→ 42 million Indians have thyroid disease (estimated)
→ 1 in 10 Indian adults — hypothyroid
→ Women: 1 in 8 will develop thyroid issue
→ Iodine deficiency still issue in some areas
→ 2-3% pregnant women — hypothyroid
→ Postpartum thyroiditis — 5-10% new mothers

👩 SYMPTOMS:

HYPOTHYROID (Slow):
→ Weight gain — despite eating same/less
→ Extreme fatigue — constant tiredness
→ Hair fall — diffuse, all over
→ Dry skin — rough, flaky, pale
→ Constipation — chronic
→ Heavy/irregular periods — menorrhagia
→ Depression — low mood, no motivation
→ Cold intolerance — always feeling cold
→ Puffy face — especially morning
→ Brain fog — memory/concentration problems
→ Muscle pain/stiffness
→ High cholesterol
→ Fertility issues — difficulty conceiving
→ Brittle nails
→ Slow heart rate

HYPERTHYROID (Fast):
→ Weight loss — despite eating more
→ Anxiety, nervousness, irritability
→ Palpitations — heart racing
→ Tremor — hands shaking
→ Excessive sweating — heat intolerance
→ Periods light/irregular/absent
→ Insomnia — can't sleep
→ Diarrhea/loose motions
→ Eye problems — bulging (Graves')
→ Muscle weakness
→ Thin skin
→ Fine brittle hair`,
      gharelu: `FOR HYPOTHYROID — METABOLISM BOOST:

1. COCONUT OIL (नारियल तेल / નારિયેળ તેલ)
   → 1-2 tsp daily — cooking mein ya direct
   → Medium-chain fatty acids — metabolism boost
   → Thyroid function support — research emerging
   → ✅ Safe — including pregnancy

2. ASHWAGANDHA MILK (अश्वगंधा दूध)
   → Details in Ayurveda section below
   → TSH + T3/T4 balance — research supported
   → ⚠️ Hyperthyroid mein AVOID

3. KALA NAMAK + NIMBU (Black Salt + Lemon)
   → 1 glass garam paani + kala namak + nimbu
   → Subah khali pet — metabolism kickstart
   → Mineral support + Vitamin C

4. MULETHI / LICORICE (मुलेठी / જેઠીમધ)
   → Small piece chabao — din mein 1-2 baar
   → Cortisol balance — thyroid axis support
   → ⚠️ Hypertension mein avoid — BP badh sakta
   → ⚠️ Pregnancy mein small amounts only

5. ADRAK (Ginger)
   → Fresh adrak chai — 2-3 cups daily
   → Anti-inflammatory — thyroid inflammation reduce
   → Zinc + Magnesium — thyroid function cofactors
   → ✅ Safe — pregnancy mein limit 3 cups

🥗 DIET — THYROID SPECIFIC:

FOR HYPOTHYROID — EAT:
→ Iodized salt — ALWAYS use (iodine essential for thyroid)
→ Selenium: Brazil nuts (2-3 daily = full selenium dose)
→ Zinc: Pumpkin seeds, til, kaju, chana
→ Tyrosine: Eggs, fish, dairy, soy, chicken
→ Vitamin A: Gajar, shakarkandi (sweet potato)
→ Omega-3: Fish, walnuts, flaxseed
→ Coconut oil — MCTs for metabolism
→ Bone broth — L-glutamine, minerals

FOR HYPOTHYROID — AVOID/LIMIT:
→ GOITROGENS (raw): Broccoli, cauliflower, cabbage, soy
  → COOKING DESTROYS goitrogens — cooked is fine!
  → Raw excess = iodine absorption block
→ Gluten: Some Hashimoto's patients benefit from reducing
→ Excess caffeine — cortisol disturb → thyroid affect
→ Highly processed food — inflammation
→ Excess soy — may interfere with medication absorption
→ ⚠️ Take thyroid medicine on EMPTY STOMACH
  → 30-60 min before breakfast
  → No tea/coffee/supplements with it

FOR HYPERTHYROID — EAT:
→ Cruciferous vegetables (raw okay!) — natural goitrogens
→ Calcium-rich — dairy, ragi (bone loss prevention)
→ Berries — antioxidant
→ Healthy fats — coconut, ghee
→ AVOID: Iodine excess, seaweed, excess salt
→ AVOID: Caffeine — worsens anxiety/palpitation
→ AVOID: Excess sugar — metabolism already fast`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Thyroid = "Galaganda" (goiter) in ancient texts.
Hypothyroid = Kapha + Meda dushti — sluggish metabolism
Hyperthyroid = Pitta + Vata dushti — overactive metabolism
Agni (digestive fire) directly linked to thyroid function.

🌿 KEY HERBS:

1. ASHWAGANDHA / अश्वगंधा / અશ્વગંધા — ★★★ BEST FOR THYROID
   → 500mg-1g daily — doodh mein raat ko
   → Ya KSM-66 extract: 600mg daily
   → RESEARCH: Significantly improves TSH, T3, T4 in
     subclinical hypothyroid (8-week RCT, JAMA)
   → Adaptogen — balances both hypo + hyper tendencies
   → Cortisol reduce — HPA axis → thyroid axis
   → Brand: KSM-66 ₹400-600 | Himalaya ₹200-300
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ❌ AVOID — may cause miscarriage
   → ⚠️ Hyperthyroid mein CAUTION — may overstimulate
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. KANCHNAR / GUGGULU (कांचनार गुग्गुलु / કાંચનાર ગુગ્ગુલ)
   → Kanchnar Guggulu tablets: 2 tab 2 baar garam paani se
   → ★ BEST Ayurvedic for thyroid nodules + goiter
   → Thyroid tissue pe direct action
   → Also cysts dissolve karta hai — PCOS bonus
   → Brand: Baidyanath ₹100-160/80tab | Patanjali ₹60-90
   → TEEN: 1 tab 2 baar | ADULT: 2 tab 2 baar
   → 🤰: ❌ AVOID (Guggulu)
   → Duration: 3-6 months minimum
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. GUGGULU / गुग्गुलु / ગુગ્ગુળ (Commiphora Mukul)
   → Directly stimulates thyroid — T3/T4 conversion improve
   → Usually part of Kanchnar Guggulu formula
   → Pure Guggulu: 500mg 2 baar
   → Brand: Baidyanath ₹80-130
   → 🤰: ❌ AVOID
   → ⚠️ Blood thinners ke saath caution
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. JALAKUMBHI / JALKUMBHI (Water Hyacinth)
   → Traditional iodine-rich plant
   → Goiter specifically — iodine deficiency areas
   → Less commonly available — Vaidya se lo
   → 🤰: ⚠️ Consult Vaidya

5. SHIGRU / SAHJAN / DRUMSTICK (Moringa / सहजन / સરગવો)
   → Moringa leaves — sabzi, powder, tea
   → High in selenium, zinc, iron — thyroid cofactors
   → Moringa powder: 1 tsp daily in water/smoothie
   → Brand: Various ₹150-300/100g powder
   → 🤰: ✅ Safe as food — supplement form consult doctor
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
6. KANCHNAR GUGGULU — (detailed above)
7. AROGYAVARDHINI VATI — 2 tab 2 baar
   → Liver + metabolism + thyroid support
   → Brand: Baidyanath ₹80-130/40tab
   → 🤰: ❌ AVOID (contains processed mercury)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.
8. VARUNADI KASHAYAM — 15ml 2 baar
   → Brand: Kottakkal ₹150-250
   → Thyroid + cyst support
   → 🤰: ⚠️ Consult Vaidya

⚠️ SECTION DISCLAIMER:
Thyroid medicine (Levothyroxine) chal rahi hai toh
Ayurvedic medicine REPLACE nahi kar sakti. Dono saath
le sakte ho but 2 ghante gap zaroor rakho.
TSH regular monitor karo. Vaidya + Endocrinologist
dono se salah lein.`,
      modern: `💊 FOR HYPOTHYROID:

1. LEVOTHYROXINE (T4 Replacement) — ★ STANDARD TREATMENT
   Hindi: लिवोथायरॉक्सिन | Gujarati: લિવોથાયરોક્સિન
   Brand: Thyronorm (Abbott) | Eltroxin (GSK) | Thyrox (Macleods)
   Price: ₹50-150 per strip (30-100 tab) depending on dose

   DOSE: Based on TSH level (doctor determines)
   → Usual start: 25-50 mcg daily
   → Adjust every 6-8 weeks based on TSH
   → Usual maintenance: 50-150 mcg daily
   → ELDERLY/CARDIAC: Start very low — 12.5-25 mcg

   HOW TO TAKE — CRITICAL:
   → EMPTY STOMACH — morning, 30-60 min BEFORE breakfast
   → With PLAIN WATER only
   → NO tea, coffee, milk for 30-60 min after
   → NO calcium, iron, antacids for 4 hours
   → SAME TIME daily — consistency important
   → NEVER skip — never double dose if missed

   🤰 PREGNANCY: ✅ ESSENTIAL — dose usually increases
     → TSH check every 4-6 weeks during pregnancy
     → Untreated hypothyroid = miscarriage, preterm, baby IQ
     → Usually need 25-50% MORE dose in pregnancy
     → Tell OB-GYN immediately if pregnant
   🤱 BREASTFEEDING: ✅ Safe — continue

   SIDE EFFECTS (usually means dose too high):
   → If overdosed: Palpitation, anxiety, tremor, weight loss,
     insomnia, sweating, diarrhea — tell doctor → reduce dose
   → Correct dose: Almost NO side effects — replacing what
     body should make naturally
   → Hair may increase initially then stabilize

   MONITORING:
   → TSH every 6-8 weeks until stable
   → Then TSH every 6-12 months
   → Pregnancy: Every 4-6 weeks
   → Target TSH: 0.5-4.5 mIU/L (general)
   → Pregnancy: TSH <2.5 mIU/L (stricter)

   LIFETIME TREATMENT:
   → Most hypothyroid patients need medicine LIFELONG
   → Stopping = symptoms return within weeks
   → Natural alternatives CANNOT replace in moderate-severe
   → Subclinical: Doctor may try stopping after some time

   ⚠️ Doctor ki prescription ke bina medicine mat lena.
   Yeh sirf general information hai.

💊 FOR HYPERTHYROID:

2. CARBIMAZOLE / METHIMAZOLE
   Brand: Neomercazole ₹30-60 (30 tab) | Thyrozol ₹40-70
   → Anti-thyroid — hormone production reduce
   → Dose: 10-40mg daily — doctor titrates
   → Duration: 12-18 months usually
   → 🤰: ⚠️ Methimazole avoid 1st trimester (birth defects)
     PTU preferred in 1st trimester
   → SIDE EFFECTS: Rash, joint pain, GI upset
   → RARE but SERIOUS: Agranulocytosis (WBC drop) —
     Fever + sore throat = STOP + blood test TURANT
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. PROPYLTHIOURACIL (PTU)
   Brand: PTU tablets ₹40-80
   → Alternative to Carbimazole
   → 🤰: Preferred in 1st trimester pregnancy
   → SIDE EFFECTS: Liver damage risk (rare but serious)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. BETA-BLOCKERS (Symptom Control)
   → Propranolol 20-40mg — palpitation, tremor, anxiety
   → While waiting for anti-thyroid to work
   → 🤰: ⚠️ Doctor decides — generally okay
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. RADIOACTIVE IODINE (RAI) — Definitive treatment
   → Destroys overactive thyroid tissue
   → Single dose — OPD procedure
   → Results in hypothyroid → then Levothyroxine lifelong
   → 🤰: ❌❌ ABSOLUTELY AVOID — radiation
   → Not pregnant for 6 months after treatment

6. SURGERY (Thyroidectomy) — Rare
   → Large goiter, cancer suspicion, failed medical
   → Then Levothyroxine lifelong

💊 SUPPLEMENTS:

7. SELENIUM 200mcg daily — ★ PROVEN FOR HASHIMOTO'S
   → Reduces thyroid antibodies significantly
   → Brazil nuts: 2-3 daily = full selenium dose
   → Brand: Selenium supplements ₹200-400/60 caps
   → 🤰: ✅ Safe (up to 200mcg)
   → Duration: 6+ months

8. ZINC 15-30mg daily
   → T4 to T3 conversion needs zinc
   → 🤰: ✅ Safe

9. VITAMIN D — If deficient
   → Hashimoto's strongly linked to Vitamin D deficiency
   → Test → supplement
   → 🤰: ✅ Essential

10. IODINE — ONLY if deficient
    → ⚠️ Do NOT supplement randomly
    → Excess iodine can worsen both hypo + hyper
    → Iodized salt = enough for most people
    → Supplement only if doctor confirms deficiency

💊 TESTS:
→ TSH — ₹200-400 — SCREENING test (#1 most important)
→ Free T3, Free T4 — ₹400-700 — if TSH abnormal
→ Anti-TPO antibodies — ₹400-600 — Hashimoto's check
→ Anti-Thyroglobulin — ₹400-600 — autoimmune
→ TSH Receptor Antibodies — ₹600-1000 — Graves' disease
→ Thyroid Ultrasound — ₹500-1000 — nodules, size
→ FNAC (Fine Needle) — ₹500-1500 — if nodule suspicious
→ Radioactive Iodine Uptake — if hyperthyroid investigation`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Thyroid medicine LIFELONG chahiye most patients ko.
Ayurvedic supplements SUPPORT mein lo, REPLACE nahi karte.
TSH regular monitor karo. Pregnancy mein thyroid control
MANDATORY hai — baby ke brain development ke liye.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `THYROID STORM (Hyperthyroid crisis):` },
      { severity: "RED", text: `MYXEDEMA COMA (Severe Hypothyroid):` },
      { severity: "YELLOW", text: `Pregnancy + abnormal TSH — urgent endocrinologist` },
      { severity: "YELLOW", text: `New lump in neck — thyroid ultrasound needed` },
      { severity: "YELLOW", text: `Already on medicine + symptoms returning — dose adjust` },
    ],
    relatedIds: [15, 3, 18, 2],
  },
  {
    id: 17,
    slug: "migraine",
    name: `Migraine / Headache`,
    nameHi: `सिर दर्द`,
    nameGu: `માથાનો દુખાવો`,
    emoji: "🤕",
    category: "GENERAL_HEALTH",
    summary: `Migraine in women is often hormone-linked, with attacks around periods, ovulation, or perimenopause. Symptoms include throbbing one-sided headache, nausea, and light sensitivity. Triggers vary; both lifestyle and medication help.`,
    whoGetsIt: ``,
    sections: {
      overview: `Sir mein dard — causes alag alag hote hain. Women mein men
se 3x zyada common hai — especially migraine. Hormonal
connection strong hai — periods, pregnancy, menopause mein
headache pattern change hota hai.

TYPES:
TENSION HEADACHE (Most Common — 80%):
→ Dono taraf dard — band jaisa tighten feel
→ Mild to moderate — kaam kar sakte ho usually
→ Stress, posture, screen time, lack of sleep
→ Nausea usually nahi hota

MIGRAINE (15-20% women):
→ Ek taraf dard — throbbing/pulsating
→ Moderate to SEVERE — kaam nahi kar sakte
→ Nausea/vomiting — light/sound sensitivity
→ Aura (some): Visual disturbance, flashing lights, zig-zag
→ 4-72 hours last ho sakta
→ Menstrual migraine — period ke aas-paas
→ Family history strong

SINUS HEADACHE:
→ Forehead/cheeks/nose ke aas paas pressure
→ Cold/allergy ke saath
→ Bending forward se badhta hai

HORMONAL:
→ Period se 2-3 din pehle — estrogen drop triggers
→ Pregnancy mein: 1st trimester zyada, better by 2nd
→ Birth control pills — some women trigger

TRIGGERS (Common):
→ Stress — #1 trigger
→ Sleep: Too little OR too much
→ Dehydration — paani kam
→ Meal skipping — blood sugar drop
→ Caffeine: Too much OR withdrawal (suddenly band)
→ Screen time — blue light, eye strain
→ Weather change — barometric pressure
→ Strong smells — perfume, paint
→ Certain foods: Cheese, chocolate, alcohol, MSG
→ Hormonal: Period time, ovulation`,
      gharelu: `⚡ INSTANT RELIEF:

1. PEPPERMINT/PUDINA OIL — ★ RESEARCH PROVEN
   → 1-2 drops peppermint oil temples pe lagao
   → Ya pudina leaves crush → forehead pe
   → RESEARCH: Peppermint oil = equivalent to paracetamol
     for tension headache (German study)
   → Cooling sensation — blood flow + pain relief
   → ✅ Safe externally — ⚠️ Eyes ke paas nahi
   → ✅ Pregnancy: External diluted okay

2. ADRAK CHAI (Ginger Tea)
   → Fresh adrak grated — garam paani — 2 cups
   → RESEARCH: 250mg ginger = similar to sumatriptan
     for migraine (RCT study)
   → Anti-inflammatory + anti-nausea
   → ✅ Safe — pregnancy mein 2-3 cups max

3. COLD COMPRESS — For Migraine
   → Ice pack / frozen towel — forehead ya neck pe
   → 15-20 min — blood vessel constriction = pain reduce
   → Best for throbbing migraine specifically
   → ✅ Safe including pregnancy

4. WARM COMPRESS — For Tension Headache
   → Garam towel — neck, shoulders pe
   → Muscle tension release — pain reduce
   → Bath: Garam paani se nahao — full body relax

5. HALDI DOODH (Golden Milk)
   → 1 tsp haldi + doodh + kaali mirch
   → Anti-inflammatory — chronic headache reduce
   → Raat ko — sleep bhi better
   → ✅ Safe in pregnancy

6. LAUNG / CLOVE (लौंग / લવિંગ)
   → 3-4 laung crush karo — kapde mein baandho
   → Inhale karo — aroma therapy
   → Ya laung powder + til tel — temples pe massage
   → Eugenol = analgesic + anti-inflammatory
   → ✅ Safe — ⚠️ Pregnancy mein small external use okay

7. TULSI CHAI (Holy Basil Tea)
   → 8-10 tulsi leaves — garam paani mein steep
   → Adaptogen — stress headache mein best
   → Muscle relaxant + analgesic mild
   → ✅ Safe

8. LAVENDER OIL — AROMATHERAPY
   → 2-3 drops lavender oil — pillow pe ya tissue pe
   → Inhale — 15 min — migraine relief
   → RESEARCH: Lavender inhalation significantly reduces
     migraine severity (European Neurology study)
   → ✅ Safe externally — pregnancy bhi

LIFESTYLE — PREVENTION:
→ HYDRATION: 2.5-3L water daily — dehydration = headache
→ SLEEP: Regular 7-8 hours — same time daily
→ MEALS: Don't skip — blood sugar drop = trigger
→ SCREEN BREAKS: 20-20-20 rule (20 min, 20 feet, 20 sec)
→ EXERCISE: Regular 30 min — endorphins
→ STRESS MANAGEMENT: Daily 10 min meditation
→ CAFFEINE: Consistent intake — sudden change = trigger
→ POSTURE: Neck/shoulder alignment check
→ TRIGGER DIARY: Track what causes YOUR headaches`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Headache = "Shirahshool" — multiple dosha involvement.
Vata: Sharp, pulsating, one-sided, worse with movement
Pitta: Burning, temples, with nausea, light sensitivity
Kapha: Heavy, dull, frontal, with congestion

🌿 HERBS:

1. BRAHMI / ब्राह्मी / બ્રાહ્મી — ★ BRAIN TONIC
   → 500mg tablet 2 baar ya 1 tsp churna
   → Brain circulation improve — chronic headache
   → Stress-related headache specifically
   → Brand: Himalaya ₹150-250
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. JATAMANSI / जटामांसी — ★ MIGRAINE SPECIFIC
   → 250-500mg tablet ya 1-2g churna — raat ko
   → Nervine sedative — migraine prevention
   → Valerian-like action — calming
   → Brand: Baidyanath ₹150-250
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. SHANKHPUSHPI / शंखपुष्पी / શંખપુષ્પી
   → 500mg tablet 2 baar ya syrup 2 tsp
   → Brain tonic — memory + headache + anxiety
   → Brand: Dabur ₹80-130/200ml syrup
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. SHIRASHOOLADI VAJRA RAS — 1 tab 2 baar
   → Specifically for "Shirahshool" (headache)
   → Brand: Baidyanath ₹100-180/25tab
   → 🤰: ❌ AVOID (mineral-based)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

EXTERNAL THERAPIES:
→ NASYA: Anu tail 2 drops each nostril — morning
  (Clears sinuses + brain nourishment)
→ SHIRODHARA: Warm oil stream on forehead — clinic therapy
  (Best for chronic migraine — relaxation therapy)
→ SHIROBASTI: Oil pooling on head — clinic therapy
→ SHIRO ABHYANGA: Head massage with Brahmi/Bhringraj oil

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 ACUTE TREATMENT (Jab dard ho):

1. PARACETAMOL 500mg-1g — First Line
   Brand: Crocin ₹10-25 | Dolo ₹10-20
   → 1-2 tab every 6-8 hours — max 4g/day
   → Mild-moderate tension headache
   → 🤰: ✅ SAFEST — Category B
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. IBUPROFEN 400mg — Tension + Migraine
   Brand: Brufen ₹15-25 | Combiflam ₹30-50
   → 400mg every 6-8 hours with food
   → Better than Paracetamol for migraine
   → 🤰: ❌ AVOID (especially 3rd trimester)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. SUMATRIPTAN 50mg — ★ MIGRAINE SPECIFIC (Triptan)
   Brand: Suminat ₹40-80 | Sumatriptan ₹30-60 (1-2 tab)
   → 50-100mg at onset of migraine
   → Can repeat after 2 hours if needed — max 200mg/day
   → Works on serotonin receptors — migraine-specific
   → Best: Take EARLY — as soon as migraine starts
   → 🤰: ⚠️ Category C — doctor decides case by case
   → SIDE EFFECTS: Tingling, chest tightness (usually brief),
     drowsiness, jaw tightness
   → ⚠️ NOT for tension headache — migraine ONLY
   → ⚠️ Heart disease mein AVOID
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. DOMPERIDONE 10mg (Anti-nausea — with migraine)
   Brand: Domstal ₹15-25
   → 10mg with painkiller — nausea relief + absorption better
   → 🤰: ⚠️ Consult doctor
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 PREVENTION (Frequent headaches — 4+/month):

5. PROPRANOLOL 20-40mg (Beta-blocker)
   → Daily — migraine prevention #1 choice
   → 20-80mg 2 times daily
   → 🤰: ⚠️ Doctor decides — generally used
   → SIDE EFFECTS: Fatigue, cold hands, low BP
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

6. AMITRIPTYLINE 10-25mg (Low-dose antidepressant)
   → Bedtime — migraine + tension headache prevention
   → Also helps sleep
   → 🤰: ⚠️ Category C — doctor decides
   → SIDE EFFECTS: Drowsiness, dry mouth, weight gain
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

7. TOPIRAMATE 25-100mg
   → Migraine prevention — effective
   → 🤰: ❌❌ AVOID — birth defects (cleft palate)
   → SIDE EFFECTS: Tingling, cognitive slowness, weight loss
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 SUPPLEMENTS:

8. MAGNESIUM 400-600mg daily — ★ PROVEN
   → Migraine prevention — Cochrane review supported
   → Magnesium Glycinate/Citrate
   → 🤰: ✅ Safe
   → Start: 200mg → increase to 400-600mg

9. RIBOFLAVIN (Vitamin B2) 400mg daily
   → Migraine prevention — RCT evidence
   → Takes 3 months for full effect
   → Brand: ₹200-400 | 🤰: ✅ Safe

10. CoQ10 100-300mg daily
    → Mitochondrial support — migraine prevention
    → 🤰: ⚠️ Limited data — consult doctor

11. FEVERFEW 100-300mg (Herbal)
    → Traditional migraine prevention herb
    → 🤰: ❌ AVOID — uterine stimulant

⚠️ MEDICATION OVERUSE HEADACHE:
Taking painkillers >10-15 days/month = REBOUND headache
Body becomes dependent — medicine CAUSES headache
Solution: Gradual withdrawal under doctor guidance`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Most headaches benign hain but some
are WARNING SIGNS of serious conditions. Red flags below.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `"WORST HEADACHE OF MY LIFE" — sudden, severe` },
      { severity: "RED", text: `Headache + fever + stiff neck = Meningitis — EMERGENCY` },
      { severity: "RED", text: `Headache + vision changes + confusion = Stroke possible` },
      { severity: "RED", text: `Headache + seizure = EMERGENCY` },
      { severity: "RED", text: `Pregnancy + severe headache + vision changes + swelling` },
      { severity: "RED", text: `New headache after head injury = Concussion/bleeding` },
      { severity: "YELLOW", text: `Progressively worsening over weeks — brain imaging needed` },
      { severity: "YELLOW", text: `New pattern after age 50 — investigate` },
    ],
    relatedIds: [12, 18, 5],
  },
  {
    id: 18,
    slug: "anxiety",
    name: `Anxiety`,
    nameHi: `चिंता और तनाव`,
    nameGu: `ચિંતા અને તણાવ`,
    emoji: "🫧",
    category: "MENTAL_HEALTH",
    summary: `Anxiety is excessive worry that interferes with daily life — affecting twice as many women as men. Symptoms include racing thoughts, palpitations, and sleep issues. Lifestyle, therapy, and sometimes medication are all effective.`,
    whoGetsIt: ``,
    sections: {
      overview: `Anxiety = excessive worry jo control mein nahi aa raha.
Stress = body ka response to demanding situations.
Women mein men se 2x zyada common — hormonal + social factors.
Normal anxiety (exam/interview pehle) vs disorder (daily life
affect ho rahi) — difference samajhna zaroori.

TYPES:
GENERALIZED ANXIETY DISORDER (GAD):
→ Chronic worry — multiple things about
→ 6+ months — most days
→ Restlessness, muscle tension, sleep issues

PANIC DISORDER:
→ Sudden intense fear episodes — "panic attacks"
→ Heart racing, can't breathe, chest pain, sweating
→ Feels like heart attack — but it's not
→ 10-20 min episodes — terrifying

SOCIAL ANXIETY:
→ Extreme fear of social situations/judgment
→ Avoiding gatherings, presentations, phone calls

POSTPARTUM ANXIETY:
→ After delivery — 15-20% new mothers
→ Excessive worry about baby's safety
→ Can't sleep even when baby sleeping
→ Different from "baby blues" — more severe/lasting

PERINATAL ANXIETY:
→ During pregnancy — 15-20%
→ Worry about baby, delivery, motherhood
→ Physical symptoms — nausea, insomnia, tension

WHY MORE IN WOMEN:
→ Hormonal fluctuations — estrogen/progesterone affect brain
→ PMS/PMDD — cyclical anxiety
→ Pregnancy/postpartum — massive hormonal shifts
→ Social expectations — multiple role pressure
→ Higher emotional sensitivity — biological
→ Thyroid disorders (more in women) — anxiety mimic

SYMPTOMS:
EMOTIONAL: Excessive worry, restlessness, irritability,
fear, feeling of doom, difficulty concentrating
PHYSICAL: Heart racing, sweating, trembling, muscle tension,
headache, stomach upset, insomnia, fatigue, chest tightness,
shortness of breath, numbness/tingling`,
      gharelu: `🧘 IMMEDIATE CALMING TECHNIQUES:

1. 4-7-8 BREATHING — ★ INSTANT CALM
   → Inhale through nose: 4 counts
   → Hold: 7 counts
   → Exhale through mouth: 8 counts
   → Repeat 4 cycles — parasympathetic nervous system activate
   → Works in 60 seconds — research proven
   → Panic attack ke time bhi use karo
   → ✅ Safe — anytime, anywhere

2. GROUNDING — 5-4-3-2-1 TECHNIQUE
   → Name: 5 things you can SEE
   → 4 things you can TOUCH
   → 3 things you can HEAR
   → 2 things you can SMELL
   → 1 thing you can TASTE
   → Brings mind to present — stops spiraling
   → ✅ Panic attack mein very effective

3. PROGRESSIVE MUSCLE RELAXATION
   → Pair se shuru — ek ek muscle group
   → Tense 5 seconds → Release 10 seconds
   → Pair → Calves → Thighs → Stomach → Chest → Hands → Face
   → Full body: 15 min — deep relaxation
   → Bedtime mein karo — sleep bhi better

🍵 CALMING DRINKS:

4. CHAMOMILE TEA — ★ RESEARCH PROVEN
   → 1-2 cups daily — especially evening
   → RESEARCH: GAD patients — significant improvement vs placebo
   → Apigenin = natural anxiolytic (anti-anxiety)
   → Brand: Various ₹150-300/25 bags
   → ✅ Safe — ⚠️ Pregnancy: Moderate okay, excess avoid

5. ASHWAGANDHA DOODH — ★ MOST PROVEN ADAPTOGEN
   → Details in Ayurveda section
   → Cortisol reduce — stress response calm
   → ⚠️ Pregnancy mein AVOID

6. HALDI DOODH (Golden Milk) — Raat ko
   → Anti-inflammatory — brain inflammation reduce
   → Sleep support — anxiety night mein worse
   → ✅ Safe in pregnancy

7. TULSI CHAI (Holy Basil)
   → 8-10 tulsi leaves — garam paani
   → Adaptogen — stress hormones balance
   → Cortisol reduce — research supported
   → ✅ Safe

8. JATAMANSI TEA
   → 1/2 tsp powder — garam paani mein
   → Natural tranquilizer — no drowsiness
   → ⚠️ Pregnancy: AVOID

🥗 ANTI-ANXIETY FOODS:
→ Omega-3: Walnuts, flaxseed, fish — brain health
→ Magnesium: Dark chocolate, almonds, palak — relaxation
→ Zinc: Pumpkin seeds, cashew — neurotransmitter support
→ Probiotics: Dahi, kanji — gut-brain axis
→ Complex carbs: Oats, daliya — serotonin support
→ Avoid: Excess caffeine, alcohol, sugar, processed food

🏃 LIFESTYLE — MOST IMPORTANT TREATMENT:
→ EXERCISE: 30 min daily — AS EFFECTIVE as medication
  for mild-moderate anxiety (Cochrane review)
  Walking, yoga, swimming — anything regular
→ YOGA: Specifically anxiety-reducing —
  Shavasana, Pranayama, Balasana, Forward bends
→ MEDITATION: Daily 10-20 min — mindfulness
  Apps: Insight Timer (free), Headspace
→ SLEEP HYGIENE: 7-8 hours, same time, dark room,
  no screens 1 hour before bed
→ JOURNALING: Write worries before bed — "brain dump"
→ SOCIAL CONNECTION: Isolation worsens — talk to someone
→ NATURE: 20 min in green space — cortisol reduces
→ LIMIT NEWS/SOCIAL MEDIA: Doom scrolling = anxiety spiral`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Anxiety = "Chittodvega" — Vata dushti in Manas (mind).
Prana Vayu (mental energy flow) disturbed.
Also Pitta involvement — anger, irritability.
Treatment: Vata shamak + Medhya (brain tonic) + Sattvic lifestyle.

🌿 KEY HERBS:

1. ASHWAGANDHA / अश्वगंधा / અશ્વગંધા — ★★★ BEST ADAPTOGEN
   → KSM-66 extract: 600mg daily ya
   → Churna: 500mg-1g doodh mein raat ko
   → RESEARCH: Multiple RCTs — significantly reduces anxiety,
     cortisol levels, and stress scores
   → Adaptogen — body ko stress handle karne mein madad
   → Brand: KSM-66 ₹400-600 | Himalaya ₹200-300
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ❌ AVOID
   → 🤱: ⚠️ Consult — some traditions say safe
   → SIDE EFFECTS: Rare — drowsiness, stomach upset
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. BRAHMI / ब्राह्मी / બ્રાહ્મી (Bacopa Monnieri) — ★★ BRAIN TONIC
   → 500mg-1g daily — 2 divided doses
   → RESEARCH: Reduces anxiety + improves cognition
   → Memory + focus + calm — triple benefit
   → Brand: Himalaya ₹150-250
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. JATAMANSI / जटामांसी — ★ NATURAL TRANQUILIZER
   → 250-500mg raat ko
   → Similar to Valerian — calming without drowsiness
   → Excellent for anxiety-insomnia combo
   → Brand: Baidyanath ₹150-250
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. SHANKHPUSHPI / शंखपुष्पी / શંખપુષ્પી
   → Syrup: 2 tsp 2 baar ya 500mg tablet
   → Medhya rasayan — brain nourisher
   → Anxiety, insomnia, memory — all
   → Brand: Dabur ₹80-130/200ml
   → TEEN safe — traditional children's tonic too
   → 🤰: ⚠️ Consult Vaidya

5. TAGARA / तगर (Indian Valerian)
   → 250-500mg raat ko — sleep + anxiety
   → Valerian equivalent — researched sedative
   → Brand: Himalaya ₹120-200
   → 🤰: ❌ AVOID

📦 FORMULATIONS:
6. SARASWATARISHTA — 15-20ml + paani, 2 baar
   → Brain tonic — anxiety + memory + focus
   → Brand: Dabur/Baidyanath ₹120-180/450ml
   → 🤰: ⚠️ Consult Vaidya

7. MANASAMITRA VATAKAM — 1-2 tab 2 baar
   → Classical formulation — severe anxiety/mental health
   → Brand: Kottakkal ₹250-400/100tab
   → 🤰: ❌ AVOID
   → ⚠️ ONLY under Vaidya supervision — potent

PRANAYAMA FOR ANXIETY:
→ Nadi Shodhana (Alternate Nostril) — 5 min daily
  (Most powerful anxiety-reducing pranayama)
→ Bhramari (Bee Breathing) — 3 min
  (Vibration calms vagus nerve instantly)
→ Ujjayi (Ocean Breath) — during yoga
→ Sheetali (Cooling Breath) — Pitta-type anxiety
→ ⚠️ Kapalbhati AVOID if anxiety/panic — too stimulating

⚠️ Severe anxiety disorder mein Ayurveda SUPPLEMENT hai,
REPLACEMENT nahi. Professional mental health support zaroori.`,
      modern: `💊 FOR MILD-MODERATE ANXIETY:

1. THERAPY FIRST — ★ GOLD STANDARD
   → CBT (Cognitive Behavioral Therapy) — most proven
   → Teaches: Thought patterns identify + change
   → 8-16 sessions typically — ₹500-3000/session
   → Online options available — more accessible
   → AS EFFECTIVE as medication for most anxiety
   → No side effects — skills last lifetime

💊 SUPPLEMENTS:

2. MAGNESIUM 200-400mg daily
   → Nervous system relaxant — research supported
   → Magnesium Glycinate — best for anxiety
   → 🤰: ✅ Safe
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. OMEGA-3 (EPA dominant) 1000-2000mg daily
   → Brain health — anti-inflammatory
   → 🤰: ✅ Safe

4. L-THEANINE 200mg (from green tea)
   → Alpha brain waves — calm focus
   → Found in green tea naturally
   → Brand: ₹400-700/60 caps
   → 🤰: ⚠️ Limited data — consult

5. PROBIOTICS — Gut-Brain Axis
   → Lactobacillus + Bifidobacterium strains
   → Research growing for anxiety reduction
   → 🤰: ✅ Safe

💊 PRESCRIPTION MEDICINES (Doctor Only):

6. SSRIs — FIRST LINE FOR ANXIETY DISORDERS
   → Escitalopram (Nexito) 5-20mg — ₹60-120/10tab
   → Sertraline (Daxid) 50-200mg — ₹40-80/10tab
   → Takes: 2-4 weeks to work fully
   → Duration: Usually 6-12 months minimum
   → 🤰: Sertraline = safest SSRI in pregnancy
     (Doctor decision — benefits vs risks)
   → SIDE EFFECTS: Nausea (first week), headache,
     sexual dysfunction, insomnia/drowsiness
   → ⚠️ NEVER stop suddenly — taper under doctor
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

7. BENZODIAZEPINES — SHORT TERM ONLY
   → Clonazepam (Clonafit) 0.25-0.5mg — ₹20-40
   → Alprazolam (Alprax) 0.25-0.5mg — ₹15-30
   → Fast acting — 15-30 min relief
   → ⚠️ ADDICTIVE — max 2-4 weeks use
   → 🤰: ❌ AVOID — birth defects + neonatal issues
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

8. BUSPIRONE 5-15mg
   → Non-addictive — better long-term option
   → Takes 2-4 weeks to work
   → 🤰: ⚠️ Category B — doctor decides
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

9. HYDROXYZINE 25mg
   → Antihistamine with anti-anxiety effect
   → Non-addictive — safe for occasional use
   → 🤰: ⚠️ Category C — doctor decides
   → Drowsiness — use at bedtime
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 POSTPARTUM/PERINATAL ANXIETY:
→ Therapy: CBT + support groups
→ Sertraline: Safest during breastfeeding
→ Breastfeeding compatible: Sertraline, Paroxetine
→ AVOID while breastfeeding: Benzodiazepines
→ ⚠️ Don't suffer silently — treatment available + safe`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Anxiety disorders are REAL medical conditions — not weakness.
Professional help is effective and available. If anxiety is
affecting daily life — therapist/psychiatrist se milo.
NutriMama emotional support de sakta hai but professional
treatment replace NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Suicidal thoughts — KIRAN helpline 1800-599-0019 (24/7, free)` },
      { severity: "RED", text: `Panic attack — feels like heart attack — 108 if unsure` },
      { severity: "RED", text: `Can't function — can't eat, sleep, work — urgent psychiatrist` },
      { severity: "RED", text: `Postpartum: Thoughts of harming self/baby — IMMEDIATE help` },
      { severity: "YELLOW", text: `Anxiety affecting daily life 2+ weeks — see doctor` },
      { severity: "YELLOW", text: `Using alcohol/substances to cope — seek help` },
    ],
    relatedIds: [12, 16, 17],
  },
  {
    id: 19,
    slug: "constipation",
    name: `Constipation`,
    nameHi: `कब्ज`,
    nameGu: `કબજિયાત`,
    emoji: "🌀",
    category: "GENERAL_HEALTH",
    summary: `Constipation is hard, infrequent, or difficult bowel movements. It is more common in women due to hormones, pregnancy, and slower transit. Fibre, water, movement, and routine usually resolve it without medication.`,
    whoGetsIt: ``,
    sections: {
      overview: `Bowel movement kam ya mushkil hona — hard stool, strain karna
padta hai, incomplete feeling. Medical: <3 bowel movements/week.
Women mein men se 2-3x zyada common. Pregnancy mein bahut common.

TYPES:
FUNCTIONAL: No structural problem — lifestyle/diet related
PREGNANCY: Progesterone slows gut + iron supplements + uterus pressure
MEDICATION-RELATED: Iron tabs, calcium, painkillers, antidepressants
IBS-C: Irritable Bowel Syndrome — constipation predominant
CHRONIC: 3+ months — needs investigation

CAUSES IN WOMEN:
→ LOW FIBRE DIET — #1 cause — processed food
→ LOW WATER — dehydration = hard stool
→ PREGNANCY — progesterone + iron + pressure (40% pregnant women)
→ HORMONAL — progesterone slows gut (PMS time bhi)
→ IRON SUPPLEMENTS — classic constipation cause
→ CALCIUM SUPPLEMENTS — especially carbonate form
→ SEDENTARY — movement = gut movement
→ STRESS — gut-brain connection
→ THYROID — hypothyroid = slow gut
→ HOLDING IT IN — ignoring urge = worse over time`,
      gharelu: `⚡ IMMEDIATE RELIEF:

1. GARAM PAANI — Subah Khali Pet
   → 1-2 glass garam/warm paani — uthte hi
   → Gastro-colic reflex stimulate — bowel movement trigger
   → Add nimbu + shahad — bonus
   → ✅ Safe — pregnancy bhi
   → MOST EFFECTIVE simple remedy

2. ISABGOL / PSYLLIUM HUSK (इसबगोल / ઈસબગોલ) — ★ BEST
   → 1-2 tsp isabgol — 1 glass garam doodh ya paani mein
   → Raat ko sone se pehle — subah clear
   → Bulk-forming — stool soft + volume badh jaata
   → RESEARCH: Most studied, most effective natural laxative
   → Brand: Sat Isabgol ₹50-100/100g
   → ✅ SAFE in pregnancy — #1 recommendation
   → ⚠️ PAANI ZYADA PIYO saath — warna worse ho sakta

3. TRIPHALA (त्रिफला / ત્રિફળા)
   → 1 tsp churna garam paani mein — raat ko sone se pehle
   → Amla + Haritaki + Bibhitaki — gentle laxative
   → Non-habit forming — safe long term
   → Brand: Any ₹50-100/100g
   → ✅ Mild + effective
   → ⚠️ Pregnancy: AVOID (mild uterine stimulant effect)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. ALSI / FLAXSEED (अलसी / અળસી)
   → 1-2 tbsp ground daily — dahi/smoothie/roti mein
   → Fibre + Omega-3 — stool soften + bulk
   → ✅ Safe including pregnancy

5. SHAHAD + NIMBU + GARAM PAANI (Morning)
   → 1 tsp shahad + 1/2 nimbu + 1 glass garam paani
   → Subah khali pet — daily routine banao
   → Gentle laxative + metabolism kickstart
   → ✅ Safe

6. PAPAYA (RIPE / PAKKA) — Natural Laxative
   → 1 bowl ripe papaya — subah ya snack
   → Papain enzyme — digestion improve
   → Fibre + water content
   → ✅ Safe — ⚠️ RAW papaya pregnancy mein AVOID

7. ANJEER / FIGS (अंजीर / અંજીર) — ★ TRADITIONAL
   → 3-4 anjeer raat ko paani ya doodh mein bhigao
   → Subah khaao + woh paani piyo
   → Fibre + natural sugars — gentle laxative
   → ✅ Safe in pregnancy — traditional remedy

8. KISHMISH / RAISINS (किशमिश / કિસમિસ)
   → 10-15 raisins raat ko paani mein bhigao
   → Subah khaao + paani piyo — khali pet
   → Fibre + tartaric acid — bowel stimulant
   → ✅ Safe in pregnancy

9. GHEE — 1 tsp garam doodh mein raat ko
   → Lubricant — stool passage smooth
   → Traditional Ayurvedic remedy
   → ✅ Safe — pregnancy mein bhi beneficial
   → ⚠️ GDM mein calories consider karo

10. PRUNE JUICE / DRIED PLUMS
    → 100-200ml juice daily ya 5-6 dried prunes
    → Sorbitol — natural osmotic laxative
    → RESEARCH: As effective as pharmaceutical laxatives
    → ✅ Safe in pregnancy
    → Available: Online stores ₹300-500

🥗 DIET — LONG TERM FIX:
→ FIBRE: 25-30g daily — gradually increase
  Vegetables, fruits, whole grains, dal, nuts, seeds
→ WATER: 2.5-3L daily minimum — fibre needs water
→ PROBIOTICS: Dahi, kanji, idli, dosa — gut bacteria
→ Regular meal times — gut develops rhythm
→ Don't ignore urge — jab lage tab jao
→ Morning routine: Garam paani → walk → toilet`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Constipation = "Vibandha" or "Malabaddhata" — Vata dushti.
Apana Vayu (downward energy) disturbed.
Agni mandya → improper digestion → dry, hard stool.
Treatment: Vata shamak + Agni deepan + Mrudu virechana (gentle purgation).

🌿 HERBS:

1. TRIPHALA — ★★★ KING OF CONSTIPATION REMEDIES
   → 1-2 tsp churna garam paani mein — raat ko
   → Gentle, non-habit forming, tridosha balance
   → Brand: Any reputed ₹50-100/100g
   → TEEN: 1/2-1 tsp | ADULT: 1-2 tsp
   → 🤰: ⚠️ AVOID — mild uterine effect
   → Duration: Safe long term — months/years
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. HARITAKI / HARAD (हरीतकी / હરડે) — "Remover of all diseases"
   → 1-2g churna garam paani mein — raat ko
   → Stronger than Triphala — specifically for constipation
   → Brand: Baidyanath ₹60-100/100g
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. CASTOR OIL / ERAND TEL (एरंड तेल / એરંડ તેલ)
   → 1-2 tsp garam doodh mein — raat ko (SOS only)
   → Strong purgative — works in 6-8 hours
   → ⚠️ NOT for regular use — occasional SOS
   → 🤰: ❌❌ AVOID — induces labor contractions
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. GHEE — Vata shamak
   → 1-2 tsp garam doodh mein daily
   → Lubricant + Agni support
   → ✅ Safe including pregnancy

📦 FORMULATIONS:
5. ABHAYARISHTA — 15-20ml + paani, after dinner
   → Haritaki-based — gentle laxative
   → Brand: Dabur/Baidyanath ₹100-150/450ml
   → 🤰: ⚠️ AVOID
6. AVIPATTIKAR CHURNA — 3-5g before food
   → Digestive + mild laxative
   → Brand: Baidyanath/Dabur ₹60-100/100g
   → 🤰: ⚠️ Consult Vaidya
7. GANDHARVA HARITAKI — 1-2 tab bedtime
   → Castor oil processed Haritaki — gentle
   → Brand: Kottakkal ₹120-200
   → 🤰: ❌ AVOID

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 FIRST LINE — BULK FORMING:

1. PSYLLIUM HUSK (ISABGOL) — OTC
   Brand: Sat Isabgol ₹50-100 | Metamucil ₹200-400
   → 1-2 tsp in water/milk — bedtime
   → 🤰: ✅ SAFEST laxative in pregnancy
   → Drink PLENTY water — otherwise blocks
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 OSMOTIC LAXATIVES:

2. LACTULOSE 10-20ml
   Brand: Duphalac (Abbott) ₹100-150/200ml | Looz ₹80-120
   → 15-30ml at bedtime — adjust to effect
   → Osmotic — draws water into stool → soft
   → 🤰: ✅ SAFE — commonly prescribed in pregnancy
   → Takes 24-48 hours for effect
   → SIDE EFFECTS: Gas, bloating (first few days)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. POLYETHYLENE GLYCOL (PEG/Miralax)
   Brand: Peglec ₹150-250 | Laxopeg ₹120-200 (sachets)
   → 1 sachet in water daily
   → 🤰: ✅ SAFE — Category C but widely used safely
   → Tasteless, odorless — easy to take
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 STOOL SOFTENERS:

4. DOCUSATE SODIUM 100mg
   Brand: Colace (imported) | Various generic
   → 100-200mg daily
   → Softens stool — less straining
   → 🤰: ✅ SAFE — minimal absorption
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 STIMULANT LAXATIVES (Short term only):

5. BISACODYL 5mg
   Brand: Dulcolax ₹15-25 (5 tab)
   → 5-10mg at bedtime — works in 6-12 hours
   → Short term ONLY — 3-5 days max
   → 🤰: ⚠️ Occasional okay — not regular
   → Habit-forming if used regularly
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

6. SENNA (Herbal Stimulant)
   Brand: Senokot ₹50-80
   → 1-2 tablets bedtime
   → 🤰: ⚠️ Occasional okay — not regular
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 FOR PREGNANCY CONSTIPATION SPECIFICALLY:
→ 1st: Diet + water + fibre (always try first)
→ 2nd: Isabgol / Psyllium husk ✅
→ 3rd: Lactulose ✅
→ 4th: PEG ✅
→ ❌ AVOID: Castor oil, strong stimulants

💊 IF IRON SUPPLEMENT CAUSING CONSTIPATION:
→ Switch to Ferrous Bisglycinate — less constipating
→ Ya Iron Polymaltose Complex (Mumfer) — better tolerated
→ Add Lactulose/Isabgol alongside
→ Take iron on alternate days — research says equally effective`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Chronic constipation (3+ months) needs
investigation — thyroid, medications, structural causes.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `No bowel movement 5+ days + vomiting + severe bloating` },
      { severity: "RED", text: `Blood in stool — bright red or black tarry` },
      { severity: "RED", text: `Severe abdominal pain + constipation — acute abdomen` },
      { severity: "RED", text: `Pregnancy + severe constipation + no relief — doctor` },
      { severity: "YELLOW", text: `Chronic constipation 3+ months — investigate` },
      { severity: "YELLOW", text: `New constipation after age 40 — screening (colon cancer rule out)` },
      { severity: "YELLOW", text: `Alternating constipation + diarrhea — IBS assessment` },
    ],
    relatedIds: [13, 5, 16],
  },
  {
    id: 20,
    slug: "skin-issues",
    name: `Skin Issues`,
    nameHi: `मुँहासे और रंग बदलना`,
    nameGu: `ખીલ અને રંગ બદલાવો`,
    emoji: "✨",
    category: "GENERAL_HEALTH",
    summary: `Skin issues in women — acne, melasma, dryness, pigmentation — are often hormonal and tied to cycles, pregnancy, or PCOS. Gentle skincare, sun protection, and addressing internal causes are more effective than aggressive treatments.`,
    whoGetsIt: ``,
    sections: {
      overview: `ACNE (मुँहासे / ખીલ):
Skin pores block ho jaate hain — oil (sebum) + dead skin + bacteria
= inflammation = pimples. Hormonal hai primarily — androgens
sebum badhate hain. Women mein: PCOS, periods, pregnancy,
stress sab trigger karte hain.

PIGMENTATION (Hyperpigmentation):
Skin mein melanin zyada ban jaata hai — dark patches/spots.
Women mein: Melasma (pregnancy mask), post-acne dark marks,
dark circles, underarms/neck darkening.

TYPES OF ACNE:
→ Comedonal: Blackheads + whiteheads — mild
→ Inflammatory: Red, painful pimples — moderate
→ Cystic: Deep, painful, large — severe
→ Hormonal: Jawline, chin, lower face — cyclical with periods

TYPES OF PIGMENTATION:
→ MELASMA: Brown patches — cheeks, forehead, upper lip
  (Pregnancy, OCP, sun exposure)
→ POST-INFLAMMATORY: Dark marks after pimple heals
→ ACANTHOSIS NIGRICANS: Dark velvety — neck, armpits
  (Insulin resistance, PCOS, obesity)
→ PERIORBITAL: Dark circles — genetics, sleep, anaemia

CAUSES IN WOMEN:
→ HORMONAL: Androgens (PCOS), estrogen fluctuation
→ MENSTRUAL: Pre-period breakouts — progesterone rise
→ PREGNANCY: Melasma (50-70%), acne changes
→ STRESS: Cortisol → sebum → acne
→ DIET: Sugar, dairy, processed food → inflammation
→ SUN EXPOSURE: #1 cause of pigmentation in India
→ INSULIN RESISTANCE: PCOS → acne + dark patches
→ MEDICATIONS: Steroids, some contraceptives`,
      gharelu: `FOR ACNE:

1. HALDI + SHAHAD FACE MASK (Turmeric + Honey)
   → 1/2 tsp haldi + 1 tsp shahad — mix
   → Apply — 15-20 min — wash
   → Anti-bacterial + anti-inflammatory
   → Curcumin = proven against acne bacteria
   → ✅ Safe — pregnancy bhi
   → ⚠️ Haldi stain karta hai — kam lagao, achhe se dhoo

2. NEEM PASTE / NEEM WATER
   → Neem leaves grind → paste → face pe
   → Ya neem water face wash
   → Anti-bacterial + anti-fungal — strongest natural
   → ✅ Safe externally — pregnancy bhi

3. ALOE VERA GEL — FRESH
   → Fresh aloe gel — face pe directly
   → Soothing + healing + mild antibacterial
   → Post-acne marks bhi lighten karta hai
   → ✅ Safe — gentle enough for daily use

4. TEA TREE OIL — ★ RESEARCH PROVEN
   → 1-2 drops tea tree oil + 10 drops coconut oil (dilute!)
   → Apply on pimple directly — cotton bud se
   → RESEARCH: 5% tea tree oil = equivalent to benzoyl peroxide
     for mild-moderate acne (less side effects)
   → ⚠️ NEVER apply undiluted — skin burn
   → ⚠️ Pregnancy: Small topical amounts generally okay
   → Brand: Tea tree oil ₹200-400/15ml

5. MULTANI MITTI / FULLER'S EARTH (मुल्तानी मिट्टी / મુલતાની માટી)
   → 2 tsp multani mitti + rose water → paste
   → Apply — 15-20 min — jab sukh jaye → wash
   → Absorbs excess oil + tightens pores
   → ✅ Safe — traditional Indian remedy
   → ⚠️ Dry skin pe zyada mat lagao — drying hai

FOR PIGMENTATION:

6. NIMBU + SHAHAD (Lemon + Honey)
   → Few drops nimbu + 1 tsp shahad — mix
   → Apply on dark patches — 15 min — wash
   → Vitamin C — melanin production slow
   → ⚠️ Nimbu ke baad SUNSCREEN ZAROOR — photosensitive
   → ⚠️ Sensitive skin pe patch test pehle

7. AMLA (Indian Gooseberry) — ★ VITAMIN C POWERHOUSE
   → Amla juice — face pe cotton se lagao
   → Ya amla powder + shahad mask
   → Highest natural Vitamin C — melanin inhibitor
   → ✅ Safe — pregnancy bhi

8. KESAR + DOODH (Saffron + Milk / केसर / કેસર)
   → 2-3 kesar strands + 2 tbsp raw milk
   → Soak 2 hours → apply face pe — 20 min
   → Traditional Indian complexion remedy
   → Anti-oxidant + skin brightening
   → ✅ Safe in pregnancy — used traditionally
   → Brand: Real kesar ₹300-500/1g (small amount enough)

9. PAPAYA FACE MASK
   → Ripe papaya mash → face pe — 20 min
   → Papain enzyme — natural exfoliant
   → Dead skin remove — pigmentation fade
   → ✅ Safe externally — ⚠️ Eating raw papaya: pregnancy avoid

10. POTATO SLICE / JUICE
    → Raw potato thin slice — dark patches pe
    → Ya potato juice cotton se — 15 min
    → Catecholase enzyme — mild bleaching effect
    → ✅ Very safe — gentle — daily use okay

SUNSCREEN — #1 ANTI-PIGMENTATION:
→ SPF 30-50 — DAILY — even indoor/cloudy
→ Reapply every 2-3 hours in sun
→ Physical (zinc oxide/titanium dioxide) — pregnancy safe
→ This SINGLE step > all remedies combined for pigmentation
→ Brand: Neutrogena ₹200-400 | La Shield ₹200-350`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Acne = "Yuvaan Pidika" or "Mukha Dooshika"
→ Pitta + Rakta dushti — blood impurity + heat
Pigmentation = "Vyanga" (facial spots)
→ Pitta + Bhrajaka Pitta (skin Pitta) dushti

🌿 HERBS:

1. KUMKUMADI TAILAM — ★★★ PREMIUM AYURVEDIC SKIN OIL
   → 3-4 drops face pe — raat ko sone se pehle
   → Kesar (saffron) based — 16 herbs
   → Acne scars + pigmentation + glow — all-in-one
   → Brand: Kottakkal ₹400-600/10ml | Forest Essentials ₹1500+
   → ✅ Safe externally — pregnancy bhi
   → Results: 4-8 weeks regular use

2. MANJISTHA / मंजिष्ठा / મંજીઠ (Rubia Cordifolia) — ★ BLOOD PURIFIER
   → 500mg tablet 2 baar ya 3-5g churna
   → #1 Ayurvedic blood purifier — acne root cause
   → Pigmentation reduce — skin glow
   → Brand: Himalaya ₹150-250 | Baidyanath ₹80-130
   → TEEN: 250-500mg | ADULT: 500mg-1g
   → 🤰: ⚠️ AVOID (blood thinning)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. SARIVA / ANANTMOOL (Hemidesmus Indicus)
   → 3-5g churna ya 500mg tablet 2 baar
   → Blood purifier + cooling — Pitta shamak
   → Brand: Baidyanath ₹80-130
   → 🤰: ⚠️ Consult Vaidya
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. KHADIRA / KHAIR (Acacia Catechu)
   → 3-5g churna ya Khadirarishta 15-20ml
   → Skin diseases specialist — classical
   → Brand: Baidyanath ₹100-150
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. NEEM / नीम / લીમડો — Internal
   → Neem tablet: 500mg 2 baar
   → Blood purifier + anti-microbial
   → Brand: Himalaya Neem ₹120-200
   → 🤰: ❌ AVOID internal — uterine effect
   → ✅ External safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
6. MAHAMANJISTHADI KASHAYAM — 15ml + paani, 2 baar before food
   → Blood purifier — chronic skin problems
   → Brand: Kottakkal ₹150-250/200ml
   → 🤰: ❌ AVOID
7. KAISHORE GUGGULU — 2 tab 2 baar
   → Anti-inflammatory + blood purifier
   → Brand: Baidyanath ₹80-130/80tab
   → 🤰: ❌ AVOID (Guggulu)
8. AROGYAVARDHINI VATI — 2 tab 2 baar
   → Liver + skin + metabolism
   → Brand: Baidyanath ₹80-130/40tab
   → 🤰: ❌ AVOID
9. SARIVADYASAVA — 15-20ml + paani, 2 baar
   → Blood purifier — skin disorders
   → Brand: Dabur ₹120-170/450ml
   → 🤰: ⚠️ Consult Vaidya

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

AYURVEDIC SKIN CARE:
→ Ubtan: Chana besan + haldi + doodh — traditional face wash
→ Nalpamaradi Keram — skin brightening oil (Kottakkal)
→ Eladi Keram — pigmentation treatment oil
→ Kumkumadi — nightly ritual for glow`,
      modern: `💊 FOR ACNE:

MILD ACNE (Blackheads, occasional pimple):

1. BENZOYL PEROXIDE 2.5-5% — ★ OTC FIRST LINE
   Brand: Benzac ₹150-250 | Persol ₹100-180
   → Apply thin layer — affected area — bedtime
   → Start 2.5% — increase if tolerated
   → Kills acne bacteria + unblocks pores
   → 🤰: ✅ SAFE — Category C but widely used safely
   → SIDE EFFECTS: Dryness, peeling, redness (first 2 weeks)
   → ⚠️ Bleaches clothes/pillow — use white towel
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. ADAPALENE 0.1% GEL (Retinoid) — ★ OTC
   Brand: Differin (Galderma) ₹200-350 | Adaferin ₹150-250
   → Apply pea-size — full face — bedtime
   → Unblocks pores + reduces inflammation + anti-aging
   → Takes: 8-12 weeks for full results
   → 🤰: ❌❌ AVOID — RETINOID = birth defects
   → SIDE EFFECTS: Dryness, peeling, purging (first month)
   → ⚠️ SUNSCREEN mandatory next day — photosensitive
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

MODERATE ACNE:

3. CLINDAMYCIN 1% GEL + BENZOYL PEROXIDE
   Brand: Duac ₹200-350 | Clinbenz ₹150-250
   → Antibiotic + BP combo — bedtime
   → More effective than either alone
   → 🤰: ⚠️ Clindamycin topical — limited data, doctor decides
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. AZELAIC ACID 15-20% — ★ PREGNANCY SAFE OPTION
   Brand: Aziderm (Micro Labs) ₹200-350
   → Cream/gel — apply 2 times daily
   → Anti-bacterial + anti-inflammatory + pigmentation reduce
   → 🤰: ✅ SAFE — Category B — BEST option in pregnancy
   → SIDE EFFECTS: Mild tingling/burning initially
   → Also helps with post-acne dark marks — dual benefit
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

SEVERE/CYSTIC:

5. ORAL ANTIBIOTICS — Doctor prescribed
   → Doxycycline 100mg ₹20-40/10tab — 6-12 weeks
   → Azithromycin 500mg — pulse therapy
   → 🤰: Doxycycline ❌ AVOID | Azithromycin ⚠️ consult
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

6. ISOTRETINOIN (Accutane) — LAST RESORT
   Brand: Tretiva ₹200-400 | Isotroin ₹150-300
   → 0.5-1mg/kg/day — 4-6 months
   → Most effective acne medicine — 85% cure
   → 🤰: ❌❌❌ ABSOLUTELY AVOID — MOST TERATOGENIC drug
     Pregnancy test mandatory before, during, 1 month after
   → SIDE EFFECTS: Dry lips/skin, joint pain, mood changes,
     liver check needed, cholesterol check
   → ⚠️ Dermatologist prescribed ONLY
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

7. HORMONAL (For PCOS acne):
   → OCP — Yasmin/Diane-35 — anti-androgen
   → Spironolactone 25-100mg — anti-androgen
   → Both: 🤰 ❌ AVOID
   → Details: See CONDITION #3 (PCOS)

💊 FOR PIGMENTATION:

8. VITAMIN C SERUM 10-20% — ★ GOLD STANDARD
   Brand: Cipla VC15 ₹600-800 | Deconstruct ₹500-700
   → Apply morning — under sunscreen
   → Tyrosinase inhibitor — melanin production block
   → Antioxidant — photoprotection
   → 🤰: ✅ SAFE — topical Vitamin C
   → Results: 8-12 weeks

9. AZELAIC ACID 15-20% — (Also for acne — dual benefit)
   → Same as above — anti-pigmentation too
   → 🤰: ✅ SAFE

10. NIACINAMIDE 5-10% SERUM
    Brand: Minimalist ₹300-500 | Deconstruct ₹400-600
    → Apply 2 times daily
    → Melanin transfer block — brightening
    → Anti-inflammatory — redness reduce
    → 🤰: ✅ SAFE
    → Pairs well with Vitamin C

11. ALPHA ARBUTIN 2% SERUM
    → Melanin inhibitor — gentle
    → Brand: Minimalist ₹400-600
    → 🤰: ✅ Generally safe topical

12. SUNSCREEN SPF 50 — ★ #1 MOST IMPORTANT
    → WITHOUT THIS: All other treatments = useless
    → Physical: Zinc oxide preferred in pregnancy
    → Apply: 2 finger-lengths, reapply every 2-3 hours
    → Brand: La Shield ₹200-350 | UV Doux ₹300-450
    → 🤰: ✅ ESSENTIAL

❌ AVOID IN PREGNANCY:
→ ❌ Retinoids (Adapalene, Tretinoin, Isotretinoin) — birth defects
→ ❌ Hydroquinone — systemic absorption concerns
→ ❌ Salicylic acid (high concentration) — low conc okay
→ ❌ Chemical peels (most) — consult dermatologist

💊 DERMATOLOGIST PROCEDURES:
→ Chemical Peels: Glycolic, Salicylic, Lactic — ₹1000-3000/session
→ Microneedling/Dermaroller — acne scars — ₹2000-5000
→ Laser: Q-switched Nd:YAG — pigmentation — ₹2000-5000
→ LED Light Therapy — anti-acne — ₹1000-2000
→ 🤰: Most procedures AVOID — post-delivery better`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Skin treatments need patience — 8-12 weeks minimum.
Don't use multiple actives simultaneously — irritation.
Start ONE product, wait 2 weeks, add another.
SUNSCREEN daily = 50% of anti-pigmentation treatment.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Severe allergic reaction to skin product — swelling, hives` },
      { severity: "RED", text: `Cystic acne + fever — infected — needs antibiotics` },
      { severity: "YELLOW", text: `Sudden pigmentation + weight gain + irregular periods — PCOS check` },
      { severity: "YELLOW", text: `New mole changing size/shape/color — skin cancer screening` },
      { severity: "YELLOW", text: `Acne not responding to 3 months treatment — dermatologist` },
    ],
    relatedIds: [3, 15, 16, 12],
  },
  {
    id: 21,
    slug: "weight-management",
    name: `Weight Management`,
    nameHi: `वजन प्रबंधन`,
    nameGu: `વજન વ્યવસ્થાપન`,
    emoji: "⚖️",
    category: "GENERAL_HEALTH",
    summary: `Weight management for women is influenced by hormones, metabolism, and life stage (PCOS, postpartum, menopause). Sustainable changes — balanced diet, strength training, sleep — work better than crash diets.`,
    whoGetsIt: ``,
    sections: {
      overview: `Healthy weight maintain karna — underweight, overweight, ya obesity
sab women ki health pe directly affect karta hai. Periods, fertility,
pregnancy, PCOS, diabetes, heart disease — sab weight se connected.

BMI CATEGORIES (Indian Standards — lower thresholds):
→ Underweight: <18.5 — periods stop, fertility issues, bone loss
→ Normal: 18.5-22.9 — optimal health
→ Overweight: 23-24.9 — risk increasing
→ Obese: ≥25 — significant health risks
(Note: Indian/Asian BMI cutoffs are LOWER than Western)

WHY WOMEN STRUGGLE MORE:
→ HORMONAL: Estrogen promotes fat storage (hips, thighs)
→ PCOS: Insulin resistance = weight gain + hard to lose
→ THYROID: Hypothyroid = metabolism slow = gain
→ PREGNANCY: Weight gain + post-delivery retention
→ MENOPAUSE: Metabolism drops + belly fat increases
→ EMOTIONAL EATING: Stress, PMS, depression → food comfort
→ CRASH DIETING: Yo-yo effect → metabolism damage
→ MEDICATIONS: Contraceptives, steroids, antidepressants

HEALTHY WEIGHT GAIN IN PREGNANCY:
→ Underweight (BMI<18.5): 12.5-18 kg total
→ Normal (BMI 18.5-24.9): 11.5-16 kg
→ Overweight (BMI 25-29.9): 7-11.5 kg
→ Obese (BMI≥30): 5-9 kg

POST-PREGNANCY WEIGHT LOSS:
→ Expect: 5-6 kg immediately (baby + fluids)
→ Remaining: 6-12 months gradual loss realistic
→ Breastfeeding: Burns 300-500 extra calories/day
→ ⚠️ No crash dieting while breastfeeding`,
      gharelu: `🥗 WEIGHT LOSS — INDIAN DIET APPROACH:

1. JEERA WATER — ★ METABOLISM BOOSTER
   Hindi: जीरा पानी | Gujarati: જીરાનું પાણી
   → 1 tsp jeera — 1 glass paani mein ubalo 5 min
   → Subah khali pet garam piyo — daily
   → RESEARCH: Cumin significantly reduces body weight,
     BMI, waist circumference (Iranian RCT, 2015)
   → Thermogenic — metabolism boost
   → ✅ Safe — pregnancy bhi

2. METHI DANA WATER (Fenugreek)
   → 1 tsp methi raat ko paani mein bhigao
   → Subah khali pet piyo + dana chabao
   → Appetite suppress + insulin sensitivity
   → Fibre = satiety — kam khaoge
   → ✅ Safe — ⚠️ Pregnancy excess avoid

3. DALCHINI + SHAHAD (Cinnamon + Honey)
   → 1/2 tsp dalchini + 1 tsp shahad + garam paani
   → Subah khali pet — daily
   → Blood sugar stable — cravings kam
   → ✅ Safe

4. AJWAIN WATER (Carom Seeds)
   → 1 tsp ajwain garam paani mein — subah
   → Metabolism boost + digestive fire
   → Bloating reduce — flat stomach feel
   → ✅ Safe

5. NIMBU + SHAHAD + GARAM PAANI (Morning Detox)
   → 1 nimbu + 1 tsp shahad + warm water
   → Subah sabse pehle — daily ritual
   → Metabolism kickstart + Vitamin C
   → ✅ Safe in pregnancy

6. GREEN TEA — 2-3 cups daily
   → Catechins — fat oxidation increase
   → RESEARCH: Modest but significant weight loss
   → Between meals — not with food (iron absorption block)
   → ✅ Safe — ⚠️ Pregnancy: 1-2 cups max (caffeine)

7. APPLE CIDER VINEGAR (ACV)
   → 1-2 tsp diluted in water — before meals
   → Appetite suppress + blood sugar control
   → ⚠️ Always dilute — enamel damage risk
   → ⚠️ Pregnancy: Limited data — small amounts okay

INDIAN WEIGHT LOSS DIET PLAN:

WHAT TO EAT:
→ PROTEIN every meal: Dal, chana, paneer, eggs, chicken, fish
  (Protein = satiety + muscle preservation + metabolism)
→ FIBRE: Vegetables unlimited, whole grains, fruits
  (Fibre = full feeling + slow digestion)
→ HEALTHY FATS: Ghee (1-2 tsp), nuts, seeds, coconut
  (Fat = hormones + satisfaction + no cravings)
→ COMPLEX CARBS: Jowar, bajra, ragi, oats, brown rice
  (Steady energy — no crash)
→ INDIAN SUPERFOODS: Ragi, bajra, nachni, sattu, buttermilk

WHAT TO AVOID:
→ SUGAR: #1 enemy — mithai, cold drinks, biscuits
→ MAIDA: Naan, bread, pasta, maggi, bakery items
→ FRIED: Pakora, samosa, chips — empty calories
→ PROCESSED: Packaged snacks, ready-to-eat meals
→ LIQUID CALORIES: Juice, chai with sugar (3-4 times), soda
→ EXCESS RICE: Limit to 1 small katori — not unlimited

SAMPLE WEIGHT LOSS MEAL PLAN (1400-1600 cal):
06:30 — Jeera water / Methi water
07:30 — Breakfast: 1 moong dal chilla + chutney + 1 egg
10:30 — Snack: 10 almonds + 1 fruit (apple/pear)
01:00 — Lunch: 1 jowar roti + dal + sabzi + salad + buttermilk
04:00 — Snack: Roasted chana 1 mutthi + green tea
07:00 — Dinner: 1 roti + paneer/chicken sabzi + salad
09:00 — Bedtime: Haldi doodh (no sugar)

🏃 EXERCISE — NON-NEGOTIABLE:
→ MINIMUM: 150 min moderate/week (30 min × 5 days)
→ BEST COMBO: Cardio + Strength training
  - Walking/jogging: 20-30 min (cardio — fat burn)
  - Strength: Body weight/resistance bands (muscle = metabolism)
  - Yoga: Surya Namaskar (12 rounds = full body workout)
→ NEAT: Non-Exercise Activity — stairs, standing, walking
  (NEAT burns 200-500 extra cal/day — very underrated)
→ POST-PREGNANCY: Start gentle — walking first
  → Doctor clearance at 6-week checkup
  → Breastfeeding: Extra 300 cal needed — don't cut too much`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Obesity = "Sthaulya" or "Medoroga" — Kapha + Meda dhatu excess.
Agni mandya → improper metabolism → fat accumulation.
Treatment: Agni deepan + Kapha shamak + Meda dhatu lekhana (scraping).

🌿 HERBS:

1. TRIPHALA — ★ METABOLISM + DETOX
   → 1-2 tsp raat ko garam paani mein
   → Digestive fire boost + gentle detox
   → RESEARCH: Reduces body weight + BMI in clinical studies
   → Brand: Any ₹50-100/100g
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. GUGGULU / गुग्गुलु / ગુગ્ગુળ — ★ FAT METABOLISM
   → Medohar Guggulu: 2 tab 2 baar garam paani se
   → Lipid metabolism — cholesterol + weight
   → Thyroid function support (bonus)
   → Brand: Baidyanath ₹100-160/80tab
   → 🤰: ❌ AVOID
   → ⚠️ Blood thinners ke saath caution
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. VIDANGA / विडंग / વિડંગ (Embelia Ribes)
   → Classical Medohar (fat-scraping) herb
   → 1-3g churna shahad ke saath
   → Brand: Baidyanath ₹80-130
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. GARCINIA / VRIKSHAMLA (Garcinia Cambogia)
   → 500mg before meals — 2 baar
   → HCA — appetite suppress + fat storage block
   → Research: Modest evidence — mixed results
   → Brand: Himalaya Ayurslim ₹200-350
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. ASHWAGANDHA — Stress-related weight
   → Cortisol reduce → belly fat reduce
   → Details in Condition #18
   → 🤰: ❌ AVOID

📦 FORMULATIONS:
6. MEDOHAR GUGGULU — 2 tab 2-3 baar — primary weight formula
7. NAVAKA GUGGULU — 2 tab 2 baar — classical weight management
8. TRIPHALA GUGGULU — 2 tab 2 baar — detox + weight
   All: Brand Baidyanath ₹80-160 | 🤰: ❌ AVOID
   ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

AYURVEDIC WEIGHT LOSS PRINCIPLES:
→ Eat largest meal at LUNCH (Agni strongest)
→ Dinner light — before sunset ideally
→ Warm water throughout day — never cold
→ Udvartana: Dry powder massage — Kapha reduce + circulation
→ Langhana: Periodic light fasting — Agni strengthen`,
      modern: `💊 FIRST LINE — ALWAYS LIFESTYLE:
→ Diet modification + Exercise = 5-10% weight loss
→ This alone can: Fix periods, improve PCOS, prevent diabetes
→ Even 5% loss = significant health improvement

💊 PRESCRIPTION (BMI>30 or BMI>27 with comorbidity):

1. ORLISTAT 60-120mg
   Brand: Obelit (Intas) ₹200-350 | Xenical ₹400-600
   → 120mg with each major meal (3 times daily)
   → Blocks 30% dietary fat absorption
   → 🤰: ❌ AVOID — nutrient absorption block
   → SIDE EFFECTS: Oily stool, gas, urgency, staining
   → ⚠️ Very unpleasant GI effects — motivates low-fat eating!
   → Multivitamin separately — 2 hr gap
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. METFORMIN — Off-label for PCOS weight
   → 500-2000mg daily — insulin resistance fix
   → Details in Condition #3 + #9
   → 🤰: ⚠️ Doctor decides
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. LIRAGLUTIDE (Saxenda) 3mg — GLP-1 agonist
   Brand: Saxenda ₹8000-12000/pen (expensive)
   → Daily injection — appetite reduce + satiety
   → Very effective — 8-12% weight loss
   → 🤰: ❌ AVOID — stop 2 months before conception
   → SIDE EFFECTS: Nausea, diarrhea (settles)
   → ⚠️ Endocrinologist prescribed only

4. SEMAGLUTIDE (Wegovy/Ozempic)
   → Weekly injection — newest, most effective
   → 15-17% weight loss average
   → Limited availability in India currently
   → Very expensive — ₹10,000+/month
   → 🤰: ❌ AVOID
   → ⚠️ Specialist prescribed only

5. BARIATRIC SURGERY — BMI>35 or BMI>32.5 with comorbidities
   → Sleeve gastrectomy, Gastric bypass
   → Most effective — 30-40% weight loss
   → For severe obesity when everything else failed
   → Pregnancy: Wait 12-18 months after surgery

💊 SUPPLEMENTS:
→ Protein powder (Whey/Plant) — if diet protein insufficient
→ Omega-3 — anti-inflammatory
→ Vitamin D — if deficient (affects metabolism)
→ Probiotics — gut health → weight management
→ ⚠️ "Fat burner" supplements — AVOID — mostly useless/unsafe

💊 FOR UNDERWEIGHT:
→ Calorie surplus: 300-500 cal above maintenance
→ Protein: 1.2-1.5g per kg body weight
→ Strength training: Muscle building
→ Shatavari + Ashwagandha: Appetite + mass building
→ Investigate: Thyroid, celiac, malabsorption
→ 🤰: Underweight + pregnancy = higher risk — doctor monitor`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Crash diets are DANGEROUS — especially for women (periods stop,
bone loss, hair fall, fertility issues). Sustainable changes >
quick fixes. Weight loss medicines have significant side effects.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Eating disorder signs — not eating, purging, extreme exercise` },
      { severity: "RED", text: `Rapid unexplained weight loss — cancer/thyroid/diabetes screen` },
      { severity: "RED", text: `BMI<16 — severe underweight — medical management` },
      { severity: "YELLOW", text: `Weight gain + irregular periods + acne — PCOS check` },
      { severity: "YELLOW", text: `Weight gain + fatigue + hair fall — Thyroid check` },
      { severity: "YELLOW", text: `Pregnancy weight gain too fast/too slow — OB-GYN` },
    ],
    relatedIds: [3, 16, 9, 18],
  },
  {
    id: 22,
    slug: "sleep-disorders",
    name: `Sleep Disorders`,
    nameHi: `नींद न आना`,
    nameGu: `ઊંઘ ન આવવી`,
    emoji: "😴",
    category: "MENTAL_HEALTH",
    summary: `Sleep disorders affect women more than men, often tied to hormonal changes, anxiety, and caregiving load. Insomnia, broken sleep, and early waking all benefit from sleep hygiene before considering medication.`,
    whoGetsIt: ``,
    sections: {
      overview: `Neend aane mein difficulty, raat mein baar baar uthna, ya
subah jaldi uth jaana (aur phir neend na aana). Women mein
men se 40% zyada common — hormones directly sleep affect karte.

TYPES:
→ ONSET: Sone mein 30+ min lag rahe — neend nahi aa rahi
→ MAINTENANCE: Beech raat uthna — 2-3 baar — phir neend nahi
→ EARLY WAKING: 3-4 baje uth jaana — phir so nahi paate
→ CHRONIC: 3+ months, 3+ nights/week — insomnia disorder

WOMEN-SPECIFIC CAUSES:
→ PMS: Progesterone fluctuation = sleep disruption
→ PREGNANCY: Discomfort, frequent urination, anxiety, heartburn
→ POSTPARTUM: Baby feeding schedules, hormonal crash
→ PERIMENOPAUSE: Hot flashes, night sweats interrupt sleep
→ MENOPAUSE: Estrogen drop = melatonin affected
→ ANXIETY/DEPRESSION: Racing thoughts, early waking
→ THYROID: Hyper = insomnia, Hypo = excessive sleep
→ IRON DEFICIENCY: Restless leg syndrome → can't sleep
→ STRESS: Cortisol high at night = brain won't shut off`,
      gharelu: `🌙 BEDTIME DRINKS:

1. GARAM DOODH + JAIPHAL (Warm Milk + Nutmeg / जायफल / જાયફળ) — ★
   → 1 glass garam doodh + chutki jaiphal powder + chutki kesar
   → Sone se 30 min pehle
   → Tryptophan (milk) → serotonin → melatonin
   → Jaiphal = mild natural sedative — traditional remedy
   → ✅ Safe — ⚠️ Pregnancy: Jaiphal very small amount only
   → ⚠️ Jaiphal excess = toxic — always CHUTKI only

2. CHAMOMILE TEA — ★ RESEARCH PROVEN
   → 1 cup sone se 1 hour pehle
   → Apigenin = binds GABA receptors = calm + sleepy
   → RESEARCH: Significantly improves sleep quality (RCT)
   → Brand: Various ₹150-300/25 bags
   → ✅ Safe — ⚠️ Pregnancy: 1 cup okay

3. ASHWAGANDHA DOODH
   → 1/2 tsp ashwagandha + garam doodh — bedtime
   → RESEARCH: Triethylene glycol in ashwagandha induces sleep
   → Cortisol reduce + GABA support
   → ⚠️ Pregnancy: AVOID

4. KESAR DOODH (Saffron Milk / केसर / કેસર)
   → 2-3 kesar strands + garam doodh
   → Traditional sleep tonic — mood + sleep dual
   → Crocin compound = serotonin support
   → ✅ Safe in pregnancy — traditional

5. BANANA + BADAM SHAKE
   → 1 banana + 5 soaked badam + doodh — blend
   → Tryptophan + Magnesium + Melatonin (banana)
   → ✅ Safe

🛏️ SLEEP HYGIENE — MOST IMPORTANT:
→ SAME TIME: Sona + uthna daily same time — even weekends
→ DARK ROOM: Complete darkness — blackout curtains
→ COOL ROOM: 18-22°C ideal — AC/fan
→ NO SCREENS: Phone/laptop band 1 hour before bed
  (Blue light = melatonin production BLOCK)
→ NO CAFFEINE: After 2 PM — half-life 6 hours
→ NO HEAVY DINNER: 3 hours before bed
→ ROUTINE: Bath → warm milk → reading → sleep
→ BED = SLEEP ONLY: Don't work/eat/watch in bed
→ EXERCISE: Morning/afternoon — not within 3 hours of bed
→ JOURNALING: Write worries before bed — brain dump

RELAXATION TECHNIQUES:
→ 4-7-8 Breathing — same as Condition #18
→ Body Scan Meditation — YouTube guided (free)
→ Progressive Muscle Relaxation — feet to head
→ Lavender oil on pillow — 2 drops
→ Warm bath — 30 min before bed — body temp drop = sleep signal`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Insomnia = "Anidra" or "Nidranasha" — Vata dushti primary.
Prana Vayu + Tarpak Kapha imbalance.
Also Pitta involvement — heat, restlessness.

🌿 HERBS:

1. ASHWAGANDHA — ★★★ BEST SLEEP HERB
   → 500mg-1g doodh mein — bedtime
   → RESEARCH: Significantly improves sleep quality + onset
   → Stress reduce + GABAergic action
   → Brand: KSM-66 ₹400-600
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. JATAMANSI / जटामांसी — ★★ NATURAL SLEEP AID
   → 250-500mg raat ko — tablet ya churna
   → Indian Valerian equivalent — GABA support
   → Non-addictive — safe for regular use
   → Brand: Baidyanath ₹150-250
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. TAGARA / तगर / તગર (Indian Valerian)
   → 250-500mg bedtime
   → Sedative — promotes deep sleep
   → RESEARCH: Valerian root improves sleep quality
   → Brand: Himalaya ₹120-200
   → 🤰: ❌ AVOID

4. BRAHMI — 500mg bedtime
   → Calming — racing thoughts slow
   → Mind settle + deep sleep
   → Brand: Himalaya ₹150-250
   → 🤰: ⚠️ Consult Vaidya

5. SHANKHPUSHPI — 2 tsp syrup bedtime
   → Brain tonic — anxiety + insomnia both
   → Brand: Dabur ₹80-130/200ml
   → 🤰: ⚠️ Consult Vaidya

📦 FORMULATIONS:
6. SARASWATARISHTA — 15-20ml + paani — bedtime
   → Brain calm + sleep support
   → Brand: Dabur/Baidyanath ₹120-180/450ml
7. MANASAMITRA VATAKAM — 1-2 tab — severe insomnia
   → Brand: Kottakkal ₹250-400
   → 🤰: ❌ AVOID | ⚠️ Vaidya supervised ONLY

AYURVEDIC SLEEP ROUTINE:
→ Abhyanga (oil massage) — Bala tail ya til tel before bath
→ Pada Abhyanga — foot massage with ghee — bedtime
→ Shirodhara — warm oil stream on forehead (clinic therapy)
→ Nasya — Anu tail 2 drops each nostril — morning

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 SUPPLEMENTS — FIRST TRY:

1. MELATONIN 0.5-3mg — ★ NATURAL SLEEP HORMONE
   Brand: Various ₹300-600/60 tab (mostly imported)
   → 0.5-3mg — 30-60 min before bed
   → Start LOW — 0.5mg — increase if needed
   → Jet lag, shift work, sleep onset problems
   → NOT habit-forming — safe short-medium term
   → 🤰: ⚠️ Limited data — avoid or low dose only
   → SIDE EFFECTS: Rare — headache, drowsiness next day
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. MAGNESIUM 200-400mg — Bedtime
   → Muscle relax + GABA support = sleep
   → Glycinate form = best for sleep
   → 🤰: ✅ Safe
   → Also helps: Cramps, anxiety, constipation

3. L-THEANINE 200mg — Bedtime
   → From green tea — calm without drowsy
   → Alpha brain waves — relaxed state
   → 🤰: ⚠️ Limited data

💊 PRESCRIPTION (Doctor Only — Chronic Insomnia):

4. ZOLPIDEM 5-10mg (Ambien equivalent)
   Brand: Zolfresh ₹40-70 | Stilnox ₹80-120
   → 5mg (women) at bedtime — immediately before sleep
   → Short-acting — sleep onset help
   → ⚠️ Women need LOWER dose than men (FDA recommendation)
   → Max: 2-4 weeks use — dependency risk
   → 🤰: ❌ AVOID
   → SIDE EFFECTS: Drowsiness next day, sleepwalking (rare), amnesia
   → ⚠️ ADDICTIVE — short term only
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. TRAZODONE 25-50mg — Low-dose antidepressant for sleep
   → Non-addictive — better long-term option
   → 25-50mg bedtime
   → 🤰: ⚠️ Category C — doctor decides
   → SIDE EFFECTS: Drowsiness, dry mouth
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

6. HYDROXYZINE 25mg — Antihistamine
   → Non-addictive — anti-anxiety + sleep
   → 25mg bedtime
   → 🤰: ⚠️ Category C
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

7. CBT-i (Cognitive Behavioral Therapy for Insomnia)
   → ★ GOLD STANDARD — better than medicine long-term
   → Therapist-guided — 4-8 sessions
   → Sleep restriction + stimulus control + cognitive therapy
   → No side effects — skills last lifetime
   → Apps: Sleepful, Insomnia Coach (free)

❌ AVOID:
→ Alcohol as sleep aid — disrupts sleep architecture
→ Benzodiazepines long-term — dependency
→ Phone in bed — blue light
→ Napping after 3 PM — disrupts night sleep`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Chronic insomnia (3+ months) needs proper
evaluation — thyroid, depression, sleep apnea rule out.
Sleeping pills = short-term only — dependency risk.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Insomnia + suicidal thoughts — KIRAN 1800-599-0019` },
      { severity: "RED", text: `Sleep apnea signs: Loud snoring + breathing stops + choking` },
      { severity: "YELLOW", text: `Insomnia 3+ months — sleep study consider` },
      { severity: "YELLOW", text: `Insomnia + anxiety/depression — professional help` },
      { severity: "YELLOW", text: `Pregnancy insomnia — heartburn, restless legs — doctor` },
    ],
    relatedIds: [18, 12, 16, 25],
  },
  {
    id: 23,
    slug: "joint-pain",
    name: `Joint Pain`,
    nameHi: `जोड़ों का दर्द`,
    nameGu: `સાંધાનો દુખાવો`,
    emoji: "🦴",
    category: "GENERAL_HEALTH",
    summary: `Joint pain in women is common after 30 due to hormones, vitamin D deficiency, and autoimmune conditions like rheumatoid arthritis. Gentle movement, weight management, and addressing deficiencies help most cases.`,
    whoGetsIt: ``,
    sections: {
      overview: `Joints (jodo) mein dard, stiffness, swelling. Women mein
men se 2-3x zyada common — especially after 40. Hormonal
connection strong — estrogen joints ko protect karta hai.

TYPES COMMON IN WOMEN:
OSTEOARTHRITIS (OA): Wear-and-tear — cartilage ghis jaata hai
→ Knees, hips, fingers, spine — most common
→ Age 45+ mostly — but younger obese women bhi
→ Morning stiffness <30 min — improves with movement

RHEUMATOID ARTHRITIS (RA): Autoimmune
→ Body apne joints attack karta hai
→ Small joints — hands, wrists, feet
→ Morning stiffness >1 hour — symmetric (dono taraf)
→ Women 3x more than men
→ Pregnancy mein often IMPROVES — postpartum flare

PREGNANCY JOINT PAIN:
→ Relaxin hormone — ALL ligaments loose
→ Weight gain — knees, hips pe pressure
→ Carpal tunnel — wrist pain, numbness
→ Usually resolves post-delivery

POSTPARTUM:
→ Feeding position — wrist, back, neck
→ Hormonal readjustment — temporary
→ Vitamin D deficiency — very common

OTHER: Fibromyalgia, Lupus, Gout (rare in women)`,
      gharelu: `⚡ PAIN RELIEF:

1. HALDI + KAALI MIRCH + DOODH — ★ ANTI-INFLAMMATORY
   → 1 tsp haldi + chutki kaali mirch + garam doodh
   → Daily raat ko — poore month
   → RESEARCH: Curcumin = as effective as Ibuprofen for
     knee OA pain (Multiple RCTs)
   → Kaali mirch = 2000% better absorption
   → ✅ Safe in pregnancy

2. ADRAK (Ginger) — Daily
   → Fresh adrak chai 2-3 cups + adrak sabzi mein
   → Anti-inflammatory + analgesic
   → RESEARCH: Ginger extract reduces OA knee pain
   → ✅ Safe — pregnancy 2-3 cups max

3. TIL TEL MASSAGE (Sesame Oil / तिल तेल / તલ તેલ)
   → Halka garam til tel — joints pe massage
   → 15-20 min — circular motion — gently
   → Warming + anti-inflammatory + lubricating
   → ✅ Safe externally — pregnancy bhi

4. LAHSUN + SARSON TEL (Garlic + Mustard Oil)
   → 4-5 lahsun cloves crush → sarson tel mein garam karo
   → Chhaan ke — joint pe massage — garam
   → Traditional Indian joint pain remedy
   → Anti-inflammatory + warming + circulation boost
   → ✅ Safe externally

5. METHI DANA (Fenugreek) — Oral
   → 1 tsp daily — chabao ya paani mein
   → Anti-inflammatory compounds
   → RESEARCH: Reduces knee OA symptoms
   → ✅ Safe

6. AJWAIN POTLI (Hot Herbal Compress)
   → Ajwain + salt — kapde mein baandho
   → Tawa pe garam karo — joint pe sikao
   → 15-20 min — din mein 2-3 baar
   → Traditional dry heat therapy
   → ✅ Safe in pregnancy — external

7. EPSOM SALT SOAK
   → 2 cups Epsom salt — garam paani mein
   → Pair/haath daalo — 20 min
   → Magnesium absorb — pain + stiffness reduce
   → ✅ Safe in pregnancy

DIET:
→ Anti-inflammatory: Haldi, adrak, fish oil, walnuts, green leafy
→ Calcium: Dairy, ragi, til — bone support
→ Vitamin D: Sunlight 15-20 min daily — CRITICAL for joints
→ Collagen: Bone broth — joint cartilage support
→ Avoid: Sugar, refined carbs, fried food — inflammation badhate`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Joint pain = "Sandhivata" (OA) or "Amavata" (RA).
Vata dushti primary — dryness, degeneration.
Ama (toxins) + Vata = inflammation in joints.
Treatment: Vata shamak + Ama pachan + Basti (enema therapy).

🌿 HERBS:

1. NIRGUNDI / NIRGANDI / निर्गुन्डी (Vitex Negundo) — ★ BEST
   → Nirgundi oil — joint pe massage
   → Nirgundi tablet: 500mg 2 baar
   → #1 Ayurvedic joint pain herb — anti-inflammatory
   → Brand: Baidyanath ₹80-130
   → 🤰: ⚠️ AVOID internal — external oil okay
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. GUGGULU — Anti-inflammatory + joint repair
   → Yograj Guggulu: 2 tab 2 baar garam paani se
   → Classical joint formula — Vata shamak
   → Brand: Baidyanath ₹80-130/80tab
   → 🤰: ❌ AVOID (Guggulu)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. SHALLAKI / BOSWELLIA (शल्लकी / શલ્લકી) — ★ RESEARCH PROVEN
   → 300-400mg extract 2-3 baar
   → RESEARCH: Boswellic acids significantly reduce OA pain
   → Anti-inflammatory — specific to joint tissue
   → Brand: Himalaya Shallaki ₹200-350
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. RASNA / रास्ना (Pluchea Lanceolata)
   → 3-5g churna ya Rasnadi Kashayam 15ml 2 baar
   → Vata shamak — joint + muscle pain
   → Brand: Kottakkal ₹150-250
   → 🤰: ⚠️ Consult Vaidya

5. ERANDA / CASTOR (एरंड / એરંડ)
   → Eranda tail — joint massage — warm
   → Internal: With Haritaki for Amavata
   → ✅ External safe in pregnancy
   → ⚠️ Internal: AVOID in pregnancy

📦 FORMULATIONS:
6. YOGRAJ GUGGULU — 2 tab 2 baar — primary joint formula
7. MAHARASNADI KASHAYAM — 15ml 2 baar — Vata joint pain
8. DHANWANTARAM TAILAM — massage oil — pregnancy safe externally
9. KOTTAMCHUKKADI TAILAM — massage — acute joint pain
   All: Brand Kottakkal/Baidyanath ₹100-300
   🤰: External oils ✅ Safe | Internal ⚠️ Consult Vaidya

PANCHAKARMA:
→ Janu Basti — oil pooling on knee — OA specific
→ Kati Basti — oil pooling on lower back
→ Basti (medicated enema) — Vata treatment #1
→ Pinda Sweda — herbal bolus massage — pain + stiffness
→ ⚠️ Qualified Panchakarma specialist only

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 PAIN RELIEF — ACUTE:

1. PARACETAMOL 500mg-1g — First line OA
   → Every 6-8 hours — max 4g/day
   → Safest option — fewer GI issues than NSAIDs
   → 🤰: ✅ SAFE
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. IBUPROFEN 400mg / DICLOFENAC 50mg
   Brand: Brufen ₹15-25 | Voveran ₹20-35
   → With food — 2-3 times daily
   → Better for inflammation than Paracetamol
   → 🤰: ❌ AVOID (especially 3rd trimester)
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. TOPICAL NSAIDs — ★ FEWER SIDE EFFECTS
   Brand: Volini gel ₹80-130 | Diclofenac gel ₹50-90
   → Apply on joint — 3-4 times daily
   → Local effect — less systemic absorption
   → 🤰: ⚠️ Limited use okay — not over large area
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 SUPPLEMENTS — JOINT HEALTH:

4. GLUCOSAMINE 1500mg + CHONDROITIN 1200mg daily
   Brand: Various ₹400-800/30 tab
   → Cartilage building blocks — OA support
   → Takes: 2-3 months for effect
   → Research: Mixed — some benefit for mild-moderate OA
   → 🤰: ⚠️ Insufficient data — avoid
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. OMEGA-3 (High EPA) 2000mg daily
   → Anti-inflammatory — RA especially
   → 🤰: ✅ Safe

6. CALCIUM 1000mg + VITAMIN D3 daily
   → Bone + joint support — ESSENTIAL
   → 70% Indian women Vitamin D deficient
   → 🤰: ✅ Essential

7. COLLAGEN PEPTIDES 10g daily
   → Joint cartilage support
   → Brand: Various ₹500-1000/200g
   → 🤰: ⚠️ Limited data

💊 FOR RHEUMATOID ARTHRITIS (Specialist):
→ Methotrexate — disease-modifying — 🤰: ❌❌ AVOID
→ Hydroxychloroquine — milder — 🤰: ✅ Safe (rheumatologist)
→ Biologics — advanced cases — specialist only
→ RA in pregnancy: Rheumatologist + OB-GYN together

💊 NON-MEDICINE:
→ Physiotherapy — strengthening, flexibility
→ Weight loss — every 1 kg lost = 4 kg less knee pressure
→ Hot/cold therapy — alternating
→ Knee brace/support — activity-specific
→ Swimming — best exercise for joints (no impact)`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Joint swelling, redness, warmth = doctor ASAP.
Could be RA, gout, infection — needs blood tests + imaging.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Hot, red, swollen joint + fever — SEPTIC ARTHRITIS — hospital` },
      { severity: "RED", text: `Joint injury — can't move, severe swelling — emergency` },
      { severity: "YELLOW", text: `Morning stiffness >1 hour + multiple joints — RA check` },
      { severity: "YELLOW", text: `Pregnancy joint pain + face swelling — preeclampsia rule out` },
      { severity: "YELLOW", text: `Post-delivery persistent joint pain — Vitamin D, thyroid check` },
    ],
    relatedIds: [8, 5, 25, 16],
  },
  {
    id: 24,
    slug: "post-delivery-recovery",
    name: `Post-Delivery Recovery`,
    nameHi: `प्रसव के बाद देखभाल`,
    nameGu: `પ્રસૂતિ પછીની સંભાળ`,
    emoji: "🤱",
    category: "POSTPARTUM",
    summary: `Post-delivery recovery covers the 6-week postpartum period — the body heals, hormones reset, and emotions stabilise. Rest, nutrition, pelvic care, and emotional support are all essential. Watch for postpartum depression signs.`,
    whoGetsIt: ``,
    sections: {
      overview: `Delivery ke baad — first 6 weeks (42 days) — body recovery period.
Ayurveda mein "Sutika Kala" kehte hain — bahut important period.
Body mein massive changes hote hain — uterus shrink, hormones
crash, breastfeeding start, sleep disruption, emotional adjustment.

KEY CHANGES AFTER DELIVERY:
→ UTERUS: Watermelon size → fist size in 6 weeks
→ HORMONES: Estrogen/Progesterone CRASH — mood impact
→ BLEEDING: Lochia — 4-6 weeks post-delivery bleeding (normal)
→ BREASTS: Milk production start — engorgement, soreness
→ MUSCLES: Pelvic floor weak, abdominal separation (diastasis)
→ EMOTIONS: Baby blues (80%), postpartum depression (15-20%)
→ HAIR: Post-partum hair fall — 2-4 months after delivery

INDIA-SPECIFIC TRADITIONS:
→ "Japa" period — 40 days rest
→ Special diet — gond ladoo, ajwain, methi
→ Oil massage — mother + baby
→ Many traditions are SCIENTIFICALLY SOUND
→ Some need updating — evidence based`,
      gharelu: `🍽️ TRADITIONAL POSTPARTUM FOODS — ★ BRILLIANT SCIENCE:

1. GOND KE LADOO (गोंद के लड्डू / ગુંદરના લાડુ) — ★★★
   → Gond (edible gum) + ghee + dry fruits + gur
   → 1-2 daily — first 40 days
   → WHY BRILLIANT: Gond = protein + calcium + energy
     Ghee = fat for hormone recovery + breastmilk
     Dry fruits = iron, zinc, omega-3
   → Warming — Vata shamak — uterus recovery
   → Gujarat Special: Gujarati Gundna ladoo
   → ✅ Breastfeeding safe — milk supply support
   → ⚠️ GDM/Diabetes: Limit — high calorie

2. AJWAIN WATER + AJWAIN PANJIRI
   → Ajwain water: 1 tsp ubaal ke piyo — din mein 3 baar
   → Ajwain panjiri: Wheat flour + ghee + ajwain + gur
   → WHY: Digestive fire restore + gas/bloating prevent
   → Uterine tonic — helps shrinkage
   → ✅ Safe — breastfeeding enhance

3. METHI LADOO / METHI HALWA
   → Methi dana + ghee + gur + dry fruits
   → WHY: Galactagogue = INCREASES BREAST MILK
   → Iron rich — anaemia recovery (delivery blood loss)
   → Joint pain prevention
   → ✅ Essential postpartum food

4. SAUNTH / DRY GINGER LADOO (सौंठ / સૂંઠ)
   → Saunth powder + ghee + gur + nuts
   → Warming — digestive — pain relief
   → Traditional postpartum #1 remedy
   → ✅ Breastfeeding safe

5. DESI GHEE — LIBERAL USE
   → 2-4 tsp daily — in food, ladoo, doodh
   → Hormone building blocks — recovery faster
   → Breastmilk fat content — baby brain development
   → Constipation prevent — lubricant
   → ✅ Essential — don't fear ghee postpartum

6. HALDI DOODH — Daily
   → Anti-inflammatory — healing speed up
   → Immune boost — infection prevent
   → ✅ Safe — breastfeeding

7. BADAM + KESAR DOODH — Bedtime
   → 5-6 badam + 2-3 kesar strands + garam doodh
   → Brain health — for mom AND through breastmilk for baby
   → Sleep quality improve
   → ✅ Safe

🥗 POSTPARTUM DIET:
→ WARM: Garam khana, garam paani — Vata shamak
→ PROTEIN: Dal, eggs, chicken, fish — tissue repair
→ IRON: Gur, dates, palak, beetroot — blood loss recovery
→ CALCIUM: Doodh, dahi, ragi, til — bone recovery
→ FIBRE: Fruits, vegetables — constipation prevent
→ WATER: 3-4L daily if breastfeeding — CRITICAL
→ AVOID: Cold food/drinks (traditional + makes sense)
→ AVOID: Heavy, fried, difficult to digest
→ AVOID: Gas-causing: Rajma, chole, cabbage (some women)

💆 OIL MASSAGE — ★ MOST BENEFICIAL TRADITION:

8. FULL BODY MASSAGE (Abhyanga)
   → Warm til tel ya Bala tail — daily
   → Professional maalish wali ya family member
   → 30-45 min — head to toe — gentle
   → WHY BENEFICIAL:
     - Circulation improve — healing faster
     - Muscle recovery — pregnancy strain
     - Lymphatic drainage — swelling reduce
     - Bonding — emotional well-being
     - Pain relief — back, joints
   → Continue: At least 40 days — longer better
   → Baby massage too — with coconut oil

9. PELVIC FLOOR EXERCISES — START EARLY
   → KEGEL exercises — 6-8 weeks post-delivery
   → Squeeze pelvic floor — 10 sec — relax — repeat 10x
   → 3 times daily — prevent incontinence
   → ✅ Safe — start within days of normal delivery
   → C-section: Wait till doctor clearance (usually 6 weeks)`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Post-delivery = "Sutika Kala" — body's Vata is MAXIMUM.
Dhatu kshaya (tissue depletion) — baby + blood loss.
Agni mandya — digestive fire weak.
Treatment priority: Vata shamak + Agni deepan + Dhatu pushti.

🌿 RECOMMENDED HERBS:

1. SHATAVARI — ★★★ #1 POSTPARTUM HERB
   → 1 tsp churna doodh mein — 2 baar
   → Galactagogue — BREAST MILK INCREASE
   → Hormonal recovery — estrogen balance
   → Reproductive tonic — uterus recovery
   → Brand: Himalaya ₹180-250
   → ✅ BREASTFEEDING SAFE — designed for this
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. DASHMOOL KWATH / DASHMOOLARISHTA
   → Kwath: 20-30ml warm water mein, 2 baar
   → Arishta: 15-20ml + paani, 2 baar after food
   → Vata shamak — #1 postpartum formulation
   → Pain relief + uterus recovery + digestion
   → Brand: Dabur/Baidyanath ₹120-180
   → ✅ BREASTFEEDING SAFE — traditional postpartum
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. JEERAKARISHTAM (Jeera/Cumin based)
   → 15-20ml + paani, 2 baar after food
   → Digestive + uterine tonic
   → Specific for postpartum recovery
   → Brand: Kottakkal ₹120-200
   → ✅ BREASTFEEDING SAFE
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. SHATAVARI GULAM / SHATAVARI LEHYAM
   → 1 tsp 2 baar — doodh ke saath
   → Concentrated Shatavari preparation — milk boost
   → Brand: Kottakkal ₹200-350
   → ✅ BREASTFEEDING SAFE

5. PIPPALI (Long Pepper / पिप्पली)
   → 1-2g churna shahad ke saath — daily
   → Agni deepan — digestive fire strengthen
   → Bioavailability enhancer — other herbs absorb better
   → ✅ Breastfeeding safe in moderate amounts

SUTIKA PARICHARYA (40-day protocol):
Week 1-2: Complete rest, warm food, oil massage, Dashmool
Week 3-4: Gradual activity, Shatavari for milk, light yoga
Week 5-6: Normal activity resuming, strength building
→ Abhyanga (oil massage) daily — entire 40 days
→ Warm water for bathing + drinking
→ Light, warm, oily food — easy to digest
→ Avoid: cold, heavy, dry, leftover food

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 ESSENTIAL POSTPARTUM SUPPLEMENTS:

1. IRON + FOLIC ACID — Continue 6 months post-delivery
   Brand: Orofer XT ₹80-120 | Autrin ₹60-100
   → Delivery blood loss = iron depleted
   → Breastfeeding = continued iron need
   → Check Hb at 6-week visit
   → 🤱: ✅ Essential

2. CALCIUM 1000mg + VITAMIN D3 — Daily
   Brand: Shelcal ₹100-150
   → Breastfeeding = calcium loss from mom's bones
   → If not supplemented = osteoporosis risk later
   → 🤱: ✅ Essential

3. DHA/OMEGA-3 200-300mg — Continue
   → Baby brain development via breastmilk
   → Mom's brain health — "mommy brain" support
   → 🤱: ✅ Essential

4. MULTIVITAMIN — Prenatal continue
   → Continue same prenatal vitamins while breastfeeding
   → At least 6 months — ideally till weaning
   → 🤱: ✅ Safe

💊 COMMON POSTPARTUM ISSUES:

5. PAIN RELIEF (Episiotomy / C-section):
   → Paracetamol 500mg-1g every 6-8 hours — 🤱 ✅ Safe
   → Ibuprofen 400mg every 8 hours — 🤱 ✅ Safe
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

6. CONSTIPATION:
   → Isabgol + warm water — bedtime
   → Lactulose 15-20ml — if needed
   → 🤱: Both ✅ Safe
   → Iron tablets cause this — manage together

7. BREAST ENGORGEMENT:
   → Warm compress before feeding — milk flow
   → Cold compress after feeding — swelling reduce
   → Frequent feeding — best prevention
   → Cabbage leaves — traditional + evidence-based!

8. NIPPLE CRACK/PAIN:
   → Lanolin cream (Lansinoh) — ₹400-600
   → Apply after each feed — no need to wipe before next
   → 🤱: ✅ Safe for baby
   → Correct latch = #1 solution — lactation consultant

9. LOW MILK SUPPLY:
   → Methi dana — galactagogue (traditional)
   → Shatavari — galactagogue (Ayurvedic)
   → Domperidone 10mg 3 times daily — 🤱 ✅ Increases prolactin
     (⚠️ Doctor prescribed only)
   → Frequent feeding + skin-to-skin = best milk boost
   → Adequate hydration: 3-4L water daily

10. POSTPARTUM DEPRESSION/ANXIETY (15-20% women):
    → Baby Blues: First 2 weeks — crying, mood swings — NORMAL
    → PPD: 2 weeks+ — persistent sadness, can't bond, can't sleep
    → HELP AVAILABLE: Therapist, psychiatrist
    → Sertraline — safest SSRI while breastfeeding
    → ⚠️ Don't suffer silently — TELL SOMEONE

💊 6-WEEK POSTPARTUM CHECK:
→ Uterus recovery check — pelvic exam
→ Blood pressure
→ Hb check — anaemia screening
→ Wound check (episiotomy / C-section scar)
→ Emotional wellbeing screening — PPD check
→ Contraception discussion
→ Breastfeeding assessment
→ Exercise clearance

💊 CONTRACEPTION AFTER DELIVERY:
→ Breastfeeding alone NOT reliable contraception
→ Options (breastfeeding safe):
  - Progesterone-only pill (Mini-pill)
  - Copper IUD — insert at 6 weeks
  - Condoms — anytime
  - Depo-Provera injection — after 6 weeks
→ Combined OCP: Wait 6 months if breastfeeding`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Postpartum period critical hai — rest + nutrition + support
zaroori hai. PPD ek real medical condition hai — professional
help leni chahiye. Breastfeeding issues ke liye lactation
consultant se milo. NutriMama medical prescription NAHI deta.`,
    },
    emergency: [
      { severity: "RED", text: `Heavy bleeding (soaking pad every hour) — POSTPARTUM HEMORRHAGE` },
      { severity: "RED", text: `Fever >100.4°F + foul smell discharge — INFECTION — hospital` },
      { severity: "RED", text: `Chest pain + breathlessness — pulmonary embolism — 108` },
      { severity: "RED", text: `Severe headache + vision changes — postpartum eclampsia` },
      { severity: "RED", text: `Thoughts of harming self/baby — IMMEDIATE psychiatric help` },
      { severity: "RED", text: `Red, warm, painful area on leg — DVT — hospital` },
      { severity: "YELLOW", text: `PPD symptoms 2+ weeks — therapist/psychiatrist` },
      { severity: "YELLOW", text: `Breastfeeding problems — lactation consultant` },
      { severity: "YELLOW", text: `Wound not healing — doctor check` },
    ],
    relatedIds: [5, 18, 15, 8],
  },
  {
    id: 25,
    slug: "menopause",
    name: `Menopause`,
    nameHi: `रजोनिवृत्ति`,
    nameGu: `મેનોપોઝ`,
    emoji: "🌸",
    category: "MENOPAUSE",
    summary: `Menopause is the natural end of periods, typically between 45-55 (around 47 in Indian women). It brings hot flashes, mood changes, sleep issues, and bone/heart risks due to falling oestrogen. Lifestyle and HRT options help.`,
    whoGetsIt: ``,
    sections: {
      overview: `Periods permanently band hona — 12 consecutive months no period.
Average age India: 46-48 years (earlier than Western 51).
Natural process — NOT a disease. But symptoms can significantly
affect quality of life — treatment available hai.

STAGES:
PERIMENOPAUSE (Transition — 2-8 years before):
→ Age 40-50 usually — periods irregular hone lagte
→ Hot flashes start — mood swings, sleep issues
→ STILL FERTILE — contraception needed!
→ Most symptomatic phase — worst for many women

MENOPAUSE (The event):
→ Last period — confirmed after 12 months no period
→ Average age India: 46-48 | Global: 51

POSTMENOPAUSE (After):
→ Symptoms gradually reduce (2-5 years most)
→ Long-term risks increase: Osteoporosis, heart disease
→ Vaginal dryness — may persist/worsen

PREMATURE MENOPAUSE (<40 years):
→ "Premature Ovarian Insufficiency" (POI)
→ 1% women — needs investigation + treatment
→ Causes: Autoimmune, genetic, surgery, chemo/radiation

SYMPTOMS:
VASOMOTOR (Most bothersome):
→ Hot flashes — sudden heat wave, flushing, sweating
→ Night sweats — drenching, sleep disruption
→ Duration: Average 7 years — some women 10+ years

UROGENITAL:
→ Vaginal dryness — itching, discomfort
→ Painful sex (dyspareunia)
→ Frequent UTIs
→ Urinary incontinence

PSYCHOLOGICAL:
→ Mood swings, irritability
→ Anxiety, depression
→ Brain fog — memory, concentration
→ Low libido
→ Sleep disturbance

PHYSICAL:
→ Joint pain — estrogen loss
→ Weight gain — especially belly
→ Skin dry, wrinkles faster
→ Hair thinning
→ Bone loss — osteoporosis risk
→ Heart disease risk increases significantly`,
      gharelu: `🔥 FOR HOT FLASHES:

1. SAUNF WATER (Fennel / सौंफ / વરિયાળી)
   → 1-2 tsp saunf garam paani mein — din mein 3 baar
   → Phytoestrogens — mild estrogen-like effect
   → RESEARCH: Fennel significantly reduces hot flash frequency
   → Cooling — traditional Pitta shamak
   → ✅ Safe

2. ALSI / FLAXSEED — ★ RESEARCH PROVEN
   → 1-2 tbsp ground daily — smoothie/dahi/roti
   → Lignans = STRONGEST phytoestrogen in food
   → RESEARCH: Reduces hot flash frequency by 50% in some studies
   → Omega-3 — heart protection bonus
   → ✅ Safe

3. SOYA — Phytoestrogen food
   → Soya milk, tofu, edamame — daily
   → Isoflavones — estrogen receptor binding
   → Japanese women (high soy diet) = fewer hot flashes
   → ✅ Safe — ⚠️ Thyroid: moderate if hypothyroid

4. TIL (Sesame) — Daily
   → 1-2 tsp — chabao ya ladoo
   → Phytoestrogen + calcium + iron
   → Bone health support — critical in menopause
   → ✅ Safe

5. AMLA — 1 daily
   → Antioxidant + cooling
   → Skin health — collagen support
   → Iron absorption — anaemia prevent
   → ✅ Safe

6. GULKAND — 1-2 tsp daily
   → Extreme cooling — hot flashes mein soothing
   → Traditional Pitta shamak
   → ✅ Safe

🥗 MENOPAUSE DIET:
→ CALCIUM: 1200mg daily — dairy, ragi, til, leafy greens
  (Bone loss accelerates post-menopause — CRITICAL)
→ VITAMIN D: Sunlight + supplement — calcium absorption
→ PROTEIN: 1g/kg body weight — muscle preservation
→ PHYTOESTROGENS: Soy, flaxseed, sesame, legumes
→ OMEGA-3: Fish, walnuts, flaxseed — heart protection
→ FIBRE: Fruits, vegetables, whole grains
→ WATER: 2.5-3L daily — skin + vaginal health
→ AVOID: Spicy food — hot flash trigger
→ AVOID: Caffeine — hot flash + sleep worse
→ AVOID: Alcohol — bone loss + hot flash trigger
→ AVOID: Excess sugar/salt — weight + BP

🏃 EXERCISE — NON-NEGOTIABLE:
→ WEIGHT-BEARING: Walking, jogging, dancing — bone density
→ STRENGTH: Weights/resistance — muscle + bone
→ YOGA: Hormone balance + flexibility + mood
→ KEGEL: Pelvic floor — incontinence prevent
→ 30-45 min daily — 5 days/week
→ Exercise = hot flashes reduce + mood better + bone stronger`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Menopause = "Rajonivrutti" — natural Vata kala (Vata phase of life).
After menopause, Vata dominates — dryness, degeneration, anxiety.
Treatment: Vata shamak + Rasayana (rejuvenation) + Ojas building.

🌿 KEY HERBS:

1. SHATAVARI — ★★★ #1 MENOPAUSE HERB
   → 1 tsp churna doodh mein — 2 baar
   → Phytoestrogen — mild hormonal support
   → Vaginal dryness, hot flashes, mood — all
   → "100 husbands" herb — reproductive tonic lifelong
   → Brand: Himalaya ₹180-250
   → Duration: Long term — years
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. ASHWAGANDHA — ★★ ADAPTOGEN + BONE
   → 500mg-1g daily — doodh mein
   → Cortisol manage — anxiety, sleep, mood
   → Bone density support — research emerging
   → Thyroid support — menopause thyroid issues
   → Brand: KSM-66 ₹400-600
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. ASHOKA — Transition support
   → 3-6g daily — perimenopausal irregular bleeding
   → Uterine tonic — eases transition
   → Brand: Himalaya ₹120-200
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. GUDUCHI / GILOY — Immune + joint
   → 500mg 2 baar — joint pain + immunity
   → Adaptogen — overall resilience
   → Brand: Himalaya ₹120-180
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. BRAHMI — Brain fog + mood
   → 500mg 2 baar — memory, concentration
   → Brand: Himalaya ₹150-250
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
6. ASHOKARISHTA — 15-20ml + paani, 2 baar — perimenopausal
7. SARASWATARISHTA — brain + mood support
8. DASHMOOL KWATH — Vata shamak + joint pain
9. CHYAWANPRASH — 1-2 tsp daily — Rasayana (rejuvenation)
   → ✅ Safest — everyone can take — traditional superfood

RASAYANA (Rejuvenation) APPROACH:
→ Chyawanprash daily — Amla-based immunomodulator
→ Brahma Rasayana — brain longevity
→ Abhyanga (oil massage) daily — Vata management
→ Nasya — Anu tail — brain nourishment
→ Sattvic diet — light, nourishing, warm

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 HORMONE REPLACEMENT THERAPY (HRT/MHT):

1. HRT — ★ MOST EFFECTIVE FOR SEVERE SYMPTOMS
   Types:
   → ESTROGEN ONLY: If uterus removed (hysterectomy)
     Brand: Premarin ₹200-350 | Progynova ₹100-200
   → COMBINED (E+P): If uterus intact — MUST add progesterone
     Brand: Femoston ₹250-400 | Tibolone (Livial) ₹300-500

   DOSE: Doctor individualizes — lowest effective dose
   Duration: Usually 5 years — reassess annually
   Start: Within 10 years of menopause / before age 60

   BENEFITS:
   → Hot flashes: 75-90% reduction — most effective
   → Vaginal dryness: Resolves
   → Bone protection: Osteoporosis prevention
   → Heart: May protect if started early
   → Mood, sleep, quality of life: All improve

   RISKS:
   → Breast cancer: Slight increase after 5+ years combined
   → Blood clots: DVT/PE risk increase (oral forms)
   → Stroke: Slight increase (oral forms)
   → Transdermal (patch/gel): LOWER clot/stroke risk than oral

   WHO SHOULD NOT TAKE:
   → Active/recent breast cancer
   → History of blood clots/stroke
   → Active liver disease
   → Unexplained vaginal bleeding (uninvestigated)
   → Known blood clotting disorder

   ⚠️ Doctor (Gynaecologist/Menopause specialist) ONLY.

💊 NON-HORMONAL OPTIONS:

2. VAGINAL ESTROGEN (Local — minimal systemic absorption)
   Brand: Evalon cream ₹200-350 | Ovestin ₹250-400
   → Apply locally — 2-3 times/week
   → Vaginal dryness + UTI prevention
   → Minimal systemic absorption — SAFER than oral
   → Even breast cancer survivors can sometimes use
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. SSRIs/SNRIs — For hot flashes (non-hormonal)
   → Venlafaxine 37.5-75mg — ₹30-60
   → Paroxetine 7.5mg (Brisdelle) — only FDA-approved for this
   → 50-60% hot flash reduction
   → Also help: Mood, anxiety, sleep
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. GABAPENTIN 300mg — Bedtime
   → Hot flashes + sleep improvement
   → Especially night sweats
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. CLONIDINE 0.1mg — Patch/oral
   → BP medicine that reduces hot flashes
   → Less effective than HRT/SSRIs
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 ESSENTIAL SUPPLEMENTS:

6. CALCIUM 1200mg daily — ★ MANDATORY
   → Bone loss: 2-3% PER YEAR in first 5 years post-menopause
   → 500-600mg morning + 500-600mg night
   → Brand: Shelcal, Calcimax
   → Separate from iron — 2 hr gap

7. VITAMIN D3 — MANDATORY
   → 1000-2000 IU daily maintenance
   → If deficient: 60,000 IU weekly × 8 weeks first
   → GET TESTED — 70% Indian women deficient
   → Without D, calcium won't absorb

8. BONE DENSITY TEST — DEXA Scan
   → At menopause — baseline
   → If osteopenia/osteoporosis found:
     → Bisphosphonates (Alendronate) — bone preservation
     → ⚠️ Specialist prescribed

9. OMEGA-3 — 1000-2000mg daily
   → Heart protection — risk increases post-menopause
   → Joint support — pain reduce
   → Brain health — cognition

10. PHYTOESTROGEN SUPPLEMENT (Isoflavones)
    → Soy Isoflavones 40-80mg daily
    → Mild hot flash reduction (30-40%)
    → Brand: Various ₹300-600/30 caps
    → Safer than HRT — less effective too

💊 VAGINAL DRYNESS (OTC):
→ Lubricants: Water-based — for sex (KY Jelly ₹200-300)
→ Moisturizers: Regular use — not just sex
  (Replens ₹400-600 | Vaginal Vitamin E)
→ Coconut oil — natural moisturizer — ✅ Safe

💊 SCREENING — POSTMENOPAUSAL:
→ Mammogram: Annual — breast cancer screening
→ Pap smear: Every 3 years
→ DEXA scan: Bone density at menopause
→ Lipid profile: Annual — cholesterol rises
→ Blood sugar: Annual — diabetes risk increases
→ BP: Regular monitoring
→ Thyroid: TSH annual — risk increases`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Menopause NATURAL hai — disease NAHI hai. But symptoms
treatment deserve karte hain. HRT safe hai most women
ke liye jab properly prescribed ho. Suffer mat karo
silently — options available hain.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Postmenopausal bleeding (periods band ke baad) — INVESTIGATE` },
      { severity: "RED", text: `Fracture from minor fall — severe osteoporosis` },
      { severity: "YELLOW", text: `Menopause before 40 — POI investigation` },
      { severity: "YELLOW", text: `Severe hot flashes affecting work/sleep — HRT discuss` },
      { severity: "YELLOW", text: `Depression/anxiety new onset — mental health support` },
      { severity: "YELLOW", text: `Vaginal bleeding — any amount — always investigate` },
    ],
    relatedIds: [23, 22, 18, 21],
  },
  {
    id: 26,
    slug: "breast-pain",
    name: `Breast Pain / Mastalgia`,
    nameHi: `स्तनों में दर्द`,
    nameGu: `સ્તનમાં દુખાવો`,
    emoji: "🎗️",
    category: "GENERAL_HEALTH",
    summary: `Breast pain (mastalgia) affects 70% of women at some point and is usually hormonal, not cancerous. It comes in cyclical (linked to periods) and non-cyclical forms. Persistent or unusual pain should still be investigated.`,
    whoGetsIt: `- 70% women — lifetime experience
- Cyclical: 20-40 years — premenopausal
- Worst with: PMS, PCOS, OCP use, HRT, caffeine
- Pregnancy: First trimester — very common
- Breastfeeding: Engorgement, mastitis
- Large breasts: Mechanical pain — bra fit important`,
    sections: {
      overview: `Breast mein dard, heaviness, tenderness ya discomfort. Bahut common
— 70% women experience it at some point. Usually hormonal hai aur
cancer se related NAHI hai (95%+ cases benign). Lekin persistent
ya unusual pain investigate zaroor karo.

TYPES:
CYCLICAL MASTALGIA (Period se related — MOST COMMON 75%):
→ Period se 1-2 weeks pehle start — period aate hi kam
→ Dono breasts — upper outer area zyada
→ Heavy, dull, aching — tender to touch
→ Age 20-40 — reproductive years
→ Hormonal — estrogen/progesterone fluctuation

NON-CYCLICAL MASTALGIA (Period se related NAHI):
→ Constant ya random — cycle se link nahi
→ Ek breast mein specific area — ya chest wall
→ Causes: Muscle strain, costochondritis, large breast
  weight, cyst, medication, poor bra fit
→ Any age — including postmenopausal

PREGNANCY/BREASTFEEDING:
→ Early pregnancy — breast tenderness (pehla symptom often)
→ Breast engorgement — milk aane pe
→ Mastitis — infection + painful lump + fever
→ Blocked duct — painful hard area

WHEN IT'S NOT BREAST PAIN:
→ Chest wall pain — muscle/rib below breast
→ Costochondritis — rib-breast bone junction inflammation
→ Heart burn — acid reflux referred to chest
→ Anxiety — chest tightness misinterpreted`,
      gharelu: `1. WELL-FITTED BRA — ★ #1 MOST IMPORTANT
   → 80% breast pain improves with CORRECT bra
   → Professional fitting ya measure properly
   → Sports bra for exercise — mandatory
   → Underwire avoid agar dard ho — soft cup try
   → Night mein bra hatao — let breasts rest

2. FLAXSEED / ALSI — ★ RESEARCH PROVEN
   → 1-2 tbsp ground daily — dahi/smoothie mein
   → RESEARCH: Significantly reduces cyclical breast pain
   → Lignans — estrogen metabolism improve
   → Start: Poore month khaao — not just PMS time
   → ✅ Safe

3. EVENING PRIMROSE OIL (Capsule) — ★ TRADITIONAL PROVEN
   → 1000-3000mg daily — capsule
   → GLA (Gamma-linolenic acid) — prostaglandin balance
   → Brand: Various ₹300-600/60 caps
   → Takes: 2-3 months for full effect
   → Research: Mixed but widely used — many women report relief
   → ✅ Safe — ⚠️ Pregnancy: Avoid (labor induction risk)

4. COLD COMPRESS — Instant relief
   → Ice pack wrapped in towel — 15 min
   → Inflammation reduce — swelling kam
   → Especially for engorgement/mastitis
   → ✅ Safe — pregnancy + breastfeeding

5. WARM COMPRESS — For engorgement/blocked duct
   → Garam kapda — breast pe before feeding
   → Milk flow improve — duct open
   → ✅ Safe

6. HALDI DOODH — Anti-inflammatory
   → 1 tsp haldi + doodh + kaali mirch
   → Raat ko — general breast inflammation reduce
   → ✅ Safe in pregnancy

7. CABBAGE LEAVES — ★ FOR ENGORGEMENT
   → Chilled cabbage leaves — bra mein rakho
   → 20 min — replace when wilted
   → RESEARCH: As effective as cold packs for engorgement
   → ✅ Safe — breastfeeding

8. REDUCE CAFFEINE — ★ SIGNIFICANT IMPACT
   → Chai/coffee kam karo — max 1 cup/day during PMS
   → RESEARCH: Caffeine reduction = significant breast pain decrease
   → Methylxanthines in caffeine = breast tissue stimulate
   → Also: Chocolate, cola, energy drinks kam karo

🥗 DIET:
→ LOW FAT: <20% calories from fat — research supported
→ HIGH FIBRE: Estrogen metabolism improve
→ REDUCE SALT: PMS week — water retention = breast swelling
→ Omega-3: Fish oil, walnuts, flaxseed
→ Vitamin E foods: Almonds, sunflower seeds, spinach
→ Avoid: Excess caffeine, alcohol, high-fat processed food`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Breast pain = "Stana Shoola" — Vata + Kapha dushti.
Hormonal mastalgia = Pitta involvement (inflammation).
Stanya vaha srotas (breast milk channels) obstruction.

🌿 HERBS:

1. SHATAVARI — Hormonal balance + breast health
   → 1 tsp doodh mein — 2 baar
   → Breast tissue nourishment — Stanya poshak
   → Brand: Himalaya ₹180-250
   → 🤱: ✅ Milk production bhi badhata
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. ASHOKA — Hormonal regulation
   → 3-6g daily — cyclical mastalgia
   → Brand: Himalaya ₹120-200
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. LODHRA — Astringent + anti-inflammatory
   → 3-5g churna — breast swelling reduce
   → Brand: Baidyanath ₹100-180
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. KANCHNAR GUGGULU — Breast lumps/cysts
   → 2 tab 2 baar — cysts/fibrocystic breast
   → Brand: Baidyanath ₹100-160
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

EXTERNAL:
→ Dashang Lepa — paste on breast — inflammation reduce
→ Warm til tel gentle massage — not deep pressure
→ ⚠️ Breast lump pe massage NAHI — doctor pehle

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 FIRST LINE:

1. PARACETAMOL 500mg — Simple pain relief
   → 🤰: ✅ Safe | 🤱: ✅ Safe
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. IBUPROFEN GEL/CREAM (Topical) — ★ BEST FOR BREAST PAIN
   Brand: Ibuprofen gel ₹50-90
   → Apply directly on painful area — 3 times daily
   → Local effect — minimal systemic
   → RESEARCH: Topical NSAID better than oral for mastalgia
   → 🤰: ⚠️ Small area okay — 3rd trimester avoid
   → 🤱: ✅ Topical safe — wash before feeding
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. EVENING PRIMROSE OIL — 1000-3000mg daily (see gharelu)

💊 PRESCRIPTION (Severe — Specialist):

4. DANAZOL 100-200mg — Last resort
   → Anti-estrogenic — effective but side effects
   → Weight gain, acne, deepening voice — androgenic
   → 🤰: ❌❌ AVOID — virilization of female fetus
   → ⚠️ Specialist only — severe refractory cases

5. TAMOXIFEN 10mg — Low dose
   → Anti-estrogen — breast pain reduce
   → Off-label — usually breast cancer drug
   → 🤰: ❌❌ AVOID
   → ⚠️ Specialist only

💊 SUPPLEMENTS:
→ Vitamin E 400IU daily — antioxidant, some evidence
→ Vitamin B6 100mg — hormonal metabolism
→ Magnesium 200-400mg — muscle relaxation

💊 BREAST EXAMINATION — SELF CHECK MONTHLY:
→ Day 7-10 of cycle (after period) — breasts least lumpy
→ Stand in front of mirror — look for changes
→ Lie flat — feel both breasts systematically
→ Armpit bhi check karo — lymph nodes
→ LOOK FOR: New lump, skin change, nipple discharge,
  dimpling, redness, size change

💊 SCREENING:
→ Mammogram: Age 40+ — every 1-2 years
→ Breast Ultrasound: <40 — dense breast tissue
→ Clinical Breast Exam: Annual by gynaecologist
→ MRI: High-risk women (family BRCA gene)`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
95%+ breast pain is BENIGN — cancer nahi hai. But NEW
lump, skin changes, nipple discharge = INVESTIGATE.
Early detection saves lives — self-exam monthly karo.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Breast lump + skin dimpling + nipple retraction — URGENT` },
      { severity: "RED", text: `Breastfeeding + fever + red hot painful breast — MASTITIS — doctor` },
      { severity: "RED", text: `Bloody nipple discharge — INVESTIGATE IMMEDIATELY` },
      { severity: "RED", text: `Breast abscess — pus, extreme pain, fever — surgical drainage` },
      { severity: "YELLOW", text: `New lump — any age — get checked within 2 weeks` },
      { severity: "YELLOW", text: `Family history breast cancer + breast changes — screening` },
      { severity: "YELLOW", text: `Persistent non-cyclical pain 3+ months — investigate` },
    ],
    relatedIds: [12, 4, 25, 24],
  },
  {
    id: 27,
    slug: "endometriosis",
    name: `Endometriosis`,
    nameHi: `एंडोमेट्रियोसिस`,
    nameGu: `એન્ડોમેટ્રિઓસિસ`,
    emoji: "🌹",
    category: "PCOS_HORMONAL",
    summary: `Endometriosis is a chronic condition where uterine lining tissue grows outside the uterus, causing severe period pain, painful sex, and fertility issues. It affects 1 in 10 women and is often diagnosed years late.`,
    whoGetsIt: `- 1 in 10 women (10%) — 176 million worldwide
- Any age after menarche — peak 25-35
- Family history = 7-10x higher risk
- Delayed diagnosis: Average 7-10 years in India
- Often dismissed as "normal period pain"
- Associated with: Autoimmune conditions, allergies`,
    sections: {
      overview: `Uterus ki inner lining (endometrium) body ke BAHAR grow hone
lagti hai — ovaries pe, fallopian tubes pe, peritoneum pe.
Yeh tissue period ke time WAHI bleed karta hai — but blood
bahar nahi ja sakta → inflammation, scarring, adhesions, PAIN.

10% reproductive age women — bahut underdiagnosed India mein.
Average diagnosis delay: 7-10 YEARS — bahut women suffer silently.

STAGES:
I — Minimal: Few small implants
II — Mild: More implants, deeper
III — Moderate: Deep implants + ovarian cysts (endometriomas)
IV — Severe: Extensive implants + adhesions + organ involvement

SYMPTOMS — "THE 5 Ds":
1. DYSMENORRHEA: Severe period pain — NOT normal heavy cramps
   → Progressive — getting WORSE month by month
   → Doesn't respond well to regular painkillers
   → Pain before, during, AND after period

2. DYSPAREUNIA: Painful sex — deep pain
   → Especially deep penetration
   → Continues after sex sometimes

3. DYSCHEZIA: Painful bowel movements during period
   → Straining pe pain — rectal area

4. DYSURIA: Painful urination during period
   → Bladder endometriosis — rare but possible

5. DYFERTILITY: Difficulty getting pregnant
   → 30-50% endometriosis women have fertility issues
   → Adhesions block tubes, egg quality affected, inflammation

OTHER SYMPTOMS:
→ Chronic pelvic pain — not just period time
→ Heavy periods — 40% women with endo
→ Fatigue — extreme tiredness — chronic inflammation
→ Bloating — "endo belly"
→ Nausea, diarrhea/constipation during period
→ Back pain — lower back, radiating
→ Leg pain — nerve involvement

WHO GETS IT:
- 1 in 10 women (10%) — 176 million worldwide
- Any age after menarche — peak 25-35
- Family history = 7-10x higher risk
- Delayed diagnosis: Average 7-10 years in India
- Often dismissed as "normal period pain"
- Associated with: Autoimmune conditions, allergies`,
      gharelu: `⚠️ Endometriosis ek chronic condition hai — gharelu nuskhe
PAIN MANAGE karte hain but CURE nahi karte. Medical treatment
ke SAATH use karo — replace nahi.

🔥 ANTI-INFLAMMATORY DIET — ★ MOST IMPACTFUL:

1. HALDI (TURMERIC) — ★★ RESEARCH PROVEN
   → 1-2 tsp daily — doodh, sabzi, golden milk
   → Curcumin: Anti-inflammatory + anti-angiogenic
   → RESEARCH: Curcumin inhibits endometrial tissue growth
     and reduces inflammatory markers in endo (animal + in vitro)
   → Kaali mirch ZAROOR — 2000% absorption increase
   → ✅ Safe — ⚠️ Pregnancy: food amounts safe

2. ADRAK (GINGER) — Anti-inflammatory + anti-nausea
   → 2-3 cups chai daily + cooking mein
   → Pain reduce — prostaglandin inhibition
   → Nausea relief — endo mein common
   → ✅ Safe

3. OMEGA-3 RICH FOODS
   → Walnuts, flaxseed, chia seeds, fatty fish
   → Anti-inflammatory — prostaglandin balance
   → RESEARCH: Higher Omega-3 intake = lower endo risk
   → Daily: 1 tbsp flaxseed + 5 walnuts minimum

4. GREEN LEAFY VEGETABLES — MAXIMIZE
   → Palak, methi, sarson, broccoli
   → Magnesium + iron + anti-inflammatory compounds
   → Cruciferous vegetables: Estrogen metabolism improve

5. GARAM PAANI KI BOTTLE — Pain episodes
   → Lower abdomen + lower back — 20 min
   → Muscle relax + blood flow
   → ✅ Safe always

AVOID — INFLAMMATION TRIGGERS:
→ RED MEAT: Increases inflammatory prostaglandins
→ DAIRY (some women): May worsen — trial elimination 1 month
→ SUGAR/PROCESSED: Inflammation promote
→ ALCOHOL: Estrogen levels badh sakte
→ TRANS FATS: Fried food, bakery — inflammatory
→ GLUTEN: Some endo women report improvement removing it
  (Try 3-month elimination — see if helps)
→ SOY EXCESS: Phytoestrogen — may stimulate endo tissue

LIFESTYLE:
→ EXERCISE: 30 min daily — reduces estrogen, pain, inflammation
  Yoga especially beneficial — stress + pain both
→ STRESS MANAGEMENT: Cortisol → inflammation → endo worse
→ SLEEP: 7-8 hours — healing + pain threshold
→ HEAT THERAPY: Garam bottle, warm baths — regular
→ PELVIC FLOOR PHYSIOTHERAPY: Specialized — very helpful`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Endometriosis = Closest to "Yoni Vyapat" + "Udavarta"
(reversed flow) + Vata-Kapha-Rakta dushti.
Vata pushes endometrial tissue to wrong places.
Kapha promotes growth. Rakta (blood) dushti — inflammation.
Treatment: Vata-Kapha shamak + Rakta shuddhi + Uttara Basti.

🌿 HERBS:

1. SHATAVARI — Hormonal modulator
   → 1 tsp doodh mein — 2 baar
   → Estrogen balance — not excess, not deficit
   → Anti-inflammatory — Pitta shamak
   → Brand: Himalaya ₹180-250
   → 🤰: ✅ Safe
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. ASHOKA — Uterine health
   → 3-6g bark powder — 2 baar
   → Menstrual pain + bleeding control
   → Brand: Himalaya ₹120-200
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. GUGGULU — Anti-inflammatory
   → Kaishore Guggulu: 2 tab 2 baar
   → Blood purifier + anti-inflammatory
   → Brand: Baidyanath ₹80-130
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. GUDUCHI / GILOY — Immune modulator
   → 500mg 2 baar — autoimmune component address
   → Anti-inflammatory — chronic inflammation
   → Brand: Himalaya ₹120-180
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

5. DASHMOOL — Pain + Vata shamak
   → Kwath 20-30ml 2 baar
   → Brand: Baidyanath ₹120-200
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

PANCHAKARMA:
→ Uttara Basti — medicated enema through vagina
  (MOST SPECIFIC treatment for endo in Ayurveda)
→ Virechana — purgation therapy — toxin removal
→ Basti — rectal medicated enema — Vata treatment
→ ⚠️ ONLY qualified Panchakarma centre

⚠️ Endometriosis chronic hai — Ayurveda SUPPORT mein lo.
Medical treatment (hormonal/surgical) ka REPLACEMENT nahi.
Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 PAIN MANAGEMENT:

1. NSAIDs — First line for pain
   → Mefenamic Acid 500mg / Ibuprofen 400mg
   → Start BEFORE period — not after pain starts
   → Details in Condition #1
   → 🤰: ❌ AVOID
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 HORMONAL SUPPRESSION (Shrink endo tissue):

2. COMBINED OCP — Continuous use
   Brand: Novelon, Yasmin — ₹100-350/pack
   → Take CONTINUOUSLY — no 7-day break — skip periods
   → Suppresses ovulation + endo growth
   → Cheap, effective, well-tolerated
   → 🤰: ❌ STOP if planning pregnancy
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. PROGESTERONE-ONLY:
   → Dienogest (Visanne) 2mg daily — ₹400-700/30tab
     ★ SPECIFICALLY approved for endometriosis
     Shrinks endo tissue + pain reduce significantly
   → Norethisterone 5mg — ₹30-50
   → Depo-Provera injection — every 3 months
   → 🤰: ❌ AVOID
   → SIDE EFFECTS: Spotting, mood, weight, headache
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. MIRENA IUD (Levonorgestrel IUS)
   → Local progesterone — endo suppression
   → 5 years — minimal systemic effects
   → ₹8000-12000
   → 🤰: Remove if pregnant
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

5. GnRH AGONISTS (Severe — Specialist)
   → Leuprolide (Lupride) injection — monthly
   → Creates "medical menopause" — endo shrinks dramatically
   → Max 6 months — bone loss risk
   → Add-back therapy: Low-dose HRT alongside
   → 🤰: ❌ AVOID
   → Price: ₹2000-5000/injection
   → ⚠️ Specialist prescribed only

💊 SURGICAL:

6. LAPAROSCOPY — ★ DIAGNOSIS + TREATMENT
   → Only definitive diagnosis = surgery (biopsy)
   → Excision/ablation of endo tissue
   → Adhesion release — fertility improve
   → Cost: ₹50,000-2,00,000 depending on severity
   → Recovery: 1-2 weeks (keyhole surgery)
   → Recurrence: 40-50% in 5 years — hormonal follow-up needed

7. HYSTERECTOMY — Last resort
   → Uterus ± ovaries removal
   → Only when: Completed family, failed all treatment
   → Ovary removal = surgical menopause → HRT needed
   → NOT guaranteed cure if ovaries kept

💊 FOR FERTILITY:
→ Laparoscopy first — remove endo, open tubes
→ Ovulation induction — Letrozole/Clomiphene
→ IUI — Intrauterine insemination
→ IVF — Most effective for severe endometriosis
→ Don't delay — fertility worsens with time in endo

💊 SUPPLEMENTS:
→ NAC 600mg 2-3 times daily — research for endo cyst reduction
→ Omega-3 2000mg — anti-inflammatory
→ Vitamin D — if deficient (most are)
→ Magnesium 400mg — pain + muscle relaxation
→ Zinc 15-30mg — immune modulation

💊 TESTS:
→ Ultrasound pelvis — endometrioma (chocolate cyst) visible
→ CA-125 blood test — elevated in endo (not diagnostic alone)
→ MRI pelvis — deep endo, DIE (deep infiltrating endo)
→ Laparoscopy — GOLD STANDARD diagnosis
→ Fertility tests if trying to conceive`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Endometriosis chronic condition hai —
proper gynaecologist (preferably endo specialist) chahiye.
Average diagnosis 7-10 years late — advocate for yourself.
"Severe period pain is NOT normal" — investigate karo.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Sudden severe pelvic pain — endo cyst RUPTURE possible` },
      { severity: "RED", text: `Fainting + severe pain — internal bleeding possible` },
      { severity: "RED", text: `Unable to pass urine/stool + pain — endo blocking organs` },
      { severity: "YELLOW", text: `Pain worsening month by month — don't ignore` },
      { severity: "YELLOW", text: `Trying to conceive 6+ months — fertility evaluation` },
      { severity: "YELLOW", text: `Painkillers not working — need hormonal treatment` },
    ],
    relatedIds: [1, 6, 3],
  },
  {
    id: 28,
    slug: "fibroids",
    name: `Fibroids (Uterine)`,
    nameHi: `गर्भाशय रसौली`,
    nameGu: `ગર્ભાશય ફાઈબ્રોઈડ`,
    emoji: "🟣",
    category: "PCOS_HORMONAL",
    summary: `Fibroids are benign muscle growths in the uterus, affecting 20-50% of women by age 50. Most cause no symptoms; large or submucosal ones can cause heavy bleeding, pressure, and fertility issues. Treatment ranges from monitoring to surgery.`,
    whoGetsIt: `- 20-50% women by age 50
- Peak age: 30-50
- Family history — 3x risk
- Obesity — estrogen from fat tissue
- Nulliparity (no children) — higher risk
- Early menarche (<10 years)
- Vitamin D deficiency — emerging risk factor
- Usually SHRINK after menopause (estrogen drops)`,
    sections: {
      overview: `Uterus ki muscle wall mein non-cancerous (benign) growths.
Bahut common — 20-50% women by age 50. Most fibroids cause
NO symptoms — sirf kuch women ko problems hote hain.
Cancer mein convert NAHI hote (0.1% se bhi kam).

TYPES (Location based):
INTRAMURAL: Uterus wall ke andar — MOST COMMON
→ Heavy bleeding + pain if large
SUBSEROSAL: Uterus ke bahar ki taraf grow
→ Pressure symptoms — bladder, bowel pe
SUBMUCOSAL: Uterus cavity mein — INSIDE
→ Even small = heavy bleeding + fertility issues
PEDUNCULATED: Stalk se attached — inside ya outside
→ Can twist → sudden severe pain

SIZES:
→ Small: <3 cm — often no symptoms — watch
→ Medium: 3-5 cm — may cause symptoms
→ Large: 5-10 cm — likely symptomatic
→ Giant: >10 cm — significant — treatment needed

SYMPTOMS (Only 20-50% fibroids cause symptoms):
→ HEAVY PERIODS — #1 symptom — menorrhagia
→ Prolonged periods — >7 days
→ Pelvic pressure/heaviness
→ Frequent urination — fibroid pressing bladder
→ Constipation — pressing bowel
→ Backache — lower back
→ Painful sex — deep pain
→ Fertility issues — submucosal especially
→ Enlarged abdomen — large fibroids
→ Anaemia — from chronic heavy bleeding

WHO GETS THEM:
- 20-50% women by age 50
- Peak age: 30-50
- Family history — 3x risk
- Obesity — estrogen from fat tissue
- Nulliparity (no children) — higher risk
- Early menarche (<10 years)
- Vitamin D deficiency — emerging risk factor
- Usually SHRINK after menopause (estrogen drops)`,
      gharelu: `⚠️ Fibroids ko gharelu nuskhe se completely SHRINK nahi kar sakte.
But symptoms MANAGE ho sakte hain + growth slow ho sakti hai.

1. GREEN TEA / EGCG — ★ RESEARCH PROVEN
   → 2-3 cups daily ya EGCG supplement 800mg
   → RESEARCH: EGCG (green tea extract) significantly reduces
     fibroid size and symptoms (clinical trial — NIH)
   → Anti-proliferative — fibroid growth slow
   → ✅ Safe — ⚠️ Pregnancy: 1-2 cups max

2. HALDI (TURMERIC) — Anti-inflammatory + anti-proliferative
   → 1-2 tsp daily in food/doodh
   → Curcumin inhibits fibroid cell growth (lab studies)
   → ✅ Safe

3. APPLE CIDER VINEGAR — Weight + hormone balance
   → 1-2 tsp diluted — before meals
   → Weight management = estrogen reduce
   → ⚠️ Always dilute — straw se piyo

4. GARLIC / LAHSUN — Daily
   → 2-3 raw cloves crush karke
   → Anti-inflammatory + may slow fibroid growth
   → ✅ Safe

5. IRON-RICH FOODS — MANDATORY
   → Heavy bleeding = iron loss = anaemia
   → Gur, dates, palak, beetroot, chana — daily
   → Details in Condition #5

🥗 FIBROID-FRIENDLY DIET:
→ HIGH FIBRE: Vegetables, fruits, whole grains
  (Fibre = estrogen clearance from body)
→ CRUCIFEROUS: Broccoli, cauliflower, kale
  (DIM compound = estrogen metabolism)
→ GREEN TEA: EGCG — directly anti-fibroid
→ VITAMIN D RICH: Sunlight, eggs, fish
  (Deficiency = fibroid growth — research)
→ LOW GLYCEMIC: Blood sugar stable = insulin stable = less growth
→ AVOID: Red meat (linked to fibroid risk increase)
→ AVOID: Excess alcohol — estrogen increase
→ AVOID: Processed food, excess dairy — debated but cautious
→ WEIGHT MANAGEMENT: Adipose tissue = estrogen factory`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Fibroids = "Granthi" (tumor/growth) in Garbhashaya (uterus).
Kapha dushti primary — abnormal tissue growth.
Vata pushes Kapha — location determines symptoms.
Rakta dushti — blood involvement — heavy bleeding.
Treatment: Kapha-Vata shamak + Granthi nashak (tumor dissolving).

🌿 KEY HERBS:

1. KANCHNAR GUGGULU — ★★★ BEST FOR FIBROIDS
   → 2 tab 2-3 baar garam paani se
   → SPECIFIC for all abnormal growths — tumors, cysts, fibroids
   → Kanchnar bark = anti-proliferative
   → Guggulu = anti-inflammatory
   → Brand: Baidyanath ₹100-160/80tab | Patanjali ₹60-90
   → TEEN: 1 tab 2 baar | ADULT: 2 tab 3 baar
   → Duration: 3-6 months minimum — slow but steady
   → 🤰: ❌ AVOID (Guggulu)
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. ASHOKA — Heavy bleeding control
   → 3-6g bark powder — 2 baar
   → Uterine astringent — bleeding significantly reduce
   → Brand: Himalaya ₹120-200
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. VARUNA / VARUN (Crataeva Nurvala)
   → 500mg tablet 2 baar
   → Anti-lithiatic + anti-tumor — traditional use
   → Fibroid + cyst both — dissolving property
   → Brand: Baidyanath ₹80-130
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. TRIPHALA — Detox + anti-proliferative
   → 1-2 tsp raat ko — daily
   → Kapha reduce + metabolism improve
   → Brand: Any ₹50-100
   → 🤰: ⚠️ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
5. KANCHNAR GUGGULU — (primary — detailed above)
6. PUSHYANUG CHURNA — 3-6g shahad ke saath
   → Bleeding + uterine support
7. CHANDRAPRABHA VATI — 2 tab 2 baar
   → Metabolic + urinary + reproductive
8. SUKUMARA KASHAYAM — 15ml 2 baar before food
   → Reproductive tonic — uterine fibroids
   Brand: Kottakkal ₹150-250

⚠️ IMPORTANT: Ayurvedic treatment for fibroids = SLOW.
3-6 months minimum. Repeat ultrasound to track size.
If fibroid growing rapidly despite treatment → surgery.
Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 WATCHFUL WAITING:
→ Small, asymptomatic fibroids — NO treatment needed
→ Monitor: Ultrasound every 6-12 months — track growth
→ Near menopause? May shrink naturally — wait

💊 MEDICAL TREATMENT:

1. TRANEXAMIC ACID 500mg — Heavy bleeding control
   → Details in Condition #6
   → Symptom relief — doesn't shrink fibroid
   → 🤰: ⚠️ Doctor decides
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. OCPs / HORMONAL — Bleeding control
   → Regulate cycle + reduce flow
   → Don't shrink fibroids but manage symptoms
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

3. MIRENA IUD — Submucosal fibroids bleeding
   → 5 years — progesterone local
   → Bleeding reduce 70-90%
   → May mildly shrink fibroid
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

4. GnRH AGONISTS (Pre-surgery shrinkage)
   → Leuprolide — monthly injection
   → Shrinks fibroid 30-50% in 3-6 months
   → Used BEFORE surgery — makes surgery easier
   → Max 6 months — bone loss risk
   → Price: ₹2000-5000/injection
   → 🤰: ❌ AVOID
   → ⚠️ Specialist prescribed only

5. ULIPRISTAL ACETATE (Esmya) 5mg
   → Oral — daily for up to 3 months
   → Selective progesterone receptor modulator
   → Shrinks fibroids + controls bleeding
   → ⚠️ Liver monitoring needed
   → ⚠️ Specialist prescribed only

💊 SURGICAL OPTIONS:

6. MYOMECTOMY — ★ FIBROID REMOVAL (Uterus saved)
   → Laparoscopic (keyhole) — smaller fibroids
   → Open (abdominal) — large/multiple fibroids
   → Hysteroscopic — submucosal (no cuts — through vagina)
   → UTERUS PRESERVED — pregnancy possible after
   → Cost: ₹50,000-2,50,000
   → Recovery: 2-6 weeks depending on type
   → Recurrence: 20-30% in 5-10 years

7. HYSTERECTOMY — Uterus removal (Definitive)
   → Laparoscopic/Vaginal/Open — doctor decides
   → PERMANENT — no periods, no pregnancy possible
   → Only if: Family complete + symptoms severe + failed other
   → Ovaries usually KEPT — no menopause
   → Cost: ₹75,000-3,00,000
   → Recovery: 4-8 weeks

8. UTERINE ARTERY EMBOLIZATION (UAE)
   → Interventional radiology — no surgery
   → Blood supply to fibroid CUT — fibroid shrinks
   → 90% symptom improvement
   → Uterus preserved — but fertility questionable
   → Cost: ₹1,00,000-2,50,000
   → Recovery: 1-2 weeks

9. MRI-GUIDED FOCUSED ULTRASOUND (MRgFUS)
   → Non-invasive — ultrasound destroys fibroid
   → No cuts, no anaesthesia
   → Limited availability in India
   → For specific fibroid types only

💊 FIBROIDS + PREGNANCY:
→ Most women with fibroids conceive normally
→ Risk: Miscarriage (submucosal), preterm, C-section
→ Fibroids may GROW in pregnancy (estrogen high)
→ Red degeneration: Fibroid outgrows blood supply — PAIN
  (2nd trimester usually — management: rest + paracetamol)
→ C-section: If fibroid blocking birth canal
→ Plan: Myomectomy BEFORE pregnancy if problematic fibroid

💊 TESTS:
→ Pelvic Ultrasound — #1 — size, number, location
→ MRI — detailed mapping before surgery
→ Hysteroscopy — submucosal fibroids
→ CBC — anaemia check
→ Iron studies — Ferritin`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Fibroids are BENIGN — NOT cancer.
Most don't need treatment. Don't panic — get proper
assessment. Surgery only when truly needed.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Sudden severe pain — fibroid torsion/degeneration` },
      { severity: "RED", text: `Extremely heavy bleeding — soaking pad/hour — hospital` },
      { severity: "RED", text: `Fibroid + pregnancy pain — red degeneration — OB-GYN` },
      { severity: "RED", text: `Unable to urinate — large fibroid pressing bladder` },
      { severity: "YELLOW", text: `Fibroid growing rapidly — repeat ultrasound urgent` },
      { severity: "YELLOW", text: `Anaemia severe — Hb <8 — IV iron/transfusion consider` },
      { severity: "YELLOW", text: `Fertility desire + fibroid — gynaecologist planning` },
    ],
    relatedIds: [6, 5, 27, 1],
  },
  {
    id: 29,
    slug: "pregnancy-swelling",
    name: `Pregnancy Swelling / Edema`,
    nameHi: `गर्भावस्था में सूजन`,
    nameGu: `સગર્ભાવસ્થામાં સોજો`,
    emoji: "🫧",
    category: "PREGNANCY",
    summary: `Pregnancy swelling (edema) of feet and ankles affects 80% of pregnant women and is usually normal. However, sudden swelling of face/hands with headache or vision changes can signal preeclampsia — a medical emergency.`,
    whoGetsIt: ``,
    sections: {
      overview: `Pregnancy mein pair, ankle, haath, face mein soojh jaana.
80% pregnant women ko hota hai — usually NORMAL hai.
Body mein 50% extra blood + fluids pregnancy mein — yeh
gravity se pairo mein collect hote hain.

NORMAL vs DANGEROUS SWELLING:

NORMAL EDEMA (Don't Panic):
→ Pair/ankle mein — especially shaam ko
→ Dono pair equally — symmetric
→ Zyada khade rehne / garam mausam mein badh jaata
→ Raat ko lete pe kam ho jaata hai
→ 3rd trimester mein zyada — baby ka weight
→ Rings tight ho gayi — normal

⚠️ DANGEROUS — PREECLAMPSIA SIGNS:
→ FACE soojh gayi — especially subah uthke
→ HAATH bahut soothe — rings bilkul nahi nikal rahe
→ SUDDEN swelling — ek din mein bahut badh gaya
→ Swelling + HEADACHE severe
→ Swelling + VISION changes (blurry, flashing lights)
→ Swelling + UPPER ABDOMINAL PAIN (right side)
→ Swelling + PROTEIN IN URINE (doctor test)
→ Rapid weight gain — >1 kg/week
→ ⚠️ ANY of above = DOCTOR TURANT — PREECLAMPSIA

PREECLAMPSIA — SERIOUS PREGNANCY COMPLICATION:
→ High BP + protein in urine + swelling
→ 2-8% pregnancies — potentially FATAL if untreated
→ Usually after 20 weeks — can occur postpartum too
→ Risk: Seizures (eclampsia), organ damage, placenta problems
→ Treatment: Delivery of baby — only definitive cure
→ Risk factors: First pregnancy, age >35, obesity, family history`,
      gharelu: `(🤰 FOR NORMAL PREGNANCY SWELLING ONLY)

⚡ IMMEDIATE RELIEF:

1. PAIR UPAR RAKHO — ★ MOST EFFECTIVE
   → Lete waqt pair ko 2-3 pillows pe elevate karo
   → Heart level se upar — gravity se fluid drain
   → Din mein 3-4 baar — 20 min each time
   → Sote waqt bhi slightly elevated
   → ✅ Instant relief — zero cost

2. LEFT SIDE SLEEPING
   → Left side = kidney function optimal = fluid drain
   → Vena cava (bada blood vessel) pe pressure kam
   → Blood circulation baby + mom dono better
   → Pillow between knees — comfort

3. COCONUT WATER — 1-2 glasses daily
   → Natural diuretic — mild fluid balance
   → Electrolytes — potassium, magnesium
   → Dehydration prevent — counterintuitive but IMPORTANT
   → ✅ Safe in pregnancy

4. DANDELION TEA — Natural diuretic
   → 1-2 cups daily
   → Mild diuretic — excess fluid reduce
   → Potassium preserve karta hai (unlike drugs)
   → ⚠️ Pregnancy: Limited data — 1 cup max, consult doctor

5. CUCUMBER + LEMON WATER
   → Cucumber slices + nimbu — water mein
   → Sip throughout day
   → Hydrating + mild diuretic
   → ✅ Safe in pregnancy

6. PAIR KO THANDA PAANI MEIN DAALO
   → Basin mein cool (not ice cold) water
   → 15-20 min — swelling reduce
   → Vasoconstriction — fluid move out
   → ✅ Safe

7. EPSOM SALT FOOT SOAK
   → 1-2 cup Epsom salt warm water mein
   → Pair daalo — 15-20 min
   → Magnesium absorb — swelling + cramps reduce
   → ✅ Safe in pregnancy
   → ⚠️ Paani bahut garam nahi

8. WALKING — 20-30 min daily
   → Calf muscles pump = fluid push upward
   → Sitting/standing ek jagah = worst for swelling
   → Movement = prevention + treatment
   → ✅ Safe throughout pregnancy

🥗 DIET:
→ REDUCE SALT: Excess salt = water retention
  Don't eliminate — just reduce processed/extra
→ POTASSIUM RICH: Banana, coconut water, orange, potato
  (Potassium = sodium balance = less retention)
→ WATER: 2.5-3L DAILY — paradoxically REDUCES swelling
  (Dehydration = body RETAINS more fluid)
→ PROTEIN: Adequate protein — low protein = more edema
→ AVOID: Processed food — hidden sodium bahut
→ AVOID: Standing long time — sit/walk instead

COMPRESSION STOCKINGS:
→ Medical grade — graduated compression
→ Brand: Various ₹300-800 (pharmacy)
→ Put on MORNING — before standing
→ Prevent fluid pooling in legs
→ ✅ Safe in pregnancy — doctor recommend karte hain`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Pregnancy swelling = Kapha + Jala (water) dhatu vriddhi.
Body mein fluid retention — Mutra vaha srotas sluggish.
Treatment: Mild diuretic + Kapha shamak — GENTLE in pregnancy.

🌿 PREGNANCY-SAFE REMEDIES:

1. PUNARNAVA / पुनर्नवा / પુનર્નવા — ★ BEST
   → 500mg tablet ya 3-5g churna — 2 baar
   → "Punarnava" = "that which renews the body"
   → Natural diuretic — kidney tonic — fluid balance
   → RESEARCH: Diuretic effect without potassium loss
   → Brand: Himalaya ₹120-180
   → ✅ SAFE in pregnancy — traditionally used for edema
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. GOKSHURA / गोक्षुर / ગોખરું
   → 3-5g churna ya 500mg tablet — 2 baar
   → Diuretic + kidney tonic
   → Brand: Himalaya ₹150-250
   → 🤰: ⚠️ CAUTION — some texts say avoid, some say safe
   → Only under Vaidya supervision in pregnancy
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. CORIANDER SEED WATER (DHANIYA)
   → 2 tsp dhaniya seeds — raat ko paani mein bhigao
   → Subah piyo — din mein 2-3 baar bhi okay
   → Mild diuretic — cooling — Pitta shamak
   → ✅ SAFE in pregnancy — food grade

4. FENNEL WATER (SAUNF)
   → 1 tsp saunf paani mein steep — piyo
   → Mild diuretic + digestive
   → ✅ SAFE in pregnancy

EXTERNAL:
→ Gentle leg massage — UPWARD strokes only
→ Bala tail ya til tel — warm — legs pe
→ ✅ SAFE — don't press deep on swollen areas

⚠️ STRONG diuretics AVOID in pregnancy.
Punarnava safest Ayurvedic option — but still consult Vaidya.`,
      modern: `💊 FOR NORMAL PREGNANCY EDEMA:
→ NO medicine usually needed — lifestyle measures enough
→ Diuretics (water pills) = ❌ AVOID in pregnancy
  (Reduce placental blood flow — dangerous)

💊 IF PREECLAMPSIA:

1. ANTIHYPERTENSIVES (BP control):
   → Labetalol — first line pregnancy BP med
   → Nifedipine — second line
   → Methyldopa — traditional pregnancy BP med
   → 🤰: These specific ones are SAFE — doctor prescribed
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. MAGNESIUM SULFATE (Eclampsia prevention):
   → IV — hospital setting
   → Prevents seizures in severe preeclampsia
   → Monitoring required — reflexes, urine output
   → LIFE-SAVING medication

3. DELIVERY — Only definitive cure for preeclampsia
   → Timing: Doctor balances baby maturity vs mom's safety
   → Mild: May wait till 37 weeks with monitoring
   → Severe: Early delivery may be needed
   → Postpartum: Usually resolves within days-weeks

💊 SUPPLEMENTS:
→ Calcium 1500-2000mg daily — preeclampsia prevention
  (WHO recommends for areas with low calcium intake = India)
→ Low-dose Aspirin 75-150mg — preeclampsia prevention
  (Started before 16 weeks in HIGH-RISK women — doctor decides)
  → ⚠️ ONLY if doctor prescribes — not self-medicate

💊 MONITORING:
→ BP check: Every prenatal visit
→ Urine protein: Dipstick every visit
→ Weight: Weekly in 3rd trimester
→ Blood tests: Platelets, liver, kidney
→ Baby monitoring: NST, ultrasound growth`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER: Normal pregnancy swelling harmless hai.
But SUDDEN swelling + headache + vision changes = PREECLAMPSIA
= MEDICAL EMERGENCY. Call doctor IMMEDIATELY.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Sudden severe headache — not going with paracetamol` },
      { severity: "RED", text: `Vision changes — blurry, spots, flashing lights` },
      { severity: "RED", text: `Upper right abdominal pain — liver involvement` },
      { severity: "RED", text: `Sudden face/hand swelling — overnight` },
      { severity: "RED", text: `Seizure — ECLAMPSIA — 108 CALL — LIFE THREATENING` },
      { severity: "RED", text: `BP >160/110 at home — hospital TURANT` },
      { severity: "RED", text: `Very little urine — <500ml/24 hours — kidney issue` },
      { severity: "YELLOW", text: `BP 140-160/90-110 — call doctor — may need admission` },
      { severity: "YELLOW", text: `Rapid weight gain >1 kg/week — check BP + urine` },
      { severity: "YELLOW", text: `Headache + swelling together — urgent assessment` },
    ],
    relatedIds: [14, 8, 9, 30],
  },
  {
    id: 30,
    slug: "low-bp-dizziness",
    name: `Low Blood Pressure / Dizziness`,
    nameHi: `निम्न रक्तचाप`,
    nameGu: `ઓછું બ્લડ પ્રેશર`,
    emoji: "💫",
    category: "GENERAL_HEALTH",
    summary: `Low blood pressure (hypotension) causes dizziness, lightheadedness, and fainting — especially in young, thin women and during pregnancy. Most cases respond to hydration, salt, and treating underlying causes like anaemia.`,
    whoGetsIt: ``,
    sections: {
      overview: `Blood pressure normal se kam hona — jis wajah se brain ko
blood supply kam milta hai → chakkar, behoshi, kamzori.
Women mein common — especially young, thin women + pregnancy.

BP VALUES:
→ NORMAL: 90/60 to 120/80 mmHg
→ LOW (Hypotension): <90/60 mmHg
→ VERY LOW: <80/50 mmHg — symptoms likely
→ Some people naturally low BP — no symptoms = no problem!
→ Problem tab hai jab SYMPTOMS hon

TYPES:
ORTHOSTATIC/POSTURAL:
→ Lete ya baithe se suddenly KHADE hone pe chakkar
→ Blood quickly legs mein pool → brain supply kam
→ Most common type in young women
→ Dehydration, anaemia, medication se worse

NEURALLY MEDIATED:
→ Lamba khade rehne pe — blood pool in legs
→ Fainting in crowd, heat, long standing
→ "Vasovagal syncope" — triggers: pain, fear, blood dekhna

PREGNANCY LOW BP:
→ 1st-2nd trimester — blood vessels dilate (progesterone)
→ BP naturally drops 5-10 points — NORMAL
→ 3rd trimester — usually normalizes
→ Lying flat on back — uterus compresses vena cava → sudden drop

CAUSES IN WOMEN:
→ DEHYDRATION — #1 cause — paani kam
→ ANAEMIA — Hb low = less oxygen carrying capacity
→ PREGNANCY — hormonal blood vessel dilation
→ MEDICATIONS: BP meds, antidepressants, diuretics
→ THYROID: Hypothyroid — low BP + low heart rate
→ ADRENAL: Adrenal insufficiency (rare)
→ EATING DISORDERS: Malnutrition
→ PROLONGED BED REST: Deconditioning
→ HEAT: Hot weather — blood vessels dilate

SYMPTOMS:
→ Chakkar aana (dizziness) — #1 complaint
→ Lightheadedness — especially standing up
→ Behoshi / fainting — if severe
→ Blurred vision — temporarily
→ Nausea — brain blood supply kam
→ Fatigue / weakness — chronic
→ Difficulty concentrating
→ Cold, clammy skin
→ Pale appearance
→ Rapid shallow breathing`,
      gharelu: `⚡ IMMEDIATE RELIEF (Jab chakkar aaye):

1. BAITH JAO / LET JAO — TURANT
   → Khade ho aur chakkar aaya → baith jao ya let jao
   → Pair upar karo — blood brain ko
   → 5-10 min rest — phir DHEERE uthna
   → Fall prevent karna SABSE important
   → ✅ #1 safety measure

2. NAMAK-CHEENI PAANI (ORS equivalent)
   → 1 glass paani + chutki namak + chutki cheeni
   → Ya nimbu + namak + shahad + paani
   → Ya readymade ORS packet
   → Electrolytes + fluid — BP quickly restore
   → ✅ Safe — pregnancy bhi

3. COFFEE / CHAI — Caffeine boost
   → 1 cup strong chai ya coffee
   → Caffeine = blood vessels constrict = BP up
   → Temporary but effective
   → ⚠️ Pregnancy: 1-2 cups max

4. KALA NAMAK + NIMBU (Black Salt + Lemon)
   → Garam paani mein — pinch kala namak + nimbu
   → Sodium = blood volume support
   → ✅ Safe

5. KISHMISH / RAISINS (किशमिश / કિસમિસ)
   → 8-10 kishmish raat ko paani mein bhigao
   → Subah khaao + paani piyo — khali pet
   → Traditional low BP remedy — adrenal support
   → Iron + natural sugar — energy
   → ✅ Safe in pregnancy

6. CHUKANDAR / BEETROOT (चुकंदर / બીટ)
   → 1 glass beetroot juice daily
   → Nitric oxide — blood flow improve
   → Iron — anaemia fix
   → BP normalize (raises low, may lower high — smart food)
   → ✅ Safe in pregnancy

7. TULSI LEAVES — 8-10 daily
   → Chabao subah khali pet
   → Adaptogen — BP normalize
   → Potassium, magnesium, Vitamin C
   → ✅ Safe

8. BADAM (ALMONDS) PASTE
   → 5-6 badam raat ko bhigao
   → Subah paste banao + doodh mein piyo
   → Nutrient dense — sustained energy
   → ✅ Safe in pregnancy

🥗 DIET FOR LOW BP:
→ SALT: Don't restrict — LOW BP mein salt ZARURI hai
  (Only HIGH BP patients ko kam salt chahiye)
→ WATER: 3L+ daily — dehydration = #1 cause
→ SMALL FREQUENT MEALS: Large meals = blood to stomach = dizziness
→ IRON RICH: If anaemic — fix anaemia first (Condition #5)
→ CARBS moderate: Low GI — blood sugar stable
→ VITAMIN B12: Deficiency = low BP possible
→ AVOID: Alcohol — blood vessels dilate further
→ AVOID: Large heavy meals — blood pools in gut
→ AVOID: Hot baths/showers long — vasodilation

LIFESTYLE:
→ STAND SLOWLY: Lete → baitho → 30 sec → khade — gradual
→ CROSS LEGS: Standing mein — venous return improve
→ COMPRESSION STOCKINGS: Prevent blood pooling in legs
→ ELEVATE HEAD: Sleep mein head slightly elevated
→ EXERCISE: Regular — deconditioning prevent
→ AVOID: Long standing — shift weight, move around`,
      ayurveda: `AYURVEDIC UNDERSTANDING:
Low BP = Vata dushti + Rasa dhatu kshaya (blood plasma depletion).
Agni mandya → poor nutrition absorption → weak Rasa dhatu.
Treatment: Rasayana (rejuvenation) + Vata shamak + Brimhana (nourishing).

🌿 HERBS:

1. ASHWAGANDHA — ★ BEST ADAPTOGEN FOR LOW BP
   → 500mg-1g doodh mein — 2 baar
   → Adaptogen — normalizes BP (raises if low)
   → Cortisol balance — adrenal support
   → Strength + energy — fatigue fix
   → Brand: KSM-66 ₹400-600 | Himalaya ₹200-300
   → 🤰: ❌ AVOID
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

2. MULETHI / LICORICE (मुलेठी / જેઠીમધ) — ★ RAISES BP
   → Small piece chabao — din mein 1-2 baar
   → Ya 1/4 tsp powder shahad ke saath
   → Glycyrrhizin = RAISES blood pressure (retains sodium)
   → ⚠️ THIS IS THE ONE HERB THAT RELIABLY RAISES BP
   → ⚠️ HIGH BP patients mein AVOID (raises BP)
   → 🤰: ⚠️ Very small amounts only — excess risky
   → Duration: Short courses — not long term continuous
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

3. SHATAVARI — Nourishing + Rasa dhatu builder
   → 1 tsp doodh mein — 2 baar
   → Nutritive — weakness fix
   → ✅ Safe in pregnancy
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

4. GUDUCHI / GILOY — Immune + adaptogen
   → 500mg 2 baar
   → Overall strength + vitality
   → Brand: Himalaya ₹120-180
   → ⚠️ Bina Vaidya/Doctor ki salah ke mat lo.

📦 FORMULATIONS:
5. DRAKSHARISHTA — 15-20ml + paani, 2 baar after food
   → Grape-based tonic — blood builder + energizer
   → Brand: Dabur ₹120-170/450ml
   → ✅ Safe
6. CHYAWANPRASH — 1-2 tsp daily
   → Rasayana — overall vitality boost
   → ✅ Safe for all ages — pregnancy bhi

AYURVEDIC DIET:
→ Warm, nourishing, oily food — ghee, milk, nuts
→ Doodh + badam + kesar — daily tonic
→ Dates + ghee — energy bomb
→ Salt adequate — don't reduce in low BP
→ Regular meal timing — skip mat karo

⚠️ Bina Vaidya/Doctor ki salah ke mat lo.`,
      modern: `💊 FIRST — FIND THE CAUSE:
→ Anaemia? → Fix iron (Condition #5) — #1 treatable cause
→ Dehydration? → Increase fluids
→ Medication? → Adjust with doctor
→ Thyroid? → TSH check
→ Pregnancy? → Usually normal — monitor

💊 NON-MEDICINE (Usually enough):
→ Increase salt intake — 6-10g/day (opposite of high BP advice!)
→ Increase fluids — 3L+ daily
→ Compression stockings
→ Physical maneuvers: Leg crossing, squatting, calf raises
→ Coffee/Caffeine — strategic use

💊 MEDICATIONS (Severe — doctor only):

1. FLUDROCORTISONE 0.1mg
   Brand: Florinef ₹200-400 (imported)
   → Mineralocorticoid — sodium + water retention → BP up
   → 0.1mg daily — doctor adjusts
   → 🤰: ⚠️ Doctor decides — risk-benefit
   → SIDE EFFECTS: Swelling, potassium low, headache
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

2. MIDODRINE 2.5-10mg
   Brand: Gutron ₹150-300
   → Alpha-agonist — blood vessels constrict → BP up
   → 2.5-10mg 2-3 times daily
   → Take: Morning + afternoon (NOT bedtime — supine hypertension)
   → 🤰: ⚠️ Limited data — specialist decides
   → SIDE EFFECTS: Scalp tingling, goosebumps, urinary retention
   → ⚠️ Doctor ki prescription ke bina medicine mat lena.

💊 SUPPLEMENTS:

3. IRON — If anaemic (Hb < 12)
   → Details in Condition #5
   → Fix anaemia = fix dizziness in many cases
   → 🤰: ✅ Essential

4. VITAMIN B12 — If deficient (vegetarians!)
   → 1500mcg methylcobalamin daily
   → Deficiency = anaemia = low BP + dizziness
   → GET TESTED — very common in Indian vegetarians
   → 🤰: ✅ Safe

5. SALT TABLETS — (For severe orthostatic hypotension)
   → Sodium chloride tablets
   → Doctor prescribed — dose specific
   → 🤰: ⚠️ Careful — excess = edema

💊 TESTS:
→ BP lying, sitting, standing — orthostatic check
  (Drop >20 systolic on standing = orthostatic hypotension)
→ CBC — anaemia
→ Iron studies — Ferritin
→ Vitamin B12 — deficiency
→ Thyroid — TSH
→ Blood sugar — hypoglycemia rule out
→ ECG — heart rhythm check (if fainting)
→ Tilt table test — if recurrent fainting`,
      disclaimer: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER:
Most low BP harmless hai — just uncomfortable.
But FAINTING can cause INJURY — falls, head trauma.
Pregnancy mein low BP + dizziness = FALL RISK — careful.
Recurrent fainting needs proper investigation.
NutriMama medical prescription provide NAHI karta.`,
    },
    emergency: [
      { severity: "RED", text: `Fainting + not waking up quickly — 108 CALL` },
      { severity: "RED", text: `Fainting + chest pain — cardiac issue possible` },
      { severity: "RED", text: `Fainting + head injury from fall — hospital` },
      { severity: "RED", text: `Pregnancy + fainting + bleeding — emergency` },
      { severity: "RED", text: `BP <70/40 — SHOCK — hospital immediately` },
      { severity: "YELLOW", text: `Recurrent fainting episodes — cardiology assessment` },
      { severity: "YELLOW", text: `Dizziness + extreme fatigue — anaemia/thyroid check` },
      { severity: "YELLOW", text: `Pregnancy + persistent dizziness — doctor inform` },
    ],
    relatedIds: [5, 4, 16, 18],
  },
];

export const CONDITIONS_BY_SLUG: Record<string, Condition> = Object.fromEntries(
  CONDITIONS.map((c) => [c.slug, c]),
);

export const CONDITIONS_BY_ID: Record<number, Condition> = Object.fromEntries(
  CONDITIONS.map((c) => [c.id, c]),
);
