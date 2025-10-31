# Credit Jambo Client Backend

A comprehensive Node.js/TypeScript API server for the Credit Jambo client portal. This backend provides client authentication, account management, transaction history, and customer support functionality.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Cache**: Redis for session management
- **File Storage**: MinIO (S3-compatible)
- **Email**: SMTP with MailHog for development
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, rate limiting, audit logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Docker and Docker Compose (recommended)
- PostgreSQL 15+ (if running locally)

### Option 1: Docker (Recommended)
```bash
# Clone and navigate to backend directory
cd client/backend

# Copy environment configuration
cp .env.example .env

# Start all services
docker-compose up --build

# The API will be available at http://localhost:5000
```

### Option 2: Local Development
```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Start PostgreSQL, Redis, and MinIO (via Docker)
docker-compose up postgres redis minio mailhog

# Run database migrations
pnpm exec prisma migrate dev

# Generate Prisma client
pnpm exec prisma generate

# Start development server
pnpm dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| API Server | http://localhost:5000 | Main API endpoints |
| API Documentation | http://localhost:5000/api-docs | Swagger UI |
| Health Check | http://localhost:5000/health | Service status |
| MailHog UI | http://localhost:8025 | Email testing interface |
| MinIO Console | http://localhost:9001 | File storage management |

## ⚙️ Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://saving_manager:Test@2025@localhost:5432/saving"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="Credit Jambo <noreply@creditjambo.com>"



# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0

# Bank Configuration
BANK_IDENTIFIER="5730"
BANK_NAME="Credit Jambo"

# MinIO File Storage
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="credit-jambo"
```

### Development vs Production

**Development**: Uses MailHog for email testing and local MinIO
**Production**: Configure real SMTP server and production MinIO/S3

## 📚 API Endpoints

### Client Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Client login | ❌ |
| POST | `/refresh-token` | Refresh access token | ❌ |
| POST | `/forgot-password` | Request password reset | ❌ |
| POST | `/reset-password` | Reset password with token | ❌ |
| POST | `/logout` | Client logout | ✅ |
| GET | `/profile` | Get client profile | ✅ |
| POST | `/change-password` | Change client password | ✅ |
| POST | `/change-email` | Change client email | ✅ |
| POST | `/verify-email` | Verify email with OTP | ❌ |
| POST | `/resend-verification` | Resend verification email | ❌ |
| GET | `/devices` | List client devices | ✅ |
| POST | `/devices/:deviceId/verify` | Verify client device | ✅ |
| GET | `/sessions` | List active client sessions | ✅ |
| DELETE | `/sessions` | Revoke all client sessions | ✅ |
| DELETE | `/sessions/:sessionId` | Revoke specific client session | ✅ |

### Account Management (`/api/v1/account`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get client account details | ✅ |
| GET | `/balance` | Get account balance | ✅ |
| GET | `/transactions` | Get transaction history | ✅ |
| GET | `/transactions/:id` | Get transaction details | ✅ |

### Contact Support (`/api/v1/contact`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit contact request | ✅ |
| GET | `/` | Get client contact requests | ✅ |
| GET | `/:id` | Get contact details | ✅ |

### Notifications (`/api/v1/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get client notifications | ✅ |
| PUT | `/:id/read` | Mark notification as read | ✅ |

## 🔐 Authentication & Authorization

### JWT Token Structure
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to generate new access tokens
- **Device Tracking**: Each login creates a device record for security

### User Roles
- **CLIENT**: Regular client users with account access

### Security Features
- Password hashing with bcrypt
- Device fingerprinting and verification
- Session management with Redis
- Audit logging for all actions
- Rate limiting (1000 requests per 15 minutes)
- CORS and Helmet security headers

## 🔄 Session Management

### Redis-Based Sessions
- **Session Storage**: All active sessions stored in Redis for fast access
- **Session Tracking**: Each login creates a unique session with device information
- **Multi-Device Support**: Clients can have multiple active sessions across devices
- **Session Expiry**: Automatic cleanup of expired sessions
- **Security Features**:
  - Device fingerprinting for session validation
  - IP address tracking for suspicious activity detection
  - Session revocation capabilities (logout from all devices)
  - Real-time session monitoring

### Session Endpoints
- `GET /api/v1/auth/sessions` - List all active sessions
- `DELETE /api/v1/auth/sessions` - Revoke all sessions (logout everywhere)
- `DELETE /api/v1/auth/sessions/:sessionId` - Revoke specific session

## 🔔 Notification System

### Queue-Based Notifications
- **Asynchronous Processing**: Notifications processed via background queue system
- **Reliable Delivery**: Queue ensures notifications are not lost during high load
- **Email Integration**: Automatic email notifications for important events
- **Real-time Updates**: WebSocket support for instant notification delivery

