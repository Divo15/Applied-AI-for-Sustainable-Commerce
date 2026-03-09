const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

module.exports = {
  APP_NAME: process.env.APP_NAME || "Rayeva AI Systems",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/rayeva",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
  NODE_ENV: process.env.NODE_ENV || "development",
};
