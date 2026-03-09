const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  let uri = config.MONGODB_URI;

  // ── If no real DB is configured, spin up an in-memory MongoDB ──────
  const isLocalDefault =
    !uri ||
    uri === "mongodb://localhost:27017/rayeva" ||
    uri === "mongodb://127.0.0.1:27017/rayeva";

  if (isLocalDefault) {
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log("⚡ Using in-memory MongoDB (no installation needed)");
    } catch (err) {
      console.warn("Could not start in-memory MongoDB:", err.message);
    }
  }

  // ── Connect ─────────────────────────────────────────────────────────
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