### Notification Types
- **Account Activity**: Login alerts, password changes, profile updates
- **Transaction Alerts**: Deposit confirmations, balance updates
- **Security Notifications**: New device logins, suspicious activity
- **System Messages**: Maintenance notices, feature announcements
- **Support Updates**: Contact request responses, ticket status changes

### Queue Features
- **Priority Levels**: Critical, high, normal, low priority processing
- **Retry Logic**: Failed notifications automatically retried with exponential backoff
- **Dead Letter Queue**: Failed notifications stored for manual review
- **Rate Limiting**: Prevents notification spam to clients
- **Template System**: Customizable email and in-app notification templates

### Notification Delivery
- **In-App**: Real-time notifications in client dashboard
- **Email**: SMTP delivery for important notifications
- **Push Notifications**: Mobile app support (when available)
- **SMS**: Critical security alerts (configurable)

## 🗄️ Database Schema

### Core Models
- **User**: Client user accounts
- **Account**: Client savings accounts
- **Transaction**: Deposit/withdrawal records
- **Device**: Registered client devices for security tracking
- **Session**: Active client login sessions with Redis storage
- **Contact**: Customer support requests
- **Notification**: Client notifications with queue processing
- **NotificationQueue**: Background job queue for notification delivery
- **OtpCode**: OTP codes for client verification

### Key Relationships
- Each client has one savings account
- Clients can view their transaction history
- Multiple sessions per client tracked across devices
- Notifications queued and delivered asynchronously
- Client devices and sessions are tracked for security
- Clients can submit and track support requests

## 🛠️ Development Commands

```bash
# Development
pnpm dev                    # Start development server with hot reload
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm exec prisma migrate dev      # Run database migrations
pnpm exec prisma generate         # Generate Prisma client
pnpm exec prisma studio          # Open Prisma Studio
pnpm exec prisma db push         # Push schema changes

# Documentation
pnpm swagger               # Generate Swagger documentation
```

## 🐳 Docker Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| postgres | postgres:15-alpine | 5432 | Primary database |
| redis | redis:7-alpine | 6379 | Session cache |
| minio | minio/minio:latest | 9000, 9001 | File storage |
| mailhog | mailhog/mailhog:latest | 1025, 8025 | Email testing |
| backend | Custom build | 5000 | API server |

## 🔧 Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check if ports are in use
lsof -i :5000 -i :5432 -i :6379 -i :9000

# Kill processes if needed
sudo kill -9 $(lsof -t -i:5000)
```

**Database Connection Issues**
```bash
# Reset database and volumes
docker-compose down -v
docker-compose up postgres --build

# Check database connection
docker-compose exec postgres psql -U saving_manager -d saving
```

**Redis Connection Issues**
```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

**MinIO Issues**
```bash
# Access MinIO console at http://localhost:9001
# Default credentials: minioadmin/minioadmin
# Create bucket named 'credit-jambo' if missing
```

**Email Issues**
```bash
# Check MailHog at http://localhost:8025
# Verify SMTP configuration in .env
# For production, use real SMTP credentials
```

### Logs and Debugging

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f backend

# Check application logs
tail -f src/logs/app.log
```

## 🚀 Production Deployment

### Environment Considerations
1. **Security**: Change all default secrets and passwords
2. **Database**: Use managed PostgreSQL service
3. **Redis**: Use managed Redis service
4. **File Storage**: Use AWS S3 or similar
5. **Email**: Configure production SMTP service
6. **SSL**: Enable HTTPS with proper certificates
7. **Monitoring**: Add application monitoring and logging

### Production Environment Variables
```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@prod-db:5432/saving"
REDIS_HOST="prod-redis-host"
MINIO_ENDPOINT="s3.amazonaws.com"
MINIO_USE_SSL=true
SMTP_HOST="production-smtp-host"
```

## 🔒 Security Assumptions

1. **Environment Variables**: All secrets are properly secured and not committed to version control
2. **Database Access**: Database is only accessible from application servers
3. **Redis Security**: Redis is secured and not publicly accessible
4. **File Storage**: MinIO/S3 buckets have proper access controls
5. **Network Security**: Application runs behind a reverse proxy with SSL termination
6. **Admin Registration**: Admin registration secret is securely distributed
7. **Email Security**: SMTP credentials are secured and support TLS
8. **Rate Limiting**: Additional rate limiting may be needed at the reverse proxy level
9. **Session Security**: Redis sessions are properly secured and expired

## 📝 API Documentation

Complete API documentation is available at `/api-docs` when the server is running. The documentation includes:
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error codes and messages

## 🤝 Contributing

1. Follow TypeScript and Express.js best practices
2. Add proper validation using class-validator DTOs
3. Include audit logging for sensitive operations
4. Update Swagger documentation for new endpoints
5. Add proper error handling and logging
6. Test with both development and production configurations