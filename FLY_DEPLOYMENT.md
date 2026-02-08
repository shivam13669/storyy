# Deploying to Fly.io

This guide helps you deploy the StoriesByFoot application to Fly.io.

## Prerequisites

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Have a Fly.io account (sign up at https://fly.io)
3. Your application is ready to deploy (tested locally)

## Deployment Steps

### 1. Login to Fly
```bash
flyctl auth login
```

### 2. Create Fly App (First Time Only)
```bash
flyctl apps create your-app-name
```

Or let Fly auto-create it during deployment.

### 3. Build and Deploy

#### Option A: Automatic Deployment (Recommended)
```bash
# Build the frontend
pnpm build

# Deploy to Fly
flyctl deploy
```

#### Option B: Manual with Docker
```bash
flyctl deploy --dockerfile Dockerfile
```

### 4. Check Deployment Status
```bash
# View logs
flyctl logs

# Check app status
flyctl status

# Get app URL
flyctl apps list
```

## Configuration

### Environment Variables

Set these in Fly:
```bash
flyctl secrets set NODE_ENV=production
```

Or set via `fly.toml`:
```toml
[env]
  NODE_ENV = "production"
```

## Troubleshooting

### "Cannot GET /" Error
**Solution**: Make sure `dist/` folder exists and is populated
```bash
# Verify build
ls -la dist/

# If empty, rebuild:
pnpm install
pnpm build
```

### HMR Connection Errors (Vite errors)
**Status**: ✅ Fixed in this version
- HMR is automatically disabled for production builds
- If still seeing errors, clear browser cache and reload

### Database Issues
**Solution**: Database file is created automatically on first run
```bash
# Check if database was created
flyctl ssh console
ls -la story.db
```

### Port Issues
**Solution**: Fly.io automatically assigns ports, but configure in `fly.toml`:
```toml
[[services]]
  internal_port = 5000
  protocol = "tcp"
  
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
```

## Dockerfile

If `Dockerfile` doesn't exist, create one:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build frontend
RUN pnpm build

# Expose port
EXPOSE 5000

# Start server
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

## fly.toml Configuration

Create or update `fly.toml`:

```toml
app = "your-app-name"
primary_region = "lax"

[build]
  builder = "paketobuildpacks"

[env]
  NODE_ENV = "production"

[[services]]
  internal_port = 5000
  protocol = "tcp"
  
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
  
  [[services.ports]]
    port = 80
    handlers = ["http"]
  
  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[checks]
  [checks.http]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    path = "/api/health"
    protocol = "http"
    timeout = "5s"
    type = "http"
```

## Monitoring

### View Logs
```bash
# Real-time logs
flyctl logs --follow

# Last 100 lines
flyctl logs -n 100
```

### SSH Access
```bash
# Connect to instance
flyctl ssh console

# Check files
ls -la
ps aux | grep node

# Exit
exit
```

## Updates & Redeployment

### Deploy Latest Version
```bash
# Build
pnpm build

# Deploy
flyctl deploy
```

### Rollback
```bash
# Check releases
flyctl releases

# Rollback to previous
flyctl releases rollback
```

### Environment Variables
```bash
# List all secrets
flyctl secrets list

# Set new secret
flyctl secrets set NEW_VAR=value

# Remove secret
flyctl secrets unset VAR_NAME
```

## Performance Tips

1. **Compression**: Express gzip is enabled by default
2. **Static Files**: Served from `dist/` with browser caching
3. **Database**: SQLite keeps data local; persist with volumes if needed

### Add Database Persistence (Optional)
```bash
flyctl volumes create data
```

Then update `fly.toml`:
```toml
[[mounts]]
  source = "data"
  destination = "/app/data"
```

And in `server.js`, change database path:
```javascript
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'story.db');
```

## Monitoring & Errors

### Health Check
The app has a health check endpoint at `/api/health` that Fly monitors.

Check it manually:
```bash
curl https://your-app-name.fly.dev/api/health
```

### Common Errors

| Error | Solution |
|-------|----------|
| `Cannot GET /` | Ensure `pnpm build` completed successfully |
| `HMR connection failed` | Already fixed; clear cache and reload |
| `API endpoints 404` | Check backend is running (`/api/health`) |
| `Database locked` | Restart app with `flyctl restart` |

## Cost Considerations

Fly.io offers a free tier with:
- 3 shared-cpu-1x 256MB VMs
- 160GB bandwidth
- 3GB persistent storage

Your app fits within free tier! ✅

## Domain Setup

To use custom domain:
```bash
# Add domain
flyctl certs add your-domain.com

# Check DNS records
flyctl certs show your-domain.com
```

Update your domain's DNS to point to Fly.

## Next Steps

1. ✅ Deploy: `flyctl deploy`
2. ✅ Monitor: `flyctl logs --follow`
3. ✅ Scale: `flyctl scale count 2` (for multiple instances)
4. ✅ Monitor: Set up alerts in Fly Dashboard

Happy deploying! 🚀
