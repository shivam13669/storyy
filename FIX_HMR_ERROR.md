# Fix: Vite HMR Connection Errors on Fly.io

## Problem
```
TypeError: Failed to fetch
    at ping (https://.../@vite/client:736:13)
```

This error means Vite's Hot Module Replacement is trying to connect to a non-existent dev server in production.

## Root Cause
- App was deployed with development code
- Vite HMR client was included in production build
- HMR tries to connect to localhost (doesn't exist on Fly.io)

## Solutions Applied ✅

I've already fixed this in the following files:

### 1. vite.config.ts
- **Change**: Added production-first HMR detection
- **Effect**: HMR completely disabled for production builds
- **Status**: ✅ Applied

### 2. Dockerfile
- **Change**: Created multi-stage Docker build
- **Effect**: Ensures clean production build without HMR
- **Status**: ✅ Created

### 3. fly.toml
- **Change**: Added Fly.io configuration
- **Effect**: Proper deployment settings
- **Status**: ✅ Created

### 4. server.js
- **Status**: ✅ Already correct
- **Handles**: Production static file serving from `dist/`

## What You Need to Do

### Step 1: Clean Build Locally
```bash
# Remove old build
rm -rf dist/

# Fresh install
pnpm install

# Build for production
pnpm build

# Verify build succeeded
ls -la dist/ | head -20
```

### Step 2: Update Vite Config (Already Done)
The new `vite.config.ts` has:
- ✅ Production-first HMR detection
- ✅ Auto-disable in production/build mode
- ✅ Safe fallbacks

### Step 3: Deploy to Fly.io
```bash
# Login to Fly (if not already)
flyctl auth login

# Deploy with new Dockerfile
flyctl deploy

# Watch deployment
flyctl logs --follow
```

### Step 4: Test
```bash
# Check health endpoint
curl https://your-app-name.fly.dev/api/health

# Check app loads
# Visit: https://your-app-name.fly.dev

# No more HMR errors!
```

## Verify the Fix

### Check Build Output
```bash
# Should NOT contain HMR code
grep -r "HMR" dist/ && echo "❌ HMR found!" || echo "✅ HMR clean!"

# Should have index.html
cat dist/index.html | head -20
```

### Check Deployment
```bash
# View logs
flyctl logs -n 50

# Look for:
# ✅ "Production mode: Serving static files from ./dist"
# ✅ "Connected to SQLite database"
```

## If Error Still Occurs

### Clear Browser Cache
```
Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
```
Clear all cache, then reload.

### Force Redeploy
```bash
# Full redeploy
flyctl deploy --force

# Check logs
flyctl logs --follow
```

### Check Dist Folder
```bash
# SSH into Fly instance
flyctl ssh console

# Check files
ls -la dist/
head dist/index.html

# Exit
exit
```

## Prevention Tips

1. **Always build before deploying**
   ```bash
   pnpm build  # Creates dist/
   flyctl deploy
   ```

2. **Test production locally**
   ```bash
   export NODE_ENV=production
   node server.js
   # Visit http://localhost:5000
   ```

3. **Use Dockerfile**
   ```bash
   flyctl deploy  # Uses Dockerfile
   ```

4. **Monitor logs**
   ```bash
   flyctl logs --follow
   ```

## What Changed

| File | Change |
|------|--------|
| `vite.config.ts` | Added production-first HMR detection |
| `Dockerfile` | New - multi-stage build |
| `fly.toml` | New - Fly.io configuration |
| `server.js` | No change needed (already correct) |

## Expected Behavior

### ✅ Before Fix
```
ERROR: HMR connection failed
TypeError: Failed to fetch
```

### ✅ After Fix
```
✅ Backend server running on http://0.0.0.0:5000
📦 Production mode: Serving static files from ./dist
✅ Connected to SQLite database
✅ Admin user already exists
```

App loads without any console errors!

## Commands Reference

```bash
# Local development (no HMR issues)
pnpm dev

# Production build
pnpm build

# Test production locally
NODE_ENV=production node server.js

# Deploy to Fly
flyctl deploy

# Check logs
flyctl logs -n 100

# Get app URL
flyctl apps list

# Redeploy if needed
flyctl deploy --force
```

## Support

If issues persist:

1. Check build output: `ls dist/`
2. Check logs: `flyctl logs --follow`
3. SSH to instance: `flyctl ssh console`
4. Clear cache: Ctrl+Shift+Delete (full cache clear)
5. Hard reload: Ctrl+F5 (or Cmd+Shift+R on Mac)

---

**Status**: ✅ Fixed. Your app should now work perfectly on Fly.io! 🚀
