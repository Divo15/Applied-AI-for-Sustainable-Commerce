const express = require("express");
const router = express.Router();
const {
  generateCategoryAndTags,
  getAllCatalogResults,
  PREDEFINED_CATEGORIES,
  SUSTAINABILITY_FILTERS,
} = require("../services/categoryService");

// ── POST /api/module1/generate ─────────────────────────────────────
// Generate categories, SEO tags, and sustainability filters for a product.
router.post("/generate", async (req, res, next) => {
  try {
    const { product_name, product_description, material } = req.body;

    if (!product_name || !product_description) {
      return res.status(400).json({
        success: false,
        error: "product_name and product_description are required",
      });
    }

    const result = await generateCategoryAndTags({
      product_name,
      product_description,
      material,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/module1/results ───────────────────────────────────────
// List all stored catalog AI results.
router.get("/results", async (req, res, next) => {
  try {
    const results = await getAllCatalogResults();
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/module1/meta ──────────────────────────────────────────
// Return predefined categories and sustainability filter lists.
router.get("/meta", (_req, res) => {
  res.json({
    success: true,
    data: {
      categories: PREDEFINED_CATEGORIES,
      sustainability_filters: SUSTAINABILITY_FILTERS,
    },
  });
});

module.exports = router;
