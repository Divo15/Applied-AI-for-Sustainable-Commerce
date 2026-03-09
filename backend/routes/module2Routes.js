const express = require("express");
const router = express.Router();
const {
  generateProposal,
  getAllProposals,
} = require("../services/proposalService");

// ── POST /api/module2/generate ─────────────────────────────────────
// Generate a B2B sustainable product proposal.
router.post("/generate", async (req, res, next) => {
  try {
    const { client_name, industry, budget, requirements } = req.body;

    if (!client_name || !industry || budget === undefined) {
      return res.status(400).json({
        success: false,
        error: "client_name, industry, and budget are required",
      });
    }

    if (typeof budget !== "number" || budget <= 0) {
      return res.status(400).json({
        success: false,
        error: "budget must be a positive number",
      });
    }

    const result = await generateProposal({
      client_name,
      industry,
      budget,
      requirements,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/module2/proposals ─────────────────────────────────────
// List all stored B2B proposals.
router.get("/proposals", async (req, res, next) => {
  try {
    const proposals = await getAllProposals();
    res.json({ success: true, data: proposals });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
