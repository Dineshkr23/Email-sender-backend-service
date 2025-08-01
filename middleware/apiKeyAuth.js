/**
 * API Key Authentication Middleware
 * For multi-tenant email service
 */

// In production, you would store these in a database
const VALID_API_KEYS = process.env.VALID_API_KEYS?.split(",") || [
  "client1-api-key-123",
  "client2-api-key-456",
  "client3-api-key-789",
];

/**
 * Validate API key middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validateApiKey = (req, res, next) => {
  // Skip API key validation if disabled
  if (process.env.ENABLE_API_KEY_AUTH !== "true") {
    return next();
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: "API key required",
      details: "Please provide X-API-Key header",
    });
  }

  if (!VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: "Invalid API key",
      details: "Please provide a valid API key",
    });
  }

  // Add client info to request for logging/tracking
  req.clientId = apiKey;
  next();
};

/**
 * Get client identifier for rate limiting
 * @param {Object} req - Express request object
 * @returns {string} Client identifier
 */
export const getClientId = (req) => {
  return req.headers["x-api-key"] || req.headers.origin || req.ip;
};
