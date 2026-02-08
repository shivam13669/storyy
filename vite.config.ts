import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine backend URL for proxy
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:3001';
  const port = parseInt(process.env.VITE_PORT || '5000');

  // Configure HMR (Hot Module Replacement) based on environment
  // IMPORTANT: HMR should ALWAYS be disabled for production builds
  let hmrConfig;

  // Production build: Always disable HMR
  if (mode === 'production' || process.env.NODE_ENV === 'production') {
    hmrConfig = false;
  }
  // Priority 1: Explicit HMR configuration via environment variables (for Replit, Render, etc.)
  else if (process.env.VITE_HMR_HOST && process.env.VITE_HMR_PORT) {
    hmrConfig = {
      host: process.env.VITE_HMR_HOST,
      port: parseInt(process.env.VITE_HMR_PORT),
      protocol: process.env.VITE_HMR_PROTOCOL || 'ws',
    };
  }
  // Priority 2: Explicitly disabled via env variable
  else if (process.env.VITE_DISABLE_HMR === 'true') {
    hmrConfig = false;
  }
  // Priority 3: Auto-detect - only enable for true local development
  // Disable in: Builder.io preview, Replit, or any remote environment
  else {
    // Check for known remote environments
    const isKnownRemote =
      process.env.REPLIT_OWNER ||           // Replit
      process.env.RENDER ||                  // Render
      process.env.RAILWAY_ENVIRONMENT_NAME || // Railway
      process.env.VERCEL ||                  // Vercel
      process.env.NETLIFY ||                 // Netlify
      process.env.CI ||                      // CI/CD
      process.env.BUILDER ||                 // Builder.io
      process.env.CODESANDBOX_SSE;           // CodeSandbox

    if (isKnownRemote) {
      // Disable HMR in remote environments
      hmrConfig = false;
    } else {
      // Enable HMR only for true local development
      hmrConfig = {
        host: 'localhost',
        port: port,
        protocol: 'ws',
      };
    }
  }

  return {
    server: {
      host: "0.0.0.0",
      port: port,
      allowedHosts: true,
      hmr: hmrConfig,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
    build: {
      // Ensure HMR is completely disabled in builds
      minify: 'terser',
      sourcemap: false,
      // Don't include dev code in production
      rollupOptions: {
        output: {
          // Optimize chunk splitting
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
          }
        }
      }
    },
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ['sql.js'],
    },
    worker: {
      format: 'es',
    },
  };
});
