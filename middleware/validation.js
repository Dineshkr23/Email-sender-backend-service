/**
 * Validation middleware for email requests
 */

/**
 * Validate email request fields
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validateEmailRequest = (req, res, next) => {
  try {
    const { smtpEmail, appPassword, toEmail, subject, message, html } =
      req.body;

    const errors = [];

    // Check required fields
    if (!smtpEmail) {
      errors.push("smtpEmail is required");
    }

    if (!appPassword) {
      errors.push("appPassword is required");
    }

    if (!toEmail) {
      errors.push("toEmail is required");
    }

    if (!subject) {
      errors.push("subject is required");
    }

    // Check that either message or html is provided
    if (!message && !html) {
      errors.push("Either message or html content must be provided");
    }

    // Validate email formats if provided
    if (smtpEmail && !isValidEmail(smtpEmail)) {
      errors.push("Invalid smtpEmail format");
    }

    if (toEmail && !isValidEmail(toEmail)) {
      errors.push("Invalid toEmail format");
    }

    // Validate CC emails if provided
    if (req.body.ccEmail) {
      const ccEmails = req.body.ccEmail.split(",").map((email) => email.trim());
      const invalidCcEmails = ccEmails.filter((email) => !isValidEmail(email));
      if (invalidCcEmails.length > 0) {
        errors.push("Invalid CC email format(s)");
      }
    }

    // Validate BCC emails if provided
    if (req.body.bccEmail) {
      const bccEmails = req.body.bccEmail
        .split(",")
        .map((email) => email.trim());
      const invalidBccEmails = bccEmails.filter(
        (email) => !isValidEmail(email)
      );
      if (invalidBccEmails.length > 0) {
        errors.push("Invalid BCC email format(s)");
      }
    }

    // Check file size limits
    if (req.files && req.files.length > 0) {
      const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 50 * 1024 * 1024; // 50MB total limit

      if (totalSize > maxTotalSize) {
        errors.push("Total file size exceeds 50MB limit");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Validation error",
      details: error.message,
    });
  }
};

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
