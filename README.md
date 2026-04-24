# Stories by Foot - Adventure Travel Booking Platform

**Walk the Road. Live the Story.**

Stories by Foot is a modern, full-stack travel and adventure booking platform built with React, TypeScript, and Express. It enables users to browse adventure destinations, manage bookings, and connect with travel communities while providing administrators with comprehensive management tools.

**Live Demo:** https://storiesbyfoot.vercel.app/

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Architecture](#architecture)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

### 🌍 Public Features
- **Destination Browsing** - Explore curated adventure destinations with detailed package information
- **Package Management** - View trip itineraries, inclusions, exclusions, and pricing
- **Multi-Currency Support** - Automatic currency conversion based on user region
- **Regional Pricing** - Region-specific pricing and localization
- **Blog & Content** - Travel stories, guides, and informational articles
- **Testimonials** - Real user reviews and experiences
- **Contact & Support** - Multiple channels for customer support

### 👤 User Features
- **User Authentication** - Email/password signup and login
- **Google OAuth Integration** - One-click login with Google
- **User Dashboard** - Manage bookings, view order history, and track status
- **Booking Management** - Multi-step booking workflow with validation
- **Profile Management** - Update personal information, documents, and preferences
- **Coupon System** - Apply discount codes during checkout
- **Document Management** - Store and manage travel documents (passport, visa, etc.)
- **Email Notifications** - BookingJS integration for email confirmations

### 🛠️ Admin Features
- **Admin Dashboard** - Comprehensive operational hub
- **User Management** - View, manage, and moderate user accounts
- **Booking Analytics** - Track bookings, revenue, and key metrics
- **Customer Support Tools** - Manage customer inquiries and testimonials
- **Coupon Management** - Create, edit, and manage discount codes
- **Testimonials Moderation** - Approve or reject user testimonials
- **Reports & Analytics** - Detailed charts and analytics with Recharts
- **Data Export** - Export customer and booking data to Excel (XLSX)

---

## Technology Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Routing** | React Router DOM v6 |
| **Styling** | Tailwind CSS + custom theme |
| **UI Components** | Radix UI + shadcn/ui components |
| **Icons** | Lucide React |
| **State Management** | React Context API + React Query |
| **Forms** | React Hook Form + Zod validation |
| **Authentication** | Google OAuth 2.0, JWT |
| **Charts & Analytics** | Recharts |
| **Notifications** | Sonner (Toast notifications) |
| **Email** | EmailJS |
| **Data Export** | XLSX |
| **Date Handling** | date-fns |

### Backend
| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Authentication** | bcryptjs for password hashing |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **CORS** | Express CORS middleware |

### Development
| Tool | Purpose |
|------|---------|
| **Package Manager** | pnpm |
| **TypeScript** | Type safety |
| **ESLint** | Code linting |
| **Concurrently** | Run frontend & backend simultaneously |

---

## Project Structure

```
storiesbyfoot/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── ui/                  # shadcn/ui components (buttons, modals, etc.)
│   │   ├── forms/               # Form components
│   │   ├── layout/              # Layout components (Header, Footer, etc.)
│   │   └── sections/            # Page sections (Hero, Features, etc.)
│   │
│   ├── pages/                    # Page components (route-based)
│   │   ├── Index.tsx            # Homepage
│   │   ├── Destinations.tsx     # Destination listing
│   │   ├── DestinationDetail.tsx # Package details
│   │   ├── BookingPage.tsx      # Multi-step booking workflow
│   │   ├── Dashboard.tsx        # User dashboard
│   │   ├── AdminDashboard.tsx   # Admin control panel
│   │   ├── Blog.tsx             # Blog listing
│   │   ├── BlogPost.tsx         # Individual blog post
│   │   ├── About.tsx            # About page
│   │   ├── Contact.tsx          # Contact form
│   │   ├── Services.tsx         # Services page
│   │   ├── Support.tsx          # Support page
│   │   └── [other pages]/       # Legal, careers, testimonials, etc.
│   │
│   ├── context/                  # React Context for state
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── CurrencyContext.tsx  # Currency & localization
│   │   └── [other contexts]/    # Additional context providers
│   │
│   ├── lib/                      # Utility functions & helpers
│   │   ├── api.ts               # API client functions
│   │   ├── db.ts                # Legacy local storage/db utilities
│   │   └── [utilities]/         # Helper functions
│   │
│   ├── data/                     # Static data
│   │   ├── destinations.ts      # Destination & package data
│   │   └── [other data]/        # Blog, testimonials, etc.
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles & theme variables
│
├── backend/                      # Backend source code
│   ├── routes/                   # Express route handlers
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── bookings.js          # Booking management endpoints
│   │   ├── testimonials.js      # Testimonials endpoints
│   │   └── coupons.js           # Coupon management endpoints
│   │
│   ├── db/                       # Database abstraction layer
│   │   ├── index.js             # Database factory/initialization
│   │   ├── sqlite.js            # SQLite implementation
│   │   ├── postgres.js          # PostgreSQL implementation
│   │   └── schema.js            # Database schema definitions
│   │
│   └── middleware/               # Express middleware (auth, validation, etc.)
│
├── public/                       # Static assets
│   └── [images, icons]/
│
├── server.js                     # Express server entry point
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies & scripts
├── index.html                   # HTML entry point
└── README.md                    # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 16+ 
- **pnpm** 10.24.0+ (or npm/yarn)
- **Git** for version control
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd storiesbyfoot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   
   This installs both frontend and backend dependencies defined in `package.json`.

3. **Set up environment variables (Optional)**
   
   For development, the app works with defaults. For production or custom settings:
   
   Create a `.env` file in the root directory:
   ```env
   # Backend
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/storiesbyfoot
   
   # Frontend
   VITE_API_BASE_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

   **Note:** In development, SQLite is used by default. Set `DATABASE_URL` to use PostgreSQL.

### Running the Application

#### Development Mode

Start both the backend server and frontend dev server concurrently:

```bash
pnpm dev
```

- **Frontend:** http://localhost:5173 (Vite)
- **Backend API:** http://localhost:3000
- API calls are proxied from `/api` to the backend

#### Frontend Only (if backend is separate)

```bash
pnpm dev:frontend
```

#### Backend Only (if frontend is built)

```bash
pnpm dev:server
```

#### Production Mode

```bash
# Build the frontend
pnpm build

# Start the backend (serves the built frontend)
npm run dev:server
```

The Express server will serve the built frontend and API from a single port (default 3000).

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Start both backend and frontend in development mode |
| `pnpm dev:frontend` | Start only the frontend development server |
| `pnpm dev:server` | Start only the backend server |
| `pnpm build` | Build the frontend for production |
| `pnpm build:dev` | Build the frontend in development mode |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint to check code quality |

---

## Configuration

### Vite Configuration (`vite.config.ts`)

- **Build Tool:** SWC-powered React plugin for fast builds
- **API Proxy:** `/api` routes proxied to backend (configurable)
- **Path Aliases:** `@` maps to `src/` directory
- **Optimizations:** Manual chunk splitting for optimal bundle size

### Tailwind Configuration (`tailwind.config.ts`)

- **Theme:** Custom adventure/travel theme with brand colors
- **Dark Mode:** Class-based dark mode support
- **Animations:** Custom animations (`fade-in`, `scale-in`, `slide-up`, `float`)
- **Spacing & Colors:** Customized for the travel brand

### TypeScript Configuration (`tsconfig.json`)

- **Target:** Modern browser support
- **Module System:** ES modules
- **Strict Mode:** Relaxed for practical development
- **Path Aliases:** `@/*` -> `src/*`

---

## Database

### Architecture

Stories by Foot uses an abstraction layer that supports multiple databases:

**Development (Default)**
- **SQLite:** File-based database stored locally
- **Location:** Creates database files in the project root

**Production**
- **PostgreSQL:** Full-featured relational database
- **Connection:** Via `DATABASE_URL` environment variable

### Database Schema

The database includes tables for:

| Table | Purpose |
|-------|---------|
| `users` | User accounts, profiles, authentication |
| `bookings` | Trip bookings and reservations |
| `testimonials` | User reviews and experiences |
| `coupons` | Discount codes and promotions |
| `destinations` | Adventure destination data |
| `packages` | Trip package details |
| `bookings_bikes` | Bike selection for bookings |

### Accessing Database

**Development (SQLite):**
- Database file: `database.db` (created automatically)
- Tools: SQLiteStudio, DB Browser for SQLite, or VS Code SQLite extension

**Production (PostgreSQL):**
- Use pgAdmin, DBeaver, or psql CLI
- Connection string: `postgresql://user:password@host:port/dbname`

---

## API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword",
  "name": "John Doe"
}

