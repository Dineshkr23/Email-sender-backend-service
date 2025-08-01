# Production Deployment Guide

## Environment Variables

Create a `.env` file in your production environment with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting (optional overrides)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
TRUST_PROXY=true

# Logging
LOG_LEVEL=info
```

## Coolify Deployment

### 1. Build Configuration

In your Coolify deployment settings:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: `3000`

### 2. Environment Variables

Add these environment variables in Coolify:

```env
NODE_ENV=production
TRUST_PROXY=true
ALLOWED_ORIGINS=https://yourdomain.com
```

### 3. Reverse Proxy Configuration

If using Nginx as reverse proxy, ensure these headers are passed:

```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host $host;
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: "3.8"
services:
  email-service:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - TRUST_PROXY=true
      - ALLOWED_ORIGINS=https://yourdomain.com
    restart: unless-stopped
```

## Security Considerations

### 1. Rate Limiting

The application includes rate limiting by default:

- 100 requests per 15 minutes per IP
- Configure via environment variables if needed

### 2. CORS

Configure `ALLOWED_ORIGINS` to restrict access to your domains only.

### 3. File Upload Limits

- Individual file size: 10MB
- Total files: 10 per request
- Total size: 50MB per request

### 4. Gmail App Password

Ensure your Gmail app password is properly configured:

1. Enable 2-Step Verification
2. Generate App Password for "Mail"
3. Use the 16-character password

## Monitoring

### Health Check

Monitor the application health:

```bash
curl https://yourdomain.com/health
```

Expected response:

```json
{
  "success": true,
  "message": "Email service is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Logs

Monitor application logs for:

- Email sending success/failure
- File upload/cleanup operations
- Rate limiting events
- Authentication errors

## Troubleshooting

### Common Issues

1. **Rate Limiting Errors**

   - Check if behind reverse proxy
   - Verify `TRUST_PROXY` setting
   - Monitor rate limit headers

2. **CORS Errors**

   - Verify `ALLOWED_ORIGINS` configuration
   - Check domain in allowed list

3. **File Upload Issues**

   - Verify upload directory permissions
   - Check file size limits
   - Monitor disk space

4. **SMTP Authentication**
   - Verify Gmail app password
   - Check 2-Step Verification status
   - Test SMTP connection

## Performance Optimization

### 1. File Cleanup

Files are automatically cleaned up after email sending. Monitor the `uploads/` directory size.

### 2. Memory Usage

The application is designed to be lightweight. Monitor memory usage, especially during file uploads.

### 3. Connection Pooling

Nodemailer creates new connections for each email. For high volume, consider connection pooling.

## SSL/TLS

Ensure your domain has valid SSL certificates, especially for production use.

## Backup

Regularly backup:

- Application code
- Environment variables
- Gmail app passwords
- Domain configurations
