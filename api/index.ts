import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import { initDB } from "../backend/db/index.js";
import authRoutes from "../backend/routes/auth.js";
import bookingRoutes from "../backend/routes/bookings.js";
import testimonialRoutes from "../backend/routes/testimonials.js";
import couponRoutes from "../backend/routes/coupons.js";
import adminRoutes from "../backend/routes/admin.js";

let app: any = null;

async function createApp() {
  if (app) return app;

  const newApp = express();

  // Middleware
  newApp.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "userId"],
      credentials: false,
    })
  );
  newApp.use(express.json());

  // Initialize database
  try {
    await initDB();
  } catch (error) {
    console.error("Database initialization error:", error);
  }

  // API Routes
  newApp.use("/api/auth", authRoutes);
  newApp.use("/api/bookings", bookingRoutes);
  newApp.use("/api/testimonials", testimonialRoutes);
  newApp.use("/api/coupons", couponRoutes);
  newApp.use("/api/admin", adminRoutes);

  // Health check
  newApp.get("/api/health", (req: any, res: any) => {
    res.json({
      status: "ok",
      message: "Backend is running on Vercel serverless",
      timestamp: new Date().toISOString(),
    });
  });

  // Region detection
  newApp.get("/api/region", (req: any, res: any) => {
    const countryFromHeader = req.headers["x-vercel-ip-country"];
    const country = countryFromHeader ? countryFromHeader.toUpperCase() : null;
    res.json({ region: country || null });
  });

  app = newApp;
  return app;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const expressApp = await createApp();

    return new Promise((resolve) => {
      expressApp(req, res);
      // Ensure response is sent
      res.on("finish", () => {
        resolve(null);
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
