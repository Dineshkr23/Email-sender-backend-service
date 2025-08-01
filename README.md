# Send Mail Backend Service

A Node.js Express application for sending emails via Gmail SMTP with file attachments support.

## Features

- ✅ Send emails via Gmail SMTP
- ✅ Support for multiple file attachments
- ✅ CC and BCC recipients
- ✅ Plain text and HTML email content
- ✅ File upload validation and cleanup
- ✅ Comprehensive error handling
- ✅ Rate limiting and security middleware
- ✅ CORS support
- ✅ Modular and clean architecture

## Prerequisites

- Node.js 18.0.0 or higher
- Gmail account with App Password enabled

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Uploads Directory

```bash
mkdir uploads
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification if not already enabled
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password

## Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### POST /api/send-email

Send an email with optional file attachments.

**Content-Type:** `multipart/form-data`

#### Request Fields

| Field         | Type   | Required | Description                                |
| ------------- | ------ | -------- | ------------------------------------------ |
| `smtpEmail`   | string | ✅       | Gmail address for sending                  |
| `appPassword` | string | ✅       | Gmail app password                         |
| `toEmail`     | string | ✅       | Recipient email address                    |
| `ccEmail`     | string | ❌       | Comma-separated CC emails                  |
| `bccEmail`    | string | ❌       | Comma-separated BCC emails                 |
| `subject`     | string | ✅       | Email subject                              |
| `message`     | string | ❌\*     | Plain text message                         |
| `html`        | string | ❌\*     | HTML message content                       |
| `files`       | file[] | ❌       | File attachments (max 10 files, 10MB each) |

\*Either `message` or `html` must be provided

#### Response Format

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "Error type",
  "details": "Detailed error message"
}
```

## Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:3000/api/send-email \
  -F "smtpEmail=your-email@gmail.com" \
  -F "appPassword=your-app-password" \
  -F "toEmail=recipient@example.com" \
  -F "ccEmail=cc1@example.com,cc2@example.com" \
  -F "subject=Test Email" \
  -F "message=This is a test email" \
  -F "files=@document.pdf" \
  -F "files=@image.jpg"
```

### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("smtpEmail", "your-email@gmail.com");
formData.append("appPassword", "your-app-password");
formData.append("toEmail", "recipient@example.com");
formData.append("subject", "Test Email");
formData.append("message", "This is a test email");

// Add files
const fileInput = document.getElementById("fileInput");
for (let file of fileInput.files) {
  formData.append("files", file);
}

fetch("http://localhost:3000/api/send-email", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log("Email sent successfully!");
    } else {
      console.error("Error:", data.error);
    }
  });
```

### Using Postman

1. Set method to `POST`
2. Set URL to `http://localhost:3000/api/send-email`
3. Set body type to `form-data`
4. Add the required fields as key-value pairs
5. For files, add them with key `files` (can add multiple)

## File Upload Limits

- **Individual file size:** 10MB
- **Total files:** 10 files per request
- **Total size:** 50MB per request
- **Allowed file types:**
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF, DOC, DOCX, XLS, XLSX
  - Text: TXT, CSV
  - Archives: ZIP

## Error Handling

The application handles various error scenarios:

- **Validation errors:** Missing required fields, invalid email formats
- **File errors:** File too large, invalid file type, too many files
- **SMTP errors:** Authentication failed, connection issues
- **Network errors:** Timeout, connection refused

## Security Features

- **Helmet.js:** Security headers
- **Rate limiting:** 100 requests per 15 minutes per IP
- **CORS:** Configurable cross-origin requests
- **File validation:** Type and size restrictions
- **Input sanitization:** Email format validation

## Project Structure

```
send-mail-backend-service/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── routes/
│   └── emailRoutes.js     # Email endpoint routes
├── services/
│   └── emailService.js    # Email sending logic
├── middleware/
│   ├── validation.js      # Request validation
│   └── errorHandler.js    # Error handling
├── utils/
│   └── fileUtils.js       # File operations
├── uploads/               # Temporary file storage
└── README.md             # This file
```

## Health Check

Check if the service is running:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "success": true,
  "message": "Email service is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**

   - Ensure 2-Step Verification is enabled
   - Generate a new App Password
   - Check if the app password is correct

2. **File Upload Errors**

   - Check file size (max 10MB per file)
   - Verify file type is allowed
   - Ensure total file count doesn't exceed 10

3. **Rate Limiting**
   - Wait 15 minutes before making more requests
   - Consider implementing request batching

## Development

### Running Tests

```bash
npm test
```

### Code Style

The project follows Airbnb JavaScript style guidelines and MAANG best practices.

## License

MIT License
