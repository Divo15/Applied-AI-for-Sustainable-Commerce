/**
 * Global Express error-handling middleware.
 * Catches Mongoose validation / cast errors and generic exceptions.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: messages });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, error: "Invalid ID format" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
