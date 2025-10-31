# Credit Jambo Client Portal

Next.js client dashboard for Credit Jambo savings management system. This frontend provides a user-friendly interface for clients to manage their savings accounts, view transactions, and access support.

## 🚀 Quick Start

### With Docker
```bash
docker build -t client-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5000/api client-frontend
```

### Local Development
```bash
pnpm install
pnpm dev
```

Access at: http://localhost:3000

## 📱 Application Pages

### Authentication Pages (`/auth`)
| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User authentication with email/password |
| Forgot Password | `/forgot-password` | Request password reset via email |
| Reset Password | `/reset-password` | Reset password using email token |
| Verify Email | `/verify-email` | Email verification with OTP |

### Protected Pages (`/dashboard`)
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview of account balance and recent activity |
| Transactions | `/transactions` | View transaction history and details |
| Profile | `/profile` | View and edit personal information |
| Contacts | `/contacts` | Customer support and help requests |
| Devices | `/devices` | Manage trusted devices and security |

### Settings Pages (`/settings`)
| Page | Route | Description |
|------|-------|-------------|
| Settings Overview | `/settings` | Main settings navigation |
| Profile Settings | `/settings/profile` | Update personal information |
| Device Management | `/settings/devices` | Manage and verify devices |
| Session Management | `/settings/sessions` | View and manage active sessions |

## ✨ Features

- **Account Management**: View savings account balance and details
- **Transaction History**: Complete transaction history with filtering
- **Secure Authentication**: Multi-factor authentication with device verification
- **Profile Management**: Update personal information and preferences
- **Device Security**: Manage trusted devices and active sessions
- **Customer Support**: Submit and track support requests
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Updates**: Live balance and transaction updates

## ⚙️ Environment Configuration

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="Credit Jambo"
NEXT_PUBLIC_BANK_NAME="Credit Jambo"
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Credit Jambo` |
| `NEXT_PUBLIC_BANK_NAME` | Bank name for branding | `Credit Jambo` |

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint

# Type checking
npx tsc --noEmit
```

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner (toast notifications)
- **Theme**: next-themes (dark/light mode)

## 🎨 UI Components

### Core Components
- **Forms**: React Hook Form with Zod validation
- **Tables**: TanStack Table with sorting and filtering
- **Modals**: Radix UI Dialog components
- **Navigation**: Responsive sidebar and mobile menu
- **Notifications**: Toast notifications for user feedback
- **Loading States**: Skeleton loaders and spinners

### Custom Components
- **OTP Input**: Secure OTP code entry
- **Phone Input**: International phone number input
- **Date Picker**: Calendar date selection
- **User Avatar**: Profile image display
- **Transaction Tables**: Formatted transaction displays

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Device Fingerprinting**: Track and verify user devices
- **Session Management**: Monitor and control active sessions
- **Form Validation**: Client-side and server-side validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Secure Cookies**: HTTP-only cookies for sensitive data

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Large touch targets and gestures
- **Accessibility**: WCAG compliant components

## 🔧 Troubleshooting

### Common Issues

**Backend Connection Issues**
```bash
# Check if backend is running
curl http://localhost:5000/health

# Verify API URL in environment
echo $NEXT_PUBLIC_API_URL
```

**Build Errors**
```bash
# Clear Next.js cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

**Development Server Issues**
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Restart development server
pnpm dev
```

**Docker Issues**
```bash
# View container logs
docker logs <container-name>

# Rebuild container
docker build -t client-frontend . --no-cache
```

### Debugging

```bash
# Enable React Query DevTools (development only)
# DevTools are automatically enabled in development

# Check browser console for errors
# Open browser DevTools (F12)

# Verify environment variables
# Check .env.local file exists and variables are set
```

## 🚀 Production Deployment

### Build Optimization
```bash
# Production build with optimizations
pnpm build

```

### Environment Setup
```env
# Production environment variables
NEXT_PUBLIC_API_URL=https://api.creditjambo.com/api
NEXT_PUBLIC_APP_NAME="Credit Jambo"
NODE_ENV=production
```

### Docker Production
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
