const mongoose = require("mongoose");

const catalogResultSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    material: { type: String, default: "" },
    primary_category: { type: String, required: true },
    sub_category: { type: String, required: true },
    seo_tags: [{ type: String }],
    sustainability_filters: [{ type: String }],
    confidence_score: { type: Number, min: 0, max: 1 },
    ai_generated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CatalogResult", catalogResultSchema);
