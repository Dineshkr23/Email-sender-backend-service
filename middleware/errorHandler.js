import { unlink } from "fs/promises";

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File too large",
      details: "Individual file size exceeds 10MB limit",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      error: "Too many files",
      details: "Maximum 10 files allowed",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      error: "Unexpected file field",
      details: 'Files must be uploaded with field name "files"',
    });
  }

  // Handle validation errors
  if (err.message && err.message.includes("File type")) {
    return res.status(400).json({
      success: false,
      error: "Invalid file type",
      details: err.message,
    });
  }

  // Handle email service errors
  if (
    err.message &&
    (err.message.includes("Missing required fields") ||
      err.message.includes("Invalid") ||
      err.message.includes("Either message or html"))
  ) {
    return res.status(400).json({
      success: false,
      error: "Email validation failed",
      details: err.message,
    });
  }

  if (err.message && err.message.includes("Failed to send email")) {
    return res.status(500).json({
      success: false,
      error: "Email sending failed",
      details: err.message,
    });
  }

  // Handle SMTP authentication errors
  if (err.code === "EAUTH" || err.code === "EENVELOPE") {
    return res.status(401).json({
      success: false,
      error: "SMTP authentication failed",
      details: "Please check your Gmail credentials and app password",
    });
  }

  // Handle network/connection errors
  if (err.code === "ECONNECTION" || err.code === "ETIMEDOUT") {
    return res.status(503).json({
      success: false,
      error: "SMTP connection failed",
      details: "Unable to connect to Gmail SMTP server",
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: "Server error",
    details:
      process.env.NODE_ENV === "production" ? "An error occurred" : message,
  });
};