Response: { userId, token, user }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword"
}

Response: { token, user }
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "credential": "google_jwt_token"
}

Response: { token, user, isNewUser }
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: { user }
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "1234567890",
  "nationality": "India",
  "passportNumber": "ABC123"
}

Response: { user }
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "packageId": "pkg_123",
  "startDate": "2024-05-01",
  "bikeType": "adventure",
  "guests": 2,
  "couponCode": "SUMMER20"
}

Response: { bookingId, status, totalPrice }
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer {token}

Response: [ { bookingId, status, date, totalPrice, ... } ]
```

#### Get Booking Details
```http
GET /api/bookings/{bookingId}
Authorization: Bearer {token}

Response: { bookingId, packageDetails, status, ... }
```

#### Cancel Booking
```http
POST /api/bookings/{bookingId}/cancel
Authorization: Bearer {token}

Response: { status, refund }
```

### Testimonials Endpoints

#### Submit Testimonial
```http
POST /api/testimonials
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking_123",
  "rating": 5,
  "comment": "Amazing experience!",
  "photos": ["url1", "url2"]
}

Response: { testimonialId, status: "pending" }
```

#### Get Testimonials (Public)
```http
GET /api/testimonials?limit=10&offset=0

Response: [ { userId, name, rating, comment, ... } ]
```

### Coupons Endpoints

#### Validate Coupon
```http
POST /api/coupons/validate
Content-Type: application/json

