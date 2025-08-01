import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { emailRoutes } from "./routes/emailRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting (important when behind reverse proxy)
// Set to true in production when behind a reverse proxy
app.set("trust proxy", process.env.NODE_ENV === "production" ? true : 1);

// Serve static files
app.use(express.static(join(__dirname, "public")));

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
// app.use(
//   cors({
//     origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//     // Additional security for production
//     maxAge: 86400, // 24 hours
//   })
// );
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_PER_CLIENT || 50, // limit per client
  keyGenerator: (req) => {
    // Use API key or origin as client identifier
    return req.headers["x-api-key"] || req.headers.origin || req.ip;
  },
  message: {
    success: false,
    error: "Too many requests from this client, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Trust proxy for accurate IP detection
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Email service is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve test page at root
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "test.html"));
});

// API routes
app.use("/api", emailRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service ready at http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

export default app;
