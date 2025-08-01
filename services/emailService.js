import nodemailer from "nodemailer";

/**
 * Email service for sending emails via Gmail SMTP
 */
class EmailService {
  /**
   * Create a transporter for Gmail SMTP
   * @param {string} smtpEmail - Gmail address
   * @param {string} appPassword - Gmail app password
   * @returns {Object} Nodemailer transporter
   */
  createTransporter(smtpEmail, appPassword) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpEmail,
        pass: appPassword,
      },
      secure: true,
      port: 465,
    });
  }

  /**
   * Validate email address format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate multiple email addresses
   * @param {Array} emails - Array of email addresses
   * @returns {boolean} True if all emails are valid
   */
  validateEmails(emails) {
    return emails.every((email) => this.validateEmail(email.trim()));
  }

  /**
   * Send email via Gmail SMTP
   * @param {Object} emailData - Email configuration and content
   * @returns {Promise<Object>} Email sending result
   */
  async sendEmail(emailData) {
    const {
      smtpEmail,
      appPassword,
      toEmail,
      ccEmail = [],
      bccEmail = [],
      subject,
      message,
      html,
      attachments = [],
    } = emailData;

    // Validate required fields
    if (!smtpEmail || !appPassword || !toEmail || !subject) {
      throw new Error(
        "Missing required fields: smtpEmail, appPassword, toEmail, subject"
      );
    }

    // Validate that either message or html is provided
    if (!message && !html) {
      throw new Error("Either message or html content must be provided");
    }

    // Validate email formats
    if (!this.validateEmail(smtpEmail)) {
      throw new Error("Invalid sender email format");
    }

    if (!this.validateEmail(toEmail)) {
      throw new Error("Invalid recipient email format");
    }

    if (ccEmail.length > 0 && !this.validateEmails(ccEmail)) {
      throw new Error("Invalid CC email format");
    }

    if (bccEmail.length > 0 && !this.validateEmails(bccEmail)) {
      throw new Error("Invalid BCC email format");
    }

    // Create transporter
    const transporter = this.createTransporter(smtpEmail, appPassword);

    // Prepare email options
    const mailOptions = {
      from: smtpEmail,
      to: toEmail,
      subject: subject,
      text: message || undefined,
      html: html || undefined,
      cc: ccEmail.length > 0 ? ccEmail.join(", ") : undefined,
      bcc: bccEmail.length > 0 ? bccEmail.join(", ") : undefined,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        path: attachment.path,
      })),
    };

    try {
      // Verify transporter configuration
      await transporter.verify();

      // Send email
      const result = await transporter.sendMail(mailOptions);

      return {
        messageId: result.messageId,
        response: result.response,
        accepted: result.accepted,
        rejected: result.rejected,
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    } finally {
      // Close transporter connection
      transporter.close();
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

/**
 * Send email function - main interface
 * @param {Object} emailData - Email configuration and content
 * @returns {Promise<Object>} Email sending result
 */
export const sendEmail = async (emailData) => {
  return emailService.sendEmail(emailData);
};
