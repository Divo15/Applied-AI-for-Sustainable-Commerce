const mongoose = require("mongoose");

const productItemSchema = new mongoose.Schema(
  {
    product_name: String,
    category: String,
    unit_price: Number,
    quantity: Number,
    subtotal: Number,
    sustainability_note: String,
  },
  { _id: false }
);

const b2bProposalSchema = new mongoose.Schema(
  {
    client_name: { type: String, required: true },
    industry: { type: String, required: true },
    budget: { type: Number, required: true },
    requirements: { type: String, default: "" },
    product_mix: [productItemSchema],
    budget_allocation: {
      products_total: Number,
      packaging: Number,
      logistics: Number,
      margin: Number,
      total: Number,
    },
    cost_breakdown: {
      subtotal: Number,
      tax_estimate: Number,
      grand_total: Number,
    },
    impact_summary: { type: String },
    ai_generated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("B2BProposal", b2bProposalSchema);
