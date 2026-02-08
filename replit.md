# StoriesByFoot - Travel Adventure Website

## Overview
A travel adventure website built with React + TypeScript frontend and Node.js/Express backend. Features destination browsing, user authentication, admin dashboard, testimonials, and currency conversion.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js API server
- **Database**: SQLite via sql.js (file-based at `story.db`)
- **Communication**: Vite proxy routes `/api` requests to backend

## Project Structure
```
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route pages
│   ├── context/            # React contexts (Auth, Currency)
│   ├── lib/                # Utilities (API client, currency, etc.)
│   ├── data/               # Static data (destinations)
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Images and static assets
├── backend/                # Express backend
│   ├── db.js               # SQLite database initialization
│   └── routes/auth.js      # Authentication routes
├── server.js               # Express server entry point
├── vite.config.ts          # Vite configuration
├── .env.example            # Environment variables template
└── package.json            # Dependencies and scripts
```

## Configuration

### Port Configuration
- **Frontend (Vite)**: Port 5000 (configurable via `VITE_PORT`)
- **Backend (Express)**: Port 3001 in dev, 5000 in production (configurable via `PORT`)

### How It Works
1. **Local Development**: Both servers run concurrently
   - Vite dev server on port 5000
   - Express API on port 3001
   - Vite proxy routes `/api` requests to `http://localhost:3001`

2. **Production/Builder.io**: Single server serves everything
   - Express serves static frontend files
   - Express handles `/api` routes
   - Frontend uses relative `/api` path for API calls

3. **Replit & Remote Environments**: Auto-detected and configured
   - HMR (Hot Module Replacement) automatically disabled to prevent connection errors
   - API communication uses Vite proxy

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
# Port configuration
VITE_PORT=5000
PORT=3001

# Backend URL for proxy
VITE_BACKEND_URL=http://localhost:3001

# For remote development (Replit, Render, etc.)
# Uncomment and set if needed:
# VITE_HMR_HOST=your-replit-url.replit.dev
# VITE_HMR_PORT=443
# VITE_HMR_PROTOCOL=wss
```

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:8080" or similar HMR errors
**Cause**: Hot Module Replacement trying to connect to localhost in a remote environment.

**Solution**: The config now automatically detects remote environments (Replit, Render, Railway) and disables HMR. If you still get this error:

1. Refresh the browser page
2. Check `NODE_ENV` is not set to `production` in development
3. For custom remote environments, set HMR environment variables (see `.env.example`)

### Error: "Cannot connect to API"
**Cause**: Frontend can't reach backend API.

**Solution**:
1. Ensure both servers are running: `npm run dev`
2. Check backend is on port 3001 (or set via `PORT` env var)
3. Verify `VITE_BACKEND_URL` matches your backend URL

### Frontend shows but API calls fail
**Cause**: API proxy misconfigured or backend not running.

**Solution**:
1. Check backend server is running: `npm run dev:server`
2. Verify proxy configuration in `vite.config.ts`
3. Check browser DevTools → Network tab to see actual API request URLs

## Development Commands

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev

# Start only frontend (Vite)
npm run dev:frontend

# Start only backend (Express)
npm run dev:server

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

## Recent Changes (2026-02-06)
- Fixed HMR configuration to prevent remote environment connection errors
- Added smart environment detection (Replit, Render, Railway, etc.)
- Improved API routing with configurable proxy
- Enhanced authentication flow with proper API integration
- Fixed LoginModal component with real backend calls and toast notifications
- Added `.env.example` for configuration guidance
