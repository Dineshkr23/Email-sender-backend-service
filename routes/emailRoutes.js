import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sendEmail } from "../services/emailService.js";
import { validateEmailRequest } from "../middleware/validation.js";
import { cleanupUploadedFiles } from "../utils/fileUtils.js";
import { validateApiKey } from "../middleware/apiKeyAuth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, "../uploads");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  },
});

/**
 * POST /api/send-email
 * Send email with attachments via Gmail SMTP
 */
router.post(
  "/send-email",
  upload.array("files", 10), // Handle up to 10 files
  validateApiKey, // Add API key validation
  validateEmailRequest,
  async (req, res, next) => {
    try {
      const {
        smtpEmail,
        appPassword,
        toEmail,
        ccEmail,
        bccEmail,
        subject,
        message,
        html,
      } = req.body;

      const files = req.files || [];

      // Prepare email data
      const emailData = {
        smtpEmail,
        appPassword,
        toEmail,
        ccEmail: ccEmail ? ccEmail.split(",").map((email) => email.trim()) : [],
        bccEmail: bccEmail
          ? bccEmail.split(",").map((email) => email.trim())
          : [],
        subject,
        message,
        html,
        attachments: files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      };

      // Send email
      const result = await sendEmail(emailData);

      // Clean up uploaded files
      await cleanupUploadedFiles(files);

      res.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files && req.files.length > 0) {
        await cleanupUploadedFiles(req.files);
      }
      next(error);
    }
  }
);

export { router as emailRoutes };
