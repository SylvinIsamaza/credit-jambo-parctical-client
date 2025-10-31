# Credit Jambo Client Portal

Complete client portal system for Credit Jambo savings management. This project consists of a Next.js frontend dashboard and Node.js backend API that work together to provide clients with secure access to their savings accounts.

## 🏗️ Project Structure

```
client/
├── frontend/          # Next.js client dashboard
├── backend/           # Node.js API server
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Docker and Docker Compose
- PostgreSQL 15+

### Start Both Services
```bash
# Start backend services
cd backend
docker-compose up --build

# Start frontend (in new terminal)
cd frontend
pnpm install
pnpm dev
```

Access the client portal at: http://localhost:3000

## 🔐 Authentication & Device Management

### Important: Device Approval Process

**After registration, clients cannot login immediately. The admin must first approve their device through the admin dashboard.**

1. **Client Registration**: User registers through the client portal
2. **Device Detection**: System automatically detects and records the client's device
3. **Admin Approval Required**: Admin must approve the device before client can login
4. **Login Access**: Only after admin approval can the client access their account

### Shared Backend Architecture

**The admin and client portals share the same backend infrastructure:**

- **Database**: Single PostgreSQL database serves both admin and client
- **Authentication**: Unified JWT system with role-based access (ADMIN/CLIENT)
- **Sessions**: Redis-based session management for both portals
- **Security**: Shared device tracking and audit logging
- **APIs**: Same backend serves different endpoints for admin and client needs

This shared architecture ensures:
- Consistent data across both portals
- Real-time updates between admin actions and client views
- Unified security and audit trail
- Simplified deployment and maintenance

## 🔔 Notification System

### Queue-Based Processing

The system uses an advanced notification queue for reliable message delivery:

**Queue Features:**
- **Asynchronous Processing**: Notifications processed in background without blocking user actions
- **Reliable Delivery**: Queue ensures no notifications are lost during high traffic
- **Priority Levels**: Critical security alerts processed before general notifications
- **Retry Logic**: Failed notifications automatically retried with smart backoff
- **Dead Letter Queue**: Failed notifications stored for manual review

**Notification Types:**
- **Security Alerts**: New device logins, suspicious activity, password changes
- **Account Updates**: Balance changes, profile modifications, device approvals
- **Transaction Notifications**: Deposit confirmations, withdrawal alerts
- **System Messages**: Maintenance notices, feature announcements
- **Support Updates**: Contact request responses, ticket status changes

**Delivery Methods:**
- **In-App**: Real-time notifications in client dashboard
- **Email**: SMTP delivery for important alerts
- **Push Notifications**: Mobile app support (when available)

## 🛠️ Development

### Backend Development
```bash
cd backend
pnpm install
pnpm dev                    # Start with hot reload
```

### Frontend Development
```bash
cd frontend
pnpm install
pnpm dev                    # Start with Turbopack
```

### Database Management
```bash
cd backend
pnpm exec prisma migrate dev    # Run migrations
pnpm exec prisma studio        # Open database browser
```

## 🔧 Configuration

### Backend Environment (.env)
```env
DATABASE_URL="postgresql://saving_manager:Test@2025@localhost:5432/saving"
JWT_SECRET="your-jwt-secret"
REDIS_HOST="localhost"
SMTP_HOST="smtp.gmail.com"
```

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="Credit Jambo"
```

## 🚀 Production Deployment

### Docker Deployment
```bash
# Backend
cd backend
docker-compose up --build -d

# Frontend
cd frontend
docker build -t client-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5000/api client-frontend
```

### Environment Considerations
- **Shared Database**: Ensure admin and client backends connect to same database
- **Redis Sessions**: Use same Redis instance for session consistency
- **File Storage**: Configure shared MinIO/S3 for profile images
- **Email Service**: Configure SMTP for notification delivery
- **Security**: Use strong JWT secrets and enable HTTPS

## 📱 Client Portal Features

### Account Management
- View savings account balance and details
- Complete transaction history with filtering
- Profile management and settings

### Security Features
- Multi-factor authentication with OTP
- Device registration and verification
- Session management across devices
- Real-time security notifications

### Customer Support
- Submit and track support requests
- Real-time notification updates
- Contact history and status tracking

## 🔒 Security Notes

1. **Device Approval**: All new devices require admin approval before login access
2. **Shared Security**: Admin and client portals share security infrastructure
3. **Session Tracking**: All sessions monitored across both portals
4. **Audit Trail**: Complete audit log of admin and client actions
5. **Notification Security**: Queue system prevents notification tampering
6. **Data Consistency**: Shared backend ensures data integrity between portals

## 🤝 Integration with Admin Portal

The client portal is designed to work seamlessly with the admin portal:

- **Device Management**: Admins approve client devices through admin dashboard
- **User Management**: Admins can view and manage client accounts
- **Transaction Oversight**: Admins have full visibility into client transactions
- **Support Management**: Admins respond to client support requests
- **Notification Control**: Admins can send system-wide notifications to clients

## 📚 Documentation

- **Frontend**: See `frontend/README.md` for detailed frontend documentation
- **Backend**: See `backend/README.md` for detailed API documentation
- **API Docs**: Available at http://localhost:5000/api-docs when backend is running

## 🔧 Troubleshooting

### Common Issues

**Cannot Login After Registration**
- Verify admin has approved your device in admin dashboard
- Check device fingerprint matches registration

**Backend Connection Issues**
- Ensure backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL in frontend environment

**Notification Issues**
- Check Redis connection for queue processing
- Verify SMTP configuration for email delivery
- Check notification queue status in backend logs