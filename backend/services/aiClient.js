/**
 * AI Client – Wraps Anthropic Claude API with automatic logging and mock-fallback.
 *
 * Design decisions:
 *  - If ANTHROPIC_API_KEY is set → calls the real Claude API.
 *  - If the API call fails or key is missing → uses the caller-supplied fallbackFn
 *    so the app always returns useful, structured data.
 *  - Every call (real or fallback) is logged to the AILog collection for auditing.
 */
const Anthropic = require("@anthropic-ai/sdk");
const config = require("../config/env");
const AILog = require("../models/AILog");

/* ------------------------------------------------------------------ */
/*  Initialise Anthropic client (only when a real key is present)     */
/* ------------------------------------------------------------------ */
let anthropic = null;
if (
  config.ANTHROPIC_API_KEY &&
  config.ANTHROPIC_API_KEY !== "your_anthropic_api_key_here"
) {
  anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
}

/* ------------------------------------------------------------------ */
/*  Main helper – call Claude AI and return parsed JSON               */
/* ------------------------------------------------------------------ */
async function callAI({ module, systemPrompt, userPrompt, fallbackFn }) {
  const start = Date.now();

  // ---------- Live AI path ----------
  if (anthropic) {
    try {
      const message = await anthropic.messages.create({
        model: config.CLAUDE_MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      // Claude returns content as an array of blocks; grab the text block
      const raw =
        message.content && message.content[0]
          ? message.content[0].text
          : "{}";

      const latency = Date.now() - start;

      // Extract JSON from the response (Claude may wrap it in markdown code fences)
      const jsonStr = extractJSON(raw);
      const parsed = JSON.parse(jsonStr);

      // Log success
      await AILog.create({
        module,
        prompt: `${systemPrompt}\n---\n${userPrompt}`,
        response: raw,
        model: config.CLAUDE_MODEL,
        tokens_used:
          (message.usage?.input_tokens || 0) +
          (message.usage?.output_tokens || 0),
        latency_ms: latency,
        status: "success",
      });

      return parsed;
    } catch (err) {
      const latency = Date.now() - start;
      await AILog.create({
        module,
        prompt: `${systemPrompt}\n---\n${userPrompt}`,
        response: "",
        model: config.CLAUDE_MODEL,
        latency_ms: latency,
        status: "error",
        error_message: err.message,
      });
      console.warn(
        `AI call failed (${module}), using fallback: ${err.message}`
      );
      // Fall through to fallback
    }
  }

  // ---------- Fallback / mock path ----------
  const fallbackResult = fallbackFn();
  const latency = Date.now() - start;

  await AILog.create({
    module,
    prompt: `${systemPrompt}\n---\n${userPrompt}`,
    response: JSON.stringify(fallbackResult),
    model: "mock-fallback",
    latency_ms: latency,
    status: "fallback",
  });

  return fallbackResult;
}

/* ------------------------------------------------------------------ */
/*  Helper: extract JSON from Claude response (handles code fences)  */
/* ------------------------------------------------------------------ */
function extractJSON(text) {
  // Try to find JSON inside ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();

  // Try to find a raw JSON object
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];

  return text;
}

module.exports = { callAI };
