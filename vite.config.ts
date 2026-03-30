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

  // Always disable HMR - it causes issues in remote environments
  // This prevents fetch errors from trying to connect to unreachable HMR servers
  hmrConfig = false;

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
