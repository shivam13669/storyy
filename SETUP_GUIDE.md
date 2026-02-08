# StoriesByFoot - Complete Setup Guide

## Quick Start

```bash
# Install dependencies
pnpm install

# Start both servers
pnpm dev

# That's it! App opens at http://localhost:3001
```

## Architecture Explained

### Development Mode (`pnpm dev`)

```
User → Express (port 3001)
         ├── API requests (/api/*) → Handled by Express backend
         └── Non-API requests → Proxied to Vite (port 5000)
         
Vite (port 5000)
         ├── Serves HTML/CSS/JS to Express
         ├── Has hot reload enabled
         └── Proxies /api to Express (3001)
```

**What this means:**
- Access the app from port 3001 (Express server)
- Express acts as a gateway:
  - `/api/*` → Handled locally (backend database, auth, etc.)
  - Everything else → Sent to Vite (frontend with live reload)
- This setup allows both hot reload AND working API calls

### Production Mode

```
User → Express (port 5000)
         ├── Serves static files from ./dist
         ├── API requests (/api/*) → Handled by backend
         └── Non-existent routes → Sends index.html (SPA routing)
```

**What this means:**
- Single server serves everything
- No hot reload (production)
- Optimized static files for speed

## Port Configuration

| Component | Dev Port | Prod Port | Env Variable |
|-----------|----------|-----------|--------------|
| Express Backend | 3001 | 5000 | `PORT` |
| Vite Frontend | 5000 | N/A | `VITE_PORT` |
| Backend for Vite proxy | 3001 | N/A | `VITE_BACKEND_URL` |

## Commands

### Development
```bash
# Start everything (recommended)
pnpm dev

# Or run separately
pnpm dev:server    # Express on 3001
pnpm dev:frontend  # Vite on 5000
```

### Production
```bash
# Build frontend
pnpm build

# Set production mode
export NODE_ENV=production

# Start server (serves dist + API)
node server.js
```

### Other
```bash
pnpm lint      # Check code
pnpm preview   # Preview production build locally
```

## Troubleshooting

### "Cannot GET /" Error
**Cause**: Frontend isn't being served properly

**Solution**:
1. Make sure both servers are running: `pnpm dev`
2. Access from port 3001: `http://localhost:3001`
3. Check backend is running on port 3001
4. Check Vite is running on port 5000

### API calls failing
**Cause**: Backend not responding

**Solution**:
1. Ensure `pnpm dev` shows both servers starting
2. Check `/api/health` endpoint: `curl http://localhost:3001/api/health`
3. Verify database initialized (you'll see "Connected to SQLite database" in logs)

### "Cannot connect to API" in frontend
**Cause**: Frontend can't reach backend

**Solution**:
1. Check browser DevTools → Network tab
2. Verify API request URLs start with `/api`
3. Ensure Express is on 3001 and accepting requests

### HMR Connection Errors
**Cause**: Hot Module Replacement issues in remote environments

**Solution**:
- Already fixed! Auto-detects remote environments (Replit, Builder.io, etc.)
- Manual override: `VITE_DISABLE_HMR=true pnpm dev`

## Environment Variables (.env)

```bash
# Backend port (default: 3001 for dev, 5000 for prod)
PORT=3001

# Frontend port (default: 5000)
VITE_PORT=5000

# Backend URL for Vite proxy (default: http://localhost:3001)
VITE_BACKEND_URL=http://localhost:3001

# For remote development (Replit, etc.)
VITE_HMR_HOST=your-url.replit.dev
VITE_HMR_PORT=443
VITE_HMR_PROTOCOL=wss

# Environment mode
NODE_ENV=development
```

## Project Structure

```
├── server.js                 # Express server (API + frontend proxy)
├── vite.config.ts            # Vite configuration (frontend build + proxy)
├── package.json              # Dependencies
├── index.html                # HTML entry point
├── src/
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Main component with routing
│   ├── pages/               # Route pages
│   ├── components/          # Reusable components
│   ├── lib/api.ts           # API client functions
│   └── ...
├── backend/
│   ├── db.js                # SQLite database
│   └── routes/auth.js       # Authentication endpoints
└── dist/                    # Production build output (after pnpm build)
```

## How API Calls Work

### Development
```
React Component
  ↓
fetch('/api/auth/login')
  ↓
Express (3001) receives request
  ↓
Handled by backend/routes/auth.js
  ↓
Response sent back to React
```

### Production
```
React Component (in dist/)
  ↓
fetch('/api/auth/login')
  ↓
Express (5000) receives request
  ↓
Handled by backend/routes/auth.js
  ↓
Response sent back to React
```

**Key point**: Frontend always uses `/api` (relative path). The server automatically routes it correctly.

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot GET /" | Frontend not served | Use port 3001, not 5000 |
| API fails | Backend not running | Check `pnpm dev` started both servers |
| Blank page | JavaScript error | Check browser console (F12) |
| Hot reload not working | HMR disabled | Only works in development mode |
| Port already in use | Another app using port | Kill process: `lsof -ti:3001 \| xargs kill` |

## Next Steps

1. ✅ Install: `pnpm install`
2. ✅ Run: `pnpm dev`
3. ✅ Access: `http://localhost:3001`
4. ✅ Code: Edit files, see live reload
5. ✅ Build: `pnpm build` (creates dist/)
6. ✅ Deploy: Deploy dist/ + node server.js

Happy coding!