{
  "code": "SUMMER20",
  "packageId": "pkg_123",
  "amount": 50000
}

Response: { valid: true, discount: 5000, percentage: 10 }
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer {adminToken}

Response: { totalUsers, totalBookings, totalRevenue, ... }
```

#### Get All Users
```http
GET /api/admin/users?page=1&limit=20
Authorization: Bearer {adminToken}

Response: [ { userId, email, joinDate, bookings, ... } ]
```

---

## Authentication

### Authentication Flow

1. **User Registration/Login**
   - Email and password stored with bcryptjs hashing
   - JWT token issued upon successful authentication

2. **Token Storage**
   - JWT stored in browser's `localStorage`
   - Automatically included in API requests via `Authorization: Bearer {token}` header

3. **Google OAuth**
   - Integrated with `@react-oauth/google`
   - User data synced with backend
   - New user automatically created if not exists

4. **Protected Routes**
   - Routes check token existence
   - Redirect to login if not authenticated
   - Admin routes require admin role

### User Roles

- **Admin** - Full access to dashboard, user management, and analytics
- **User** - Access to bookings, dashboard, and testimonials
- **Guest** - Read-only access to public pages

---

## Architecture

### Frontend Architecture

**Component Structure:**
- **Pages:** Route-based page components
- **Components:** Reusable UI components
- **Contexts:** Global state management (Auth, Currency)
- **Hooks:** Custom React hooks for logic
- **Lib:** Utility functions and API client

**State Management:**
- **React Context:** Auth, Currency, Themes
- **React Query:** Server state and data caching
- **Local Storage:** Session persistence

**Styling:**
- **Tailwind CSS:** Utility-first CSS framework
- **CSS Modules:** Component-scoped styles where needed
- **Dark Mode:** Supported via Next.js themes

### Backend Architecture

**Request Flow:**
1. Express server receives request
2. Middleware handles CORS, parsing, authentication
3. Routes handle business logic
4. Database abstraction layer handles persistence
5. Response sent back to client

**Database Abstraction:**
- Single interface for SQLite and PostgreSQL
- Easy switching between databases
- Schema migrations handled by database implementations

**API Structure:**
- RESTful endpoints
- JWT-based authentication
- Error handling and validation
- CORS enabled for frontend requests

---

## Development Guide

### Code Standards

1. **TypeScript**
   - All new code should be TypeScript
   - Use proper typing for functions and components
   - Avoid `any` types when possible

2. **Component Structure**
   ```tsx
   // Import statements
   import React from 'react';
   
   // Types/Interfaces
   interface Props { /* ... */ }
   
   // Component
   export const MyComponent: React.FC<Props> = (props) => {
     return <div>{/* JSX */}</div>;
   };
   ```

3. **Naming Conventions**
   - Components: PascalCase (e.g., `UserProfile.tsx`)
   - Files: Match component name
   - Functions: camelCase (e.g., `fetchUserData()`)
   - Constants: UPPER_CASE (e.g., `API_BASE_URL`)

4. **File Organization**
   - One component per file (with exceptions for very small components)
   - Related files in same directory
   - Index files for cleaner imports

### Adding New Features

1. **Create Components** in `src/components/`
2. **Create Page** if it's a route in `src/pages/`
3. **Add Backend Routes** if needed in `backend/routes/`
4. **Add API Calls** in `src/lib/api.ts`
5. **Update Types** in `src/types/`
6. **Test the feature** in development

### Form Validation

Uses **React Hook Form** and **Zod**:

```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const MyForm = () => {
  const form = useForm({ resolver: zodResolver(schema) });
  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* */}</form>;
};
```

### Making API Calls

Use the provided API client:

```tsx
import { api } from '@/lib/api';

