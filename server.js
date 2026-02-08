import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './backend/db.js';
import authRoutes from './backend/routes/auth.js';
import proxyMiddleware from 'express-http-proxy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use PORT env variable if available, otherwise use 3001 for dev, 5000 for production
const PORT = parseInt(process.env.PORT || (process.env.NODE_ENV === 'production' ? '5000' : '3001'));

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (you can restrict this later)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());

// Initialize database
initDB().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Region detection endpoint (for currency/locale detection)
app.get('/api/region', (req, res) => {
  // Detection priority:
  // 1. Manual query parameter override
  // 2. Vercel IP country header (production on Vercel)
  // 3. Cloudflare country header (if behind Cloudflare)
  // 4. Accept-Language header
  // 5. Return null (unknown) so client applies 20% markup

  const queryRegion = req.query.region;
  if (queryRegion && typeof queryRegion === 'string') {
    return res.json({ region: queryRegion.toUpperCase() });
  }

  // Priority 1: Vercel Edge Network header (most reliable)
  const vercelCountry = req.headers['x-vercel-ip-country'];
  if (vercelCountry && typeof vercelCountry === 'string') {
    console.log(`[REGION] Detected from Vercel IP: ${vercelCountry}`);
    return res.json({ region: vercelCountry.toUpperCase() });
  }

  // Priority 2: Cloudflare header
  const cloudflareCountry = req.headers['cf-ipcountry'];
  if (cloudflareCountry && typeof cloudflareCountry === 'string') {
    console.log(`[REGION] Detected from Cloudflare IP: ${cloudflareCountry}`);
    return res.json({ region: cloudflareCountry.toUpperCase() });
  }

  // Priority 3: Accept-Language header (less reliable but better than nothing)
  const acceptLanguage = req.headers['accept-language'] || '';
  const languageRegionMap = {
    'hi': 'IN',
    'en-IN': 'IN',
    'en-US': 'US',
    'en-GB': 'GB',
    'fr': 'FR',
    'de': 'DE',
    'es': 'ES',
    'ja': 'JP',
    'zh': 'CN',
  };

  const primaryLanguage = acceptLanguage.split(',')[0].trim().split(';')[0];
  if (languageRegionMap[primaryLanguage]) {
    console.log(`[REGION] Detected from Accept-Language: ${primaryLanguage} -> ${languageRegionMap[primaryLanguage]}`);
    return res.json({ region: languageRegionMap[primaryLanguage] });
  }

  // If no detection succeeded, return null
  // Client will treat this as unknown region and apply 20% markup as safety measure
  console.log('[REGION] Could not detect region, returning null');
  res.json({ region: null });
});

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  // Production: Serve static files from dist folder
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));

  // SPA: Send index.html for any non-API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Development: Proxy non-API requests to Vite dev server
  const viteUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5000';

  app.use((req, res, next) => {
    // Skip proxying for API routes - they're handled by Express
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Proxy everything else to Vite dev server
    proxyMiddleware(viteUrl, {
      proxyReqPathResolver: (req) => req.path + req.url.slice(req.path.length),
    })(req, res, next);
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server running on http://0.0.0.0:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`📦 Production mode: Serving static files from ./dist`);
  } else {
    console.log(`🚀 Development mode:`);
    console.log(`   Access app from: http://0.0.0.0:${PORT}`);
    console.log(`   Frontend: Vite dev server (http://localhost:5000)`);
    console.log(`   API endpoint: http://0.0.0.0:${PORT}/api`);
    console.log(`   Non-API requests proxy to Vite`);
  }
});
