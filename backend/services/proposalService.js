/**
 * Module 2 – AI B2B Proposal Generator
 *
 * Generates a sustainable product proposal that fits within a client's budget.
 * Business logic validates that totals never exceed the requested budget.
 */
const { callAI } = require("./aiClient");
const B2BProposal = require("../models/B2BProposal");

/* ------------------------------------------------------------------ */
/*  Generate a B2B proposal                                           */
/* ------------------------------------------------------------------ */
async function generateProposal({ client_name, industry, budget, requirements }) {
  /* ---------- Prompt design ---------- */
  const systemPrompt = `You are an AI B2B proposal strategist for a sustainable products marketplace.
Given a client's details and budget, generate a business proposal. Return valid JSON with these exact keys:
- "product_mix": array of objects, each with { "product_name", "category", "unit_price" (number), "quantity" (number), "subtotal" (number), "sustainability_note" }
- "budget_allocation": object with { "products_total" (number), "packaging" (number), "logistics" (number), "margin" (number), "total" (number) } – all values must stay within the budget
- "cost_breakdown": { "subtotal" (number), "tax_estimate" (number), "grand_total" (number) }
- "impact_summary": a 2-3 sentence string on sustainability impact positioning
Be realistic with pricing. Total must not exceed the budget. Focus on sustainable product alternatives.`;

  const userPrompt = `Client: ${client_name}
Industry: ${industry}
Budget: ₹${budget}
Requirements: ${requirements || "General sustainable product needs"}`;

  /* ---------- Call AI ---------- */
  const aiResult = await callAI({
    module: "module2_b2b_proposal",
    systemPrompt,
    userPrompt,
    fallbackFn: () => buildFallback(client_name, industry, budget, requirements),
  });

  /* ---------- Validate budget constraint ---------- */
  const budgetAllocation =
    aiResult.budget_allocation || buildDefaultAllocation(budget);
  if (budgetAllocation.total > budget) {
    const scale = budget / budgetAllocation.total;
    budgetAllocation.products_total = Math.round(
      budgetAllocation.products_total * scale
    );
    budgetAllocation.packaging = Math.round(budgetAllocation.packaging * scale);
    budgetAllocation.logistics = Math.round(budgetAllocation.logistics * scale);
    budgetAllocation.margin = Math.round(budgetAllocation.margin * scale);
    budgetAllocation.total = budget;
  }

  /* ---------- Persist ---------- */
  const saved = await B2BProposal.create({
    client_name,
    industry,
    budget,
    requirements: requirements || "",
    product_mix: aiResult.product_mix || [],
    budget_allocation: budgetAllocation,
    cost_breakdown: aiResult.cost_breakdown || {
      subtotal: Math.round(budget * 0.85),
      tax_estimate: Math.round(budget * 0.05),
      grand_total: Math.round(budget * 0.9),
    },
    impact_summary:
      aiResult.impact_summary ||
      "Sustainable sourcing proposal with eco-friendly alternatives.",
    ai_generated: true,
  });

  return saved;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function buildDefaultAllocation(budget) {
  return {
    products_total: Math.round(budget * 0.65),
    packaging: Math.round(budget * 0.1),
    logistics: Math.round(budget * 0.15),
    margin: Math.round(budget * 0.1),
    total: budget,
  };
}

function buildFallback(clientName, industry, budget) {
  const allocation = buildDefaultAllocation(budget);

  const sampleProducts = [
    {
      product_name: "Bamboo Cutlery Set",
      category: "Home & Kitchen",
      unit_price: 250,
      quantity: Math.max(1, Math.floor((budget * 0.15) / 250)),
      sustainability_note: "Plastic-free, biodegradable",
    },
    {
      product_name: "Organic Cotton Tote Bags",
      category: "Fashion & Accessories",
      unit_price: 180,
      quantity: Math.max(1, Math.floor((budget * 0.15) / 180)),
      sustainability_note: "GOTS certified organic",
    },
    {
      product_name: "Recycled Paper Notebooks",
      category: "Stationery & Office",
      unit_price: 120,
      quantity: Math.max(1, Math.floor((budget * 0.1) / 120)),
      sustainability_note: "100% recycled, FSC certified",
    },
    {
      product_name: "Natural Cleaning Kit",
      category: "Cleaning & Laundry",
      unit_price: 450,
      quantity: Math.max(1, Math.floor((budget * 0.1) / 450)),
      sustainability_note: "Non-toxic, biodegradable ingredients",
    },
    {
      product_name: "Compostable Food Containers",
      category: "Packaging & Supplies",
      unit_price: 80,
      quantity: Math.max(1, Math.floor((budget * 0.15) / 80)),
      sustainability_note: "Compostable within 90 days",
    },
  ];

  sampleProducts.forEach((p) => {
    p.subtotal = p.unit_price * p.quantity;
  });

  const subtotal = sampleProducts.reduce((s, p) => s + p.subtotal, 0);

  return {
    product_mix: sampleProducts,
    budget_allocation: allocation,
    cost_breakdown: {
      subtotal,
      tax_estimate: Math.round(subtotal * 0.05),
      grand_total: Math.round(subtotal * 1.05),
    },
    impact_summary: `This proposal for ${clientName} in the ${industry} sector prioritizes sustainable alternatives that reduce plastic waste and carbon footprint. By choosing eco-certified products, the client demonstrates commitment to environmental responsibility while meeting operational needs within the ₹${budget} budget.`,
  };
}

/* ------------------------------------------------------------------ */
/*  List stored proposals                                             */
/* ------------------------------------------------------------------ */
async function getAllProposals() {
  return B2BProposal.find().sort({ createdAt: -1 }).limit(50);
}

module.exports = { generateProposal, getAllProposals };
