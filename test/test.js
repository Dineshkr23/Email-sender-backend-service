import { sendEmail } from "../services/emailService.js";

/**
 * Simple test function for email service
 * Note: This is for testing purposes only
 * Replace with actual Gmail credentials to test
 */
async function testEmailService() {
  try {
    const emailData = {
      smtpEmail: "test@gmail.com", // Replace with actual Gmail
      appPassword: "test-app-password", // Replace with actual app password
      toEmail: "recipient@example.com", // Replace with actual recipient
      subject: "Test Email from Node.js Service",
      message: "This is a test email sent from the Node.js email service.",
      html: "<h1>Test Email</h1><p>This is a test email sent from the Node.js email service.</p>",
      attachments: [],
    };

    console.log("Testing email service...");
    const result = await sendEmail(emailData);
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Email test failed:", error.message);
  }
}

// Uncomment the line below to run the test
// testEmailService();
