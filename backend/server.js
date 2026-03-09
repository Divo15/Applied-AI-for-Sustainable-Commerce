const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config/env");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const module1Routes = require("./routes/module1Routes");
const module2Routes = require("./routes/module2Routes");

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────────────
app.use("/api/module1", module1Routes);
app.use("/api/module2", module2Routes);

// Health-check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: config.APP_NAME,
    timestamp: new Date().toISOString(),
  });
});

// AI Logs endpoint (for debugging / demo)
app.get("/api/logs", async (_req, res, next) => {
  try {
    const AILog = require("./models/AILog");
    const logs = await AILog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
});

// ── Error handler (must be registered last) ────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(
    `${config.APP_NAME} server running on port ${PORT} [${config.NODE_ENV}]`
  );
});
