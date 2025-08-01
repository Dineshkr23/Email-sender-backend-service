#!/bin/bash

# Example cURL commands for testing the email API
# Replace the placeholder values with your actual Gmail credentials

echo "Testing Email API with cURL"

# Example 1: Send a simple text email
echo "1. Sending simple text email..."
curl -X POST http://localhost:3000/api/send-email \
  -F "smtpEmail=your-email@gmail.com" \
  -F "appPassword=your-app-password" \
  -F "toEmail=recipient@example.com" \
  -F "subject=Test Email from cURL" \
  -F "message=This is a test email sent using cURL"

echo -e "\n\n"

# Example 2: Send email with CC and BCC
echo "2. Sending email with CC and BCC..."
curl -X POST http://localhost:3000/api/send-email \
  -F "smtpEmail=your-email@gmail.com" \
  -F "appPassword=your-app-password" \
  -F "toEmail=recipient@example.com" \
  -F "ccEmail=cc1@example.com,cc2@example.com" \
  -F "bccEmail=bcc1@example.com,bcc2@example.com" \
  -F "subject=Test Email with CC/BCC" \
  -F "message=This email has CC and BCC recipients"

echo -e "\n\n"

# Example 3: Send HTML email
echo "3. Sending HTML email..."
curl -X POST http://localhost:3000/api/send-email \
  -F "smtpEmail=your-email@gmail.com" \
  -F "appPassword=your-app-password" \
  -F "toEmail=recipient@example.com" \
  -F "subject=HTML Test Email" \
  -F "html=<h1>Hello World</h1><p>This is an <strong>HTML</strong> email!</p>"

echo -e "\n\n"

# Example 4: Send email with file attachment (if you have a test file)
echo "4. Sending email with file attachment..."
# Uncomment and modify the path to your test file
# curl -X POST http://localhost:3000/api/send-email \
#   -F "smtpEmail=your-email@gmail.com" \
#   -F "appPassword=your-app-password" \
#   -F "toEmail=recipient@example.com" \
#   -F "subject=Email with Attachment" \
#   -F "message=This email has an attachment" \
#   -F "files=@./test-file.txt"

echo "Note: For file attachment example, uncomment the curl command and provide a valid file path"

echo -e "\n\n"

# Example 5: Test health endpoint
echo "5. Testing health endpoint..."
curl http://localhost:3000/health

echo -e "\n\n"

echo "Testing completed!"
echo "Remember to:"
echo "1. Replace 'your-email@gmail.com' with your actual Gmail address"
echo "2. Replace 'your-app-password' with your actual Gmail app password"
echo "3. Replace 'recipient@example.com' with the actual recipient email"
echo "4. Make sure the server is running on http://localhost:3000" 