# Example cURL commands for testing the email API (PowerShell version)
# Replace the placeholder values with your actual Gmail credentials

Write-Host "Testing Email API with cURL" -ForegroundColor Green

# Example 1: Send a simple text email
Write-Host "1. Sending simple text email..." -ForegroundColor Yellow
curl -X POST http://localhost:3000/api/send-email `
  -F "smtpEmail=your-email@gmail.com" `
  -F "appPassword=your-app-password" `
  -F "toEmail=recipient@example.com" `
  -F "subject=Test Email from cURL" `
  -F "message=This is a test email sent using cURL"

Write-Host "`n`n"

# Example 2: Send email with CC and BCC
Write-Host "2. Sending email with CC and BCC..." -ForegroundColor Yellow
curl -X POST http://localhost:3000/api/send-email `
  -F "smtpEmail=your-email@gmail.com" `
  -F "appPassword=your-app-password" `
  -F "toEmail=recipient@example.com" `
  -F "ccEmail=cc1@example.com,cc2@example.com" `
  -F "bccEmail=bcc1@example.com,bcc2@example.com" `
  -F "subject=Test Email with CC/BCC" `
  -F "message=This email has CC and BCC recipients"

Write-Host "`n`n"

# Example 3: Send HTML email
Write-Host "3. Sending HTML email..." -ForegroundColor Yellow
curl -X POST http://localhost:3000/api/send-email `
  -F "smtpEmail=your-email@gmail.com" `
  -F "appPassword=your-app-password" `
  -F "toEmail=recipient@example.com" `
  -F "subject=HTML Test Email" `
  -F "html=<h1>Hello World</h1><p>This is an <strong>HTML</strong> email!</p>"

Write-Host "`n`n"

# Example 4: Send email with file attachment (if you have a test file)
Write-Host "4. Sending email with file attachment..." -ForegroundColor Yellow
# Uncomment and modify the path to your test file
# curl -X POST http://localhost:3000/api/send-email `
#   -F "smtpEmail=your-email@gmail.com" `
#   -F "appPassword=your-app-password" `
#   -F "toEmail=recipient@example.com" `
#   -F "subject=Email with Attachment" `
#   -F "message=This email has an attachment" `
#   -F "files=@./test-file.txt"

Write-Host "Note: For file attachment example, uncomment the curl command and provide a valid file path" -ForegroundColor Cyan

Write-Host "`n`n"

# Example 5: Test health endpoint
Write-Host "5. Testing health endpoint..." -ForegroundColor Yellow
curl http://localhost:3000/health

Write-Host "`n`n"

Write-Host "Testing completed!" -ForegroundColor Green
Write-Host "Remember to:" -ForegroundColor Cyan
Write-Host "1. Replace 'your-email@gmail.com' with your actual Gmail address" -ForegroundColor White
Write-Host "2. Replace 'your-app-password' with your actual Gmail app password" -ForegroundColor White
Write-Host "3. Replace 'recipient@example.com' with the actual recipient email" -ForegroundColor White
Write-Host "4. Make sure the server is running on http://localhost:3000" -ForegroundColor White 