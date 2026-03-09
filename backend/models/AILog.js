const mongoose = require("mongoose");

const aiLogSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    model: { type: String },
    tokens_used: { type: Number, default: 0 },
    latency_ms: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["success", "error", "fallback"],
      default: "success",
    },
    error_message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AILog", aiLogSchema);
