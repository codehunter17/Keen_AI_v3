// Indian food database — curated for offline meal logging.
// Source: ICMR-NIN Indian Food Composition Tables 2017 + 2020.
// Per-serving values (typical Indian portion), not per-100g.
//
// Coverage: ~120 items across grains, dals, vegetables, dairy, sweets,
// regional dishes (Punjabi, Bengali, South, Gujarati, Maharashtrian),
// snacks, beverages, fruits.
//
// This file ships in the bundle. On first PWA boot we load it into
// IndexedDB so search works offline forever.

export interface Food {
  id: string;             // stable slug
  name: string;           // English name
  hi?: string;            // Hindi name (Devanagari)
  category:
    | "GRAIN"
    | "DAL"
    | "VEGGIE"
    | "FRUIT"
    | "DAIRY"
    | "MEAT_FISH_EGG"
    | "SWEET"
    | "SNACK"
    | "BEVERAGE"
    | "REGIONAL"
    | "SUPPLEMENT";
  servingLabel: string;   // e.g. "1 roti (40g)", "1 katori (150ml)"
  servingGrams: number;
  // Macros per serving (already multiplied — what user actually eats)
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  // Key micros for women's health
  iron_mg: number;
  calcium_mg: number;
  // Optional — leave undefined if not material
  folate_mcg?: number;
  vitC_mg?: number;
  // Region tags help recommend what's locally common
  regions?: string[];
  // Search aliases (typos, romanized Hindi)
  aliases?: string[];
}

