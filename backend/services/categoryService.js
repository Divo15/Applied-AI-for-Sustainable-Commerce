/**
 * Module 1 – AI Auto-Category & Tag Generator
 *
 * Business logic sits here; the AI is asked via aiClient.callAI().
 * After the AI responds we validate/clamp values before saving to MongoDB.
 */
const { callAI } = require("./aiClient");
const CatalogResult = require("../models/CatalogResult");

/* ------------------------------------------------------------------ */
/*  Reference data (predefined category & sustainability lists)       */
/* ------------------------------------------------------------------ */
const PREDEFINED_CATEGORIES = [
  "Home & Kitchen",
  "Personal Care",
  "Fashion & Accessories",
  "Food & Beverages",
  "Stationery & Office",
  "Cleaning & Laundry",
  "Baby & Kids",
  "Pet Care",
  "Garden & Outdoor",
  "Health & Wellness",
  "Packaging & Supplies",
  "Electronics Accessories",
];

const SUSTAINABILITY_FILTERS = [
  "plastic-free",
  "compostable",
  "vegan",
  "recycled",
  "organic",
  "fair-trade",
  "biodegradable",
  "zero-waste",
  "cruelty-free",
  "locally-sourced",
  "upcycled",
  "non-toxic",
];

/* ------------------------------------------------------------------ */
/*  Generate categories + tags for a product                          */
/* ------------------------------------------------------------------ */
async function generateCategoryAndTags({
  product_name,
  product_description,
  material,
}) {
  /* ---------- Prompt design ---------- */
  const systemPrompt = `You are an AI product categorization expert for a sustainable e-commerce platform.
Given a product you MUST return valid JSON with these exact keys:
- "primary_category": one of [${PREDEFINED_CATEGORIES.map((c) => `"${c}"`).join(", ")}]
- "sub_category": a more specific sub-category string
- "seo_tags": an array of 5 to 10 SEO-optimized keyword tags
- "sustainability_filters": an array of applicable filters from [${SUSTAINABILITY_FILTERS.map((f) => `"${f}"`).join(", ")}]
- "confidence_score": a float 0-1 indicating your confidence
Be precise, grounded, and commercially practical.`;

  const userPrompt = `Product Name: ${product_name}
Description: ${product_description}${material ? `\nMaterial: ${material}` : ""}`;

  /* ---------- Call AI (with fallback) ---------- */
  const aiResult = await callAI({
    module: "module1_category_tags",
    systemPrompt,
    userPrompt,
    fallbackFn: () => buildFallback(product_name, product_description, material),
  });

  /* ---------- Post-process & validate ---------- */
  const validated = {
    product_name,
    product_description,
    material: material || "",
    primary_category: PREDEFINED_CATEGORIES.includes(aiResult.primary_category)
      ? aiResult.primary_category
      : PREDEFINED_CATEGORIES[0],
    sub_category: aiResult.sub_category || "General",
    seo_tags: Array.isArray(aiResult.seo_tags)
      ? aiResult.seo_tags.slice(0, 10)
      : [],
    sustainability_filters: Array.isArray(aiResult.sustainability_filters)
      ? aiResult.sustainability_filters.filter((f) =>
          SUSTAINABILITY_FILTERS.includes(f)
        )
      : [],
    confidence_score:
      typeof aiResult.confidence_score === "number"
        ? Math.min(1, Math.max(0, aiResult.confidence_score))
        : 0.75,
    ai_generated: true,
  };

  // Guarantee at least 5 SEO tags
  if (validated.seo_tags.length < 5) {
    const extras = product_name
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    while (validated.seo_tags.length < 5 && extras.length) {
      const tag = extras.shift();
      if (!validated.seo_tags.includes(tag)) validated.seo_tags.push(tag);
    }
  }

  /* ---------- Persist ---------- */
  const saved = await CatalogResult.create(validated);
  return saved;
}

/* ------------------------------------------------------------------ */
/*  Deterministic fallback when AI is unavailable                     */
/* ------------------------------------------------------------------ */
function buildFallback(name, description, material) {
  const text = `${name} ${description} ${material || ""}`.toLowerCase();

  let primary_category = "Home & Kitchen";
  const catKeywords = {
    "Personal Care": ["soap", "shampoo", "skin", "body", "hair", "lotion", "toothbrush"],
    "Fashion & Accessories": ["bag", "tote", "shirt", "cloth", "wear", "fashion", "cotton"],
    "Food & Beverages": ["food", "snack", "tea", "coffee", "drink", "beverage", "spice"],
    "Stationery & Office": ["notebook", "pen", "pencil", "paper", "office", "stationery"],
    "Cleaning & Laundry": ["clean", "detergent", "laundry", "wash", "soap", "scrub"],
    "Baby & Kids": ["baby", "kids", "child", "toy", "infant"],
    "Pet Care": ["pet", "dog", "cat", "animal"],
    "Garden & Outdoor": ["garden", "plant", "seed", "outdoor", "pot"],
    "Health & Wellness": ["health", "vitamin", "supplement", "wellness", "medical"],
    "Packaging & Supplies": ["packaging", "box", "wrap", "container", "pouch"],
    "Electronics Accessories": ["charger", "cable", "phone", "electronic", "case"],
  };
  for (const [cat, keywords] of Object.entries(catKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      primary_category = cat;
      break;
    }
  }

  const words = text.split(/\W+/).filter((w) => w.length > 3);
  const unique = [...new Set(words)];

  const filters = SUSTAINABILITY_FILTERS.filter(
    (f) => text.includes(f.replace("-", " ")) || text.includes(f)
  );

  return {
    primary_category,
    sub_category: "General",
    seo_tags: unique.slice(0, 8),
    sustainability_filters: filters.length > 0 ? filters : ["plastic-free"],
    confidence_score: 0.6,
  };
}

/* ------------------------------------------------------------------ */
/*  List stored results                                               */
/* ------------------------------------------------------------------ */
async function getAllCatalogResults() {
  return CatalogResult.find().sort({ createdAt: -1 }).limit(50);
}

module.exports = {
  generateCategoryAndTags,
  getAllCatalogResults,
  PREDEFINED_CATEGORIES,
  SUSTAINABILITY_FILTERS,
};