const { data, isLoading, error } = useQuery({
  queryKey: ['bookings'],
  queryFn: () => api.getBookings(),
});
```

---

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel

2. **Configure Environment**
   - Set environment variables in Vercel dashboard
   - Include `DATABASE_URL` for PostgreSQL

3. **Deploy**
   - Automatic deployments on push to main
   - Manual deployments available

### Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "dev:server"]
   ```

2. **Build and Run**
   ```bash
   docker build -t storiesbyfoot .
   docker run -p 3000:3000 -e DATABASE_URL="..." storiesbyfoot
   ```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/storiesbyfoot
JWT_SECRET=your_secure_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAILJS_SERVICE_ID=your_emailjs_service
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Troubleshooting

### Common Issues

#### 1. Blank Page / Module Not Found

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

#### 2. Port Already in Use

**Solution:**
```bash
# Kill process using port 3000 (or 5173)
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change port in vite.config.ts
```

#### 3. Database Connection Error

**Solution:**
- Check `DATABASE_URL` environment variable
- Ensure PostgreSQL is running (if using PostgreSQL)
- For SQLite, ensure write permissions in project directory

#### 4. Authentication Failing

**Solution:**
```bash
# Clear browser storage
# DevTools → Application → Storage → Clear All

# Check backend logs for errors
# Verify JWT_SECRET is set (if applicable)
```

#### 5. CORS Errors

**Solution:**
- Check `server.js` CORS configuration
- Ensure backend is running on correct port
- Verify proxy settings in `vite.config.ts`

#### 6. Build Fails

**Solution:**
```bash
# Check for TypeScript errors
pnpm lint

# Clear build cache
rm -rf dist node_modules/.vite

# Rebuild
pnpm build
```

### Getting Help

1. **Check Logs**
   - Terminal: Backend errors
   - Browser Console (F12): Frontend errors

2. **Review Code**
   - Similar features in codebase
   - Component patterns in `src/components/`

3. **Search Issues**
   - GitHub repository issues
   - Framework documentation (React, Express, etc.)

---

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Follow code standards
   - Test locally
   - Update documentation

3. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Describe changes
   - Reference any issues
   - Request review

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] No `console.log` statements (use appropriate logging)
- [ ] Error handling is implemented
- [ ] Database changes are backward compatible
- [ ] Tests pass (if applicable)
- [ ] Documentation is updated

---

## Performance Optimization

### Frontend
- **Code Splitting:** Routes are lazy-loaded
- **Image Optimization:** Use appropriate image formats
- **Bundle Analysis:** Monitor bundle size with build logs
- **Caching:** React Query handles data caching

### Backend
- **Database Indexing:** Indexes on frequently queried fields
- **Query Optimization:** Use efficient queries
- **Connection Pooling:** Configured for PostgreSQL

---

## Security Considerations

1. **Password Security**
   - Hashed with bcryptjs
   - Minimum length enforced
   - Never stored as plain text

2. **Authentication**
   - JWT tokens with expiration
   - Secure token storage (localStorage)
   - HTTPS enforced in production

3. **Data Protection**
   - SQL injection prevention (parameterized queries)
   - XSS protection (React escapes by default)
   - CORS validation
   - Input validation with Zod

4. **Environment Secrets**
   - Never commit `.env` files
   - Use environment variables
   - Use managed secrets in production

---

## License

[Add your license information here]

---

## Support & Feedback

- **Email:** support@storiesbyfoot.com
- **Website:** https://storiesbyfoot.vercel.app/
- **Issues:** Create an issue on the repository

---

**Last Updated:** April 2026

**Maintained by:** Stories by Foot Team