export const FOOD_DB: Food[] = [
  // ── GRAINS / ROTIS ───────────────────────────────────────
  { id: "wheat-roti", name: "Wheat roti", hi: "गेहूँ की रोटी", category: "GRAIN", servingLabel: "1 roti (40g)", servingGrams: 40, kcal: 120, protein_g: 3.5, carbs_g: 23, fat_g: 1, fiber_g: 2.6, iron_mg: 1.2, calcium_mg: 16, aliases: ["chapati", "phulka", "fulka", "roti", "atta roti"] },
  { id: "bajra-roti", name: "Bajra roti", hi: "बाजरे की रोटी", category: "GRAIN", servingLabel: "1 roti (50g)", servingGrams: 50, kcal: 165, protein_g: 5.5, carbs_g: 31, fat_g: 2.4, fiber_g: 4.4, iron_mg: 4.0, calcium_mg: 21, regions: ["rajasthan", "north"], aliases: ["pearl millet roti", "bajra roti"] },
  { id: "jowar-roti", name: "Jowar roti", hi: "ज्वार की रोटी", category: "GRAIN", servingLabel: "1 roti (45g)", servingGrams: 45, kcal: 150, protein_g: 4.5, carbs_g: 31, fat_g: 1.5, fiber_g: 4.2, iron_mg: 1.8, calcium_mg: 12, regions: ["maharashtra", "south"], aliases: ["sorghum roti", "jonna roti"] },
  { id: "ragi-roti", name: "Ragi roti", hi: "रागी की रोटी", category: "GRAIN", servingLabel: "1 roti (50g)", servingGrams: 50, kcal: 160, protein_g: 3.7, carbs_g: 33, fat_g: 1.0, fiber_g: 3.6, iron_mg: 1.9, calcium_mg: 172, regions: ["south", "karnataka"], aliases: ["ragi roti", "nachni roti", "finger millet roti"] },
  { id: "makki-roti", name: "Makki di roti", hi: "मक्की की रोटी", category: "GRAIN", servingLabel: "1 roti (50g)", servingGrams: 50, kcal: 175, protein_g: 4.5, carbs_g: 30, fat_g: 4.5, fiber_g: 3.7, iron_mg: 1.0, calcium_mg: 5, regions: ["punjab"], aliases: ["maize roti", "corn roti"] },
  { id: "missi-roti", name: "Missi roti", hi: "मिस्सी रोटी", category: "GRAIN", servingLabel: "1 roti (50g)", servingGrams: 50, kcal: 165, protein_g: 7, carbs_g: 27, fat_g: 3.5, fiber_g: 4, iron_mg: 2.4, calcium_mg: 38, regions: ["punjab", "rajasthan"] },
  { id: "thepla", name: "Thepla", hi: "थेपला", category: "GRAIN", servingLabel: "1 thepla (35g)", servingGrams: 35, kcal: 130, protein_g: 3.5, carbs_g: 18, fat_g: 5, fiber_g: 2.4, iron_mg: 1.5, calcium_mg: 35, regions: ["gujarat"] },
  { id: "paratha-plain", name: "Plain paratha", hi: "सादा परांठा", category: "GRAIN", servingLabel: "1 paratha (60g)", servingGrams: 60, kcal: 200, protein_g: 4.5, carbs_g: 28, fat_g: 8, fiber_g: 2.8, iron_mg: 1.4, calcium_mg: 20 },
  { id: "paratha-aloo", name: "Aloo paratha", hi: "आलू परांठा", category: "GRAIN", servingLabel: "1 paratha (90g)", servingGrams: 90, kcal: 280, protein_g: 6, carbs_g: 38, fat_g: 11, fiber_g: 3.5, iron_mg: 1.6, calcium_mg: 28 },
  { id: "paratha-paneer", name: "Paneer paratha", hi: "पनीर परांठा", category: "GRAIN", servingLabel: "1 paratha (90g)", servingGrams: 90, kcal: 320, protein_g: 13, carbs_g: 32, fat_g: 16, fiber_g: 3, iron_mg: 1.8, calcium_mg: 250 },

  { id: "rice-white", name: "White rice (cooked)", hi: "चावल", category: "GRAIN", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 195, protein_g: 4, carbs_g: 43, fat_g: 0.4, fiber_g: 0.6, iron_mg: 0.4, calcium_mg: 15 },
  { id: "rice-brown", name: "Brown rice (cooked)", hi: "ब्राउन चावल", category: "GRAIN", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 215, protein_g: 5, carbs_g: 45, fat_g: 1.6, fiber_g: 2.7, iron_mg: 0.8, calcium_mg: 16 },
  { id: "biryani-veg", name: "Veg biryani", hi: "वेज बिरयानी", category: "REGIONAL", servingLabel: "1 plate (250g)", servingGrams: 250, kcal: 380, protein_g: 9, carbs_g: 62, fat_g: 11, fiber_g: 4, iron_mg: 2.1, calcium_mg: 80 },
  { id: "khichdi", name: "Dal khichdi", hi: "खिचड़ी", category: "REGIONAL", servingLabel: "1 katori (180g)", servingGrams: 180, kcal: 250, protein_g: 9, carbs_g: 42, fat_g: 5, fiber_g: 3.6, iron_mg: 2.3, calcium_mg: 32 },
  { id: "pulao-veg", name: "Veg pulao", hi: "पुलाव", category: "GRAIN", servingLabel: "1 katori (160g)", servingGrams: 160, kcal: 240, protein_g: 5, carbs_g: 40, fat_g: 7, fiber_g: 2.4, iron_mg: 1.0, calcium_mg: 30 },
  { id: "poha", name: "Poha", hi: "पोहा", category: "GRAIN", servingLabel: "1 katori (120g)", servingGrams: 120, kcal: 175, protein_g: 4, carbs_g: 30, fat_g: 4.5, fiber_g: 1.6, iron_mg: 2.6, calcium_mg: 15, regions: ["maharashtra"] },
  { id: "upma", name: "Upma", hi: "उपमा", category: "GRAIN", servingLabel: "1 katori (140g)", servingGrams: 140, kcal: 200, protein_g: 5, carbs_g: 31, fat_g: 6, fiber_g: 2, iron_mg: 1.2, calcium_mg: 24, regions: ["south"] },
  { id: "idli", name: "Idli", hi: "इडली", category: "REGIONAL", servingLabel: "2 idlis (100g)", servingGrams: 100, kcal: 130, protein_g: 4, carbs_g: 27, fat_g: 0.5, fiber_g: 1.5, iron_mg: 1.0, calcium_mg: 20, regions: ["south"] },
  { id: "dosa-plain", name: "Plain dosa", hi: "डोसा", category: "REGIONAL", servingLabel: "1 dosa (80g)", servingGrams: 80, kcal: 165, protein_g: 4, carbs_g: 27, fat_g: 4.5, fiber_g: 1.2, iron_mg: 1.1, calcium_mg: 18, regions: ["south"] },
  { id: "dosa-masala", name: "Masala dosa", hi: "मसाला डोसा", category: "REGIONAL", servingLabel: "1 dosa (180g)", servingGrams: 180, kcal: 290, protein_g: 6, carbs_g: 45, fat_g: 9, fiber_g: 3.4, iron_mg: 1.8, calcium_mg: 35, regions: ["south"] },
  { id: "uttapam", name: "Uttapam", hi: "उत्तपम", category: "REGIONAL", servingLabel: "1 piece (120g)", servingGrams: 120, kcal: 195, protein_g: 5, carbs_g: 32, fat_g: 5, fiber_g: 2, iron_mg: 1.2, calcium_mg: 28, regions: ["south"] },
  { id: "rava-idli", name: "Rava idli", hi: "रवा इडली", category: "REGIONAL", servingLabel: "2 idlis (120g)", servingGrams: 120, kcal: 175, protein_g: 5, carbs_g: 30, fat_g: 3.5, fiber_g: 1.8, iron_mg: 1.4, calcium_mg: 30, regions: ["south"] },
  { id: "appam", name: "Appam", hi: "अप्पम", category: "REGIONAL", servingLabel: "1 piece (60g)", servingGrams: 60, kcal: 110, protein_g: 2, carbs_g: 22, fat_g: 1.5, fiber_g: 0.6, iron_mg: 0.3, calcium_mg: 5, regions: ["kerala"] },
  { id: "puri", name: "Puri", hi: "पूरी", category: "GRAIN", servingLabel: "1 puri (35g)", servingGrams: 35, kcal: 130, protein_g: 3, carbs_g: 17, fat_g: 6, fiber_g: 1.8, iron_mg: 0.9, calcium_mg: 12 },

  // ── DALS / LEGUMES ───────────────────────────────────────
  { id: "dal-arhar", name: "Arhar dal", hi: "अरहर दाल", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 165, protein_g: 9.5, carbs_g: 22, fat_g: 4, fiber_g: 4.8, iron_mg: 1.8, calcium_mg: 30, aliases: ["toor dal", "tuvar dal", "yellow dal"] },
  { id: "dal-moong", name: "Moong dal", hi: "मूँग दाल", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 145, protein_g: 9, carbs_g: 22, fat_g: 2.5, fiber_g: 3.4, iron_mg: 2.4, calcium_mg: 28 },
  { id: "dal-masoor", name: "Masoor dal", hi: "मसूर दाल", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 160, protein_g: 10, carbs_g: 22, fat_g: 2.6, fiber_g: 4, iron_mg: 3.0, calcium_mg: 26, folate_mcg: 145 },
  { id: "dal-chana", name: "Chana dal", hi: "चना दाल", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 200, protein_g: 11, carbs_g: 28, fat_g: 5, fiber_g: 6, iron_mg: 3.5, calcium_mg: 50 },
  { id: "dal-urad", name: "Urad dal", hi: "उड़द दाल", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 175, protein_g: 11, carbs_g: 24, fat_g: 3, fiber_g: 5, iron_mg: 3.0, calcium_mg: 60 },
  { id: "rajma", name: "Rajma curry", hi: "राजमा", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 230, protein_g: 12, carbs_g: 32, fat_g: 6, fiber_g: 8, iron_mg: 3.6, calcium_mg: 60, regions: ["punjab", "north"] },
  { id: "chole", name: "Chole / chickpea curry", hi: "छोले", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 240, protein_g: 11, carbs_g: 32, fat_g: 7, fiber_g: 7, iron_mg: 3.2, calcium_mg: 70, regions: ["punjab"], aliases: ["chana masala", "chickpea curry"] },
  { id: "sambhar", name: "Sambhar", hi: "सांभर", category: "REGIONAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 130, protein_g: 6, carbs_g: 18, fat_g: 4, fiber_g: 4.5, iron_mg: 2.0, calcium_mg: 45, regions: ["south"] },
  { id: "dal-makhani", name: "Dal makhani", hi: "दाल मखनी", category: "DAL", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 290, protein_g: 11, carbs_g: 28, fat_g: 14, fiber_g: 6, iron_mg: 3.4, calcium_mg: 75, regions: ["punjab"] },
  { id: "dalma", name: "Dalma", hi: "दलमा", category: "REGIONAL", servingLabel: "1 katori (180g)", servingGrams: 180, kcal: 180, protein_g: 9, carbs_g: 24, fat_g: 5, fiber_g: 5, iron_mg: 2.8, calcium_mg: 55, regions: ["odisha"] },
  { id: "sprouts-mixed", name: "Mixed sprouts", hi: "अंकुरित", category: "DAL", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 110, protein_g: 7, carbs_g: 18, fat_g: 1, fiber_g: 4.5, iron_mg: 2.5, calcium_mg: 40, vitC_mg: 14 },
  { id: "moong-chilla", name: "Moong dal chilla", hi: "मूंग दाल चिल्ला", category: "DAL", servingLabel: "1 chilla (60g)", servingGrams: 60, kcal: 120, protein_g: 7, carbs_g: 14, fat_g: 3.5, fiber_g: 2.5, iron_mg: 1.8, calcium_mg: 25 },
  { id: "sattu-drink", name: "Sattu sherbet", hi: "सत्तू", category: "BEVERAGE", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 180, protein_g: 12, carbs_g: 24, fat_g: 3, fiber_g: 5, iron_mg: 4.0, calcium_mg: 30, regions: ["bihar", "north"] },
  { id: "misal-pav", name: "Misal pav", hi: "मिसल पाव", category: "REGIONAL", servingLabel: "1 plate (300g)", servingGrams: 300, kcal: 380, protein_g: 13, carbs_g: 50, fat_g: 14, fiber_g: 8, iron_mg: 4.2, calcium_mg: 90, regions: ["maharashtra"] },
  { id: "usal", name: "Usal", hi: "उसल", category: "REGIONAL", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 220, protein_g: 11, carbs_g: 28, fat_g: 7, fiber_g: 7, iron_mg: 3.5, calcium_mg: 70, regions: ["maharashtra"] },

  // ── VEGGIES ──────────────────────────────────────────────
  { id: "palak-saag", name: "Palak / spinach saag", hi: "पालक", category: "VEGGIE", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 60, protein_g: 3, carbs_g: 4, fat_g: 3.5, fiber_g: 2.6, iron_mg: 2.7, calcium_mg: 100, folate_mcg: 140, vitC_mg: 28 },
  { id: "methi-saag", name: "Methi saag", hi: "मेथी साग", category: "VEGGIE", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 80, protein_g: 4.4, carbs_g: 6, fat_g: 4, fiber_g: 4.8, iron_mg: 4.2, calcium_mg: 175, folate_mcg: 65, vitC_mg: 30 },
  { id: "sarson-saag", name: "Sarson da saag", hi: "सरसों का साग", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 110, protein_g: 4, carbs_g: 8, fat_g: 6, fiber_g: 5, iron_mg: 2.0, calcium_mg: 145, regions: ["punjab"] },
  { id: "bhindi-fry", name: "Bhindi fry", hi: "भिंडी", category: "VEGGIE", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 80, protein_g: 2, carbs_g: 8, fat_g: 4.5, fiber_g: 3.5, iron_mg: 0.8, calcium_mg: 75, vitC_mg: 21 },
  { id: "gobhi-aloo", name: "Aloo gobhi", hi: "आलू गोभी", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 165, protein_g: 4, carbs_g: 22, fat_g: 7, fiber_g: 4, iron_mg: 1.4, calcium_mg: 30 },
  { id: "baingan-bharta", name: "Baingan bharta", hi: "बैंगन भरता", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 145, protein_g: 3, carbs_g: 12, fat_g: 9, fiber_g: 5, iron_mg: 1.0, calcium_mg: 28 },
  { id: "lauki-curry", name: "Lauki curry", hi: "लौकी सब्ज़ी", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 95, protein_g: 1.5, carbs_g: 8, fat_g: 5, fiber_g: 1.6, iron_mg: 0.4, calcium_mg: 30 },
  { id: "tinda", name: "Tinda sabzi", hi: "टिंडा", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 100, protein_g: 2, carbs_g: 9, fat_g: 5.5, fiber_g: 2.5, iron_mg: 0.8, calcium_mg: 25 },
  { id: "drumstick-sambhar", name: "Drumstick sambhar", hi: "मुनगा सांभर", category: "VEGGIE", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 140, protein_g: 6, carbs_g: 17, fat_g: 4.5, fiber_g: 4.8, iron_mg: 3.0, calcium_mg: 95, regions: ["south"] },
  { id: "carrot", name: "Carrot (raw)", hi: "गाजर", category: "VEGGIE", servingLabel: "1 medium (75g)", servingGrams: 75, kcal: 30, protein_g: 0.7, carbs_g: 7, fat_g: 0.2, fiber_g: 2, iron_mg: 0.2, calcium_mg: 25 },
  { id: "beetroot", name: "Beetroot (cooked)", hi: "चुकंदर", category: "VEGGIE", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 45, protein_g: 1.7, carbs_g: 10, fat_g: 0.2, fiber_g: 2.8, iron_mg: 0.8, calcium_mg: 16, folate_mcg: 110 },
  { id: "tomato", name: "Tomato (raw)", hi: "टमाटर", category: "VEGGIE", servingLabel: "1 medium (90g)", servingGrams: 90, kcal: 18, protein_g: 0.8, carbs_g: 3.6, fat_g: 0.2, fiber_g: 1.2, iron_mg: 0.3, calcium_mg: 9, vitC_mg: 12 },
  { id: "cucumber", name: "Cucumber", hi: "खीरा", category: "VEGGIE", servingLabel: "1 medium (200g)", servingGrams: 200, kcal: 30, protein_g: 1.4, carbs_g: 7, fat_g: 0.2, fiber_g: 1, iron_mg: 0.6, calcium_mg: 32 },
  { id: "potato-aloo", name: "Aloo / potato (cooked)", hi: "आलू", category: "VEGGIE", servingLabel: "1 medium (100g)", servingGrams: 100, kcal: 95, protein_g: 2, carbs_g: 21, fat_g: 0.2, fiber_g: 1.6, iron_mg: 0.8, calcium_mg: 12 },
  { id: "onion", name: "Onion (raw)", hi: "प्याज", category: "VEGGIE", servingLabel: "1 medium (100g)", servingGrams: 100, kcal: 40, protein_g: 1.1, carbs_g: 9, fat_g: 0.1, fiber_g: 1.7, iron_mg: 0.2, calcium_mg: 23 },
  { id: "bottle-gourd", name: "Bottle gourd / dudhi", hi: "लौकी", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 18, protein_g: 0.9, carbs_g: 4, fat_g: 0.1, fiber_g: 1.5, iron_mg: 0.4, calcium_mg: 30 },
  { id: "mushroom-curry", name: "Mushroom curry", hi: "मशरूम सब्ज़ी", category: "VEGGIE", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 110, protein_g: 4, carbs_g: 8, fat_g: 7, fiber_g: 2, iron_mg: 0.8, calcium_mg: 12 },

  // ── DAIRY ────────────────────────────────────────────────
  { id: "milk-cow", name: "Cow milk", hi: "गाय का दूध", category: "DAIRY", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 150, protein_g: 8, carbs_g: 12, fat_g: 8, fiber_g: 0, iron_mg: 0.1, calcium_mg: 290 },
  { id: "milk-buffalo", name: "Buffalo milk", hi: "भैंस का दूध", category: "DAIRY", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 250, protein_g: 9.5, carbs_g: 13, fat_g: 17, fiber_g: 0, iron_mg: 0.3, calcium_mg: 320 },
  { id: "dahi", name: "Dahi / curd", hi: "दही", category: "DAIRY", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 110, protein_g: 7, carbs_g: 7, fat_g: 6, fiber_g: 0, iron_mg: 0.1, calcium_mg: 220 },
  { id: "lassi-sweet", name: "Sweet lassi", hi: "मीठी लस्सी", category: "BEVERAGE", servingLabel: "1 glass (300ml)", servingGrams: 300, kcal: 220, protein_g: 7, carbs_g: 28, fat_g: 8, fiber_g: 0, iron_mg: 0.2, calcium_mg: 290, regions: ["punjab"] },
  { id: "chaas", name: "Chaas / buttermilk", hi: "छाछ", category: "BEVERAGE", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 60, protein_g: 4, carbs_g: 6, fat_g: 1.5, fiber_g: 0, iron_mg: 0.1, calcium_mg: 130 },
  { id: "paneer", name: "Paneer", hi: "पनीर", category: "DAIRY", servingLabel: "50g", servingGrams: 50, kcal: 130, protein_g: 9, carbs_g: 1.5, fat_g: 10, fiber_g: 0, iron_mg: 0.2, calcium_mg: 240 },
  { id: "paneer-bhurji", name: "Paneer bhurji", hi: "पनीर भुर्जी", category: "DAIRY", servingLabel: "1 katori (120g)", servingGrams: 120, kcal: 280, protein_g: 16, carbs_g: 6, fat_g: 22, fiber_g: 1.4, iron_mg: 1.2, calcium_mg: 350 },
  { id: "ghee", name: "Ghee", hi: "घी", category: "DAIRY", servingLabel: "1 tsp (5g)", servingGrams: 5, kcal: 45, protein_g: 0, carbs_g: 0, fat_g: 5, fiber_g: 0, iron_mg: 0, calcium_mg: 0 },
  { id: "butter", name: "Butter", hi: "मक्खन", category: "DAIRY", servingLabel: "1 tsp (5g)", servingGrams: 5, kcal: 36, protein_g: 0, carbs_g: 0, fat_g: 4, fiber_g: 0, iron_mg: 0, calcium_mg: 1 },
  { id: "cheese-slice", name: "Cheese slice", hi: "चीज़", category: "DAIRY", servingLabel: "1 slice (20g)", servingGrams: 20, kcal: 70, protein_g: 4, carbs_g: 1, fat_g: 5.5, fiber_g: 0, iron_mg: 0.1, calcium_mg: 120 },

  // ── MEAT / FISH / EGG ────────────────────────────────────
  { id: "egg-boiled", name: "Boiled egg", hi: "उबला अंडा", category: "MEAT_FISH_EGG", servingLabel: "1 large egg (50g)", servingGrams: 50, kcal: 78, protein_g: 6.5, carbs_g: 0.6, fat_g: 5.3, fiber_g: 0, iron_mg: 0.9, calcium_mg: 28 },
  { id: "egg-bhurji", name: "Egg bhurji", hi: "अंडा भुर्जी", category: "MEAT_FISH_EGG", servingLabel: "2 eggs (140g)", servingGrams: 140, kcal: 230, protein_g: 14, carbs_g: 4, fat_g: 18, fiber_g: 1.4, iron_mg: 2.4, calcium_mg: 75 },
  { id: "chicken-curry", name: "Chicken curry", hi: "चिकन करी", category: "MEAT_FISH_EGG", servingLabel: "1 katori (180g)", servingGrams: 180, kcal: 280, protein_g: 22, carbs_g: 6, fat_g: 19, fiber_g: 1.4, iron_mg: 2.4, calcium_mg: 35 },
  { id: "chicken-tandoori", name: "Tandoori chicken", hi: "तंदूरी चिकन", category: "MEAT_FISH_EGG", servingLabel: "1 piece (100g)", servingGrams: 100, kcal: 200, protein_g: 26, carbs_g: 2, fat_g: 10, fiber_g: 0.4, iron_mg: 1.5, calcium_mg: 22 },
  { id: "fish-curry", name: "Fish curry", hi: "मछली करी", category: "MEAT_FISH_EGG", servingLabel: "1 katori (180g)", servingGrams: 180, kcal: 240, protein_g: 25, carbs_g: 5, fat_g: 13, fiber_g: 0.8, iron_mg: 2.0, calcium_mg: 60, regions: ["bengal", "kerala"] },
  { id: "mutton-curry", name: "Mutton curry", hi: "मटन करी", category: "MEAT_FISH_EGG", servingLabel: "1 katori (180g)", servingGrams: 180, kcal: 320, protein_g: 24, carbs_g: 5, fat_g: 22, fiber_g: 1, iron_mg: 3.4, calcium_mg: 30 },
  { id: "prawn-curry", name: "Prawn curry", hi: "झींगा करी", category: "MEAT_FISH_EGG", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 210, protein_g: 22, carbs_g: 4, fat_g: 12, fiber_g: 0.6, iron_mg: 2.4, calcium_mg: 80 },

  // ── FRUITS ───────────────────────────────────────────────
  { id: "banana", name: "Banana", hi: "केला", category: "FRUIT", servingLabel: "1 medium (115g)", servingGrams: 115, kcal: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4, fiber_g: 3.1, iron_mg: 0.3, calcium_mg: 6, vitC_mg: 10 },
  { id: "apple", name: "Apple", hi: "सेब", category: "FRUIT", servingLabel: "1 medium (180g)", servingGrams: 180, kcal: 95, protein_g: 0.5, carbs_g: 25, fat_g: 0.3, fiber_g: 4.4, iron_mg: 0.2, calcium_mg: 11, vitC_mg: 8 },
  { id: "orange", name: "Orange", hi: "संतरा", category: "FRUIT", servingLabel: "1 medium (130g)", servingGrams: 130, kcal: 60, protein_g: 1.2, carbs_g: 15, fat_g: 0.2, fiber_g: 3, iron_mg: 0.1, calcium_mg: 52, vitC_mg: 70 },
  { id: "papaya", name: "Papaya", hi: "पपीता", category: "FRUIT", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 60, protein_g: 0.7, carbs_g: 15, fat_g: 0.4, fiber_g: 2.5, iron_mg: 0.4, calcium_mg: 30, vitC_mg: 90 },
  { id: "pomegranate", name: "Pomegranate seeds", hi: "अनार", category: "FRUIT", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 125, protein_g: 2.5, carbs_g: 28, fat_g: 1.8, fiber_g: 6, iron_mg: 0.5, calcium_mg: 15, vitC_mg: 17 },
  { id: "guava", name: "Guava", hi: "अमरूद", category: "FRUIT", servingLabel: "1 medium (150g)", servingGrams: 150, kcal: 100, protein_g: 3.8, carbs_g: 22, fat_g: 1.4, fiber_g: 8, iron_mg: 0.4, calcium_mg: 27, vitC_mg: 280 },
  { id: "mango", name: "Mango", hi: "आम", category: "FRUIT", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 100, protein_g: 1.4, carbs_g: 25, fat_g: 0.6, fiber_g: 2.6, iron_mg: 0.2, calcium_mg: 17, vitC_mg: 55 },
  { id: "watermelon", name: "Watermelon", hi: "तरबूज", category: "FRUIT", servingLabel: "1 katori (150g)", servingGrams: 150, kcal: 45, protein_g: 1, carbs_g: 11, fat_g: 0.2, fiber_g: 0.6, iron_mg: 0.4, calcium_mg: 11, vitC_mg: 12 },
  { id: "dates", name: "Dates / khajur", hi: "खजूर", category: "FRUIT", servingLabel: "5 dates (40g)", servingGrams: 40, kcal: 110, protein_g: 0.9, carbs_g: 30, fat_g: 0.2, fiber_g: 2.7, iron_mg: 0.4, calcium_mg: 16 },
  { id: "amla", name: "Amla / Indian gooseberry", hi: "आँवला", category: "FRUIT", servingLabel: "1 medium (50g)", servingGrams: 50, kcal: 22, protein_g: 0.5, carbs_g: 5, fat_g: 0.3, fiber_g: 2.5, iron_mg: 0.2, calcium_mg: 12, vitC_mg: 300 },

  // ── SWEETS ───────────────────────────────────────────────
  { id: "gur-jaggery", name: "Gur / jaggery", hi: "गुड़", category: "SWEET", servingLabel: "1 piece (15g)", servingGrams: 15, kcal: 56, protein_g: 0.1, carbs_g: 14, fat_g: 0.05, fiber_g: 0, iron_mg: 1.7, calcium_mg: 12 },
  { id: "til-ladoo", name: "Til ladoo", hi: "तिल लड्डू", category: "SWEET", servingLabel: "1 ladoo (20g)", servingGrams: 20, kcal: 105, protein_g: 2, carbs_g: 12, fat_g: 5.5, fiber_g: 1.4, iron_mg: 1.8, calcium_mg: 175 },
  { id: "gulab-jamun", name: "Gulab jamun", hi: "गुलाब जामुन", category: "SWEET", servingLabel: "1 piece (40g)", servingGrams: 40, kcal: 150, protein_g: 2, carbs_g: 22, fat_g: 6, fiber_g: 0.4, iron_mg: 0.3, calcium_mg: 30 },
  { id: "rasgulla", name: "Rasgulla", hi: "रसगुल्ला", category: "SWEET", servingLabel: "1 piece (50g)", servingGrams: 50, kcal: 130, protein_g: 4, carbs_g: 23, fat_g: 2.5, fiber_g: 0, iron_mg: 0.1, calcium_mg: 65, regions: ["bengal"] },
  { id: "halwa-suji", name: "Suji halwa", hi: "सूजी हलवा", category: "SWEET", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 320, protein_g: 4, carbs_g: 38, fat_g: 17, fiber_g: 1.4, iron_mg: 1.0, calcium_mg: 35 },
  { id: "kheer", name: "Kheer", hi: "खीर", category: "SWEET", servingLabel: "1 katori (180ml)", servingGrams: 180, kcal: 250, protein_g: 7, carbs_g: 36, fat_g: 9, fiber_g: 0.4, iron_mg: 0.6, calcium_mg: 220 },
  { id: "mishti-doi", name: "Mishti doi", hi: "मिष्टी दोई", category: "SWEET", servingLabel: "1 katori (100g)", servingGrams: 100, kcal: 145, protein_g: 4, carbs_g: 22, fat_g: 4, fiber_g: 0, iron_mg: 0.1, calcium_mg: 145, regions: ["bengal"] },

  // ── SNACKS ───────────────────────────────────────────────
  { id: "samosa", name: "Samosa", hi: "समोसा", category: "SNACK", servingLabel: "1 piece (60g)", servingGrams: 60, kcal: 200, protein_g: 4, carbs_g: 22, fat_g: 11, fiber_g: 2.4, iron_mg: 1.2, calcium_mg: 22 },
  { id: "pakora", name: "Pakora (mixed)", hi: "पकोड़ा", category: "SNACK", servingLabel: "5 pieces (60g)", servingGrams: 60, kcal: 220, protein_g: 5, carbs_g: 22, fat_g: 13, fiber_g: 3, iron_mg: 1.5, calcium_mg: 30 },
  { id: "dhokla", name: "Dhokla", hi: "ढोकला", category: "SNACK", servingLabel: "3 pieces (90g)", servingGrams: 90, kcal: 160, protein_g: 6, carbs_g: 24, fat_g: 4, fiber_g: 2, iron_mg: 1.6, calcium_mg: 35, regions: ["gujarat"] },
  { id: "khaman", name: "Khaman", hi: "खमण", category: "SNACK", servingLabel: "3 pieces (90g)", servingGrams: 90, kcal: 145, protein_g: 6, carbs_g: 22, fat_g: 3.5, fiber_g: 2.4, iron_mg: 1.4, calcium_mg: 30, regions: ["gujarat"] },
  { id: "vada-pav", name: "Vada pav", hi: "वडा पाव", category: "REGIONAL", servingLabel: "1 piece (130g)", servingGrams: 130, kcal: 290, protein_g: 7, carbs_g: 38, fat_g: 12, fiber_g: 4, iron_mg: 1.8, calcium_mg: 45, regions: ["maharashtra"] },
  { id: "bhel-puri", name: "Bhel puri", hi: "भेल पुरी", category: "SNACK", servingLabel: "1 plate (150g)", servingGrams: 150, kcal: 270, protein_g: 6, carbs_g: 42, fat_g: 9, fiber_g: 4.5, iron_mg: 2.2, calcium_mg: 60 },
  { id: "pani-puri", name: "Pani puri / golgappa", hi: "पानी पुरी", category: "SNACK", servingLabel: "6 puris (90g)", servingGrams: 90, kcal: 160, protein_g: 4, carbs_g: 28, fat_g: 4, fiber_g: 2.5, iron_mg: 1.4, calcium_mg: 30 },
  { id: "peanuts", name: "Peanuts (roasted)", hi: "मूँगफली", category: "SNACK", servingLabel: "1 handful (28g)", servingGrams: 28, kcal: 165, protein_g: 7, carbs_g: 6, fat_g: 14, fiber_g: 2.4, iron_mg: 1.3, calcium_mg: 26 },
  { id: "bhuna-chana", name: "Bhuna chana / roasted gram", hi: "भुना चना", category: "SNACK", servingLabel: "50g", servingGrams: 50, kcal: 175, protein_g: 9, carbs_g: 28, fat_g: 2.5, fiber_g: 7, iron_mg: 5.0, calcium_mg: 35 },
  { id: "almonds", name: "Almonds", hi: "बादाम", category: "SNACK", servingLabel: "10 pieces (12g)", servingGrams: 12, kcal: 70, protein_g: 2.5, carbs_g: 2.6, fat_g: 6, fiber_g: 1.5, iron_mg: 0.4, calcium_mg: 32 },
  { id: "cashews", name: "Cashews", hi: "काजू", category: "SNACK", servingLabel: "10 pieces (15g)", servingGrams: 15, kcal: 85, protein_g: 2.7, carbs_g: 5, fat_g: 7, fiber_g: 0.5, iron_mg: 1.0, calcium_mg: 5 },
  { id: "walnuts", name: "Walnuts", hi: "अखरोट", category: "SNACK", servingLabel: "4 halves (15g)", servingGrams: 15, kcal: 100, protein_g: 2.3, carbs_g: 2, fat_g: 10, fiber_g: 1, iron_mg: 0.4, calcium_mg: 15 },
  { id: "makhana", name: "Makhana / fox nuts", hi: "मखाना", category: "SNACK", servingLabel: "1 katori (30g)", servingGrams: 30, kcal: 100, protein_g: 3, carbs_g: 23, fat_g: 0.3, fiber_g: 4.5, iron_mg: 0.4, calcium_mg: 18 },

  // ── BEVERAGES ────────────────────────────────────────────
  { id: "chai", name: "Chai (with milk + sugar)", hi: "चाय", category: "BEVERAGE", servingLabel: "1 cup (180ml)", servingGrams: 180, kcal: 80, protein_g: 2.4, carbs_g: 11, fat_g: 3, fiber_g: 0, iron_mg: 0.05, calcium_mg: 90 },
  { id: "coffee", name: "Coffee (with milk + sugar)", hi: "कॉफी", category: "BEVERAGE", servingLabel: "1 cup (180ml)", servingGrams: 180, kcal: 70, protein_g: 2, carbs_g: 10, fat_g: 2.5, fiber_g: 0, iron_mg: 0.05, calcium_mg: 75 },
  { id: "nimbu-pani", name: "Nimbu pani / lemonade", hi: "नींबू पानी", category: "BEVERAGE", servingLabel: "1 glass (300ml)", servingGrams: 300, kcal: 60, protein_g: 0.4, carbs_g: 16, fat_g: 0, fiber_g: 0.6, iron_mg: 0.1, calcium_mg: 18, vitC_mg: 30 },
  { id: "coconut-water", name: "Coconut water", hi: "नारियल पानी", category: "BEVERAGE", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 45, protein_g: 1.7, carbs_g: 9, fat_g: 0.5, fiber_g: 2.5, iron_mg: 0.7, calcium_mg: 60 },
  { id: "amla-juice", name: "Amla juice", hi: "आँवला रस", category: "BEVERAGE", servingLabel: "30ml shot", servingGrams: 30, kcal: 15, protein_g: 0.3, carbs_g: 3, fat_g: 0.2, fiber_g: 1.4, iron_mg: 0.2, calcium_mg: 7, vitC_mg: 180 },
  { id: "beetroot-juice", name: "Beetroot + amla juice", hi: "चुकंदर-आँवला रस", category: "BEVERAGE", servingLabel: "1 glass (200ml)", servingGrams: 200, kcal: 80, protein_g: 2, carbs_g: 18, fat_g: 0.3, fiber_g: 4, iron_mg: 1.4, calcium_mg: 30, vitC_mg: 200 },
  { id: "raab", name: "Raab (millet drink)", hi: "राब", category: "BEVERAGE", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 175, protein_g: 4, carbs_g: 30, fat_g: 4, fiber_g: 3, iron_mg: 1.6, calcium_mg: 150, regions: ["rajasthan"] },
  { id: "haldi-doodh", name: "Haldi doodh / turmeric milk", hi: "हल्दी दूध", category: "BEVERAGE", servingLabel: "1 glass (250ml)", servingGrams: 250, kcal: 175, protein_g: 8, carbs_g: 14, fat_g: 9, fiber_g: 0.4, iron_mg: 0.4, calcium_mg: 295 },

  // ── SUPPLEMENTS / FORTIFIED ─────────────────────────────
  { id: "folvite", name: "Folvite 5mg (folic acid)", hi: "फोलविट", category: "SUPPLEMENT", servingLabel: "1 tablet", servingGrams: 0, kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, iron_mg: 0, calcium_mg: 0, folate_mcg: 5000 },
  { id: "orofer-xt", name: "Orofer XT (iron + folic)", hi: "ओरोफर", category: "SUPPLEMENT", servingLabel: "1 tablet", servingGrams: 0, kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, iron_mg: 100, calcium_mg: 0, folate_mcg: 1500 },
  { id: "shelcal-500", name: "Shelcal 500 (calcium + D3)", hi: "शेलकैल", category: "SUPPLEMENT", servingLabel: "1 tablet", servingGrams: 0, kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, iron_mg: 0, calcium_mg: 500 },
];

export const FOOD_DB_VERSION = "2026-05-08-v1";

// Quick search — case-insensitive across name, hi, aliases.
export function searchFoods(query: string, limit = 10): Food[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  const scored: { f: Food; score: number }[] = [];
  for (const f of FOOD_DB) {
    let score = 0;
    if (f.name.toLowerCase().startsWith(q)) score += 10;
    else if (f.name.toLowerCase().includes(q)) score += 6;
    if (f.hi && f.hi.includes(q)) score += 8;
    for (const a of f.aliases ?? []) {
      if (a.toLowerCase().startsWith(q)) score += 9;
      else if (a.toLowerCase().includes(q)) score += 5;
    }
    if (score > 0) scored.push({ f, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.f);
}
