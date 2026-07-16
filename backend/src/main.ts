import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import fs from "fs";
// cors package removed in favour of manual CORS middleware below
import cookieParser from "cookie-parser";
import http from "http";
import helmet from "helmet";

import { errorMiddleware } from "./interfaces/middleware/ErrorMiddleware";
import router from "./router";
import { validateEnv } from "./config/validateEnv";
import logger from "./shared/utils/logger";
   
import { initSocket } from "./infrastructure/socket/SocketServer";
import { SocketService } from "./shared/services/SocketService";
 
import { MeetingScheduler } from "./infrastructure/scheduler/MeetingScheduler";
import { MeetingRepository } from "./infrastructure/repositories/MeetingRepository";
import { ProjectRepository } from "./infrastructure/repositories/ProjectRepository";
import { NotificationRepository } from "./infrastructure/repositories/NotificationRepository";


dotenv.config();

// ----------------------------------------------------
// Validate environment variables
// ----------------------------------------------------
validateEnv();

// ----------------------------------------------------
// Create app
// ----------------------------------------------------
const app = express();

/* ✅ REQUIRED for EC2 / Nginx / Rate-Limit */
app.set("trust proxy", 1); 

// ----------------------------------------------------
// Security
// ----------------------------------------------------
app.use(
  helmet({ 
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ----------------------------------------------------
// CORS — manual middleware (works for ALL responses incl. errors)
// ----------------------------------------------------
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins: string[] = [
  "https://stratify-sigma.vercel.app", // production Vercel frontend (hardcoded)
];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

if (!isProduction) {
  allowedOrigins.push(
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  );
}

/**
 * Manual CORS middleware.
 * Sets Access-Control-* headers on EVERY response — including 4xx/5xx errors.
 * The `cors` npm package is not used here because its callback approach can
 * fail to attach headers when downstream middleware calls next(err) early.
 */
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
  }

  // Respond immediately to preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

// ----------------------------------------------------
// Body parsers
// ----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------------------------------------------
// Logging
// ----------------------------------------------------
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});

app.use(morgan("combined", { stream: accessLogStream }));

if (!isProduction) {
  app.use(morgan("dev"));
}

// ----------------------------------------------------
// Database (SAFE for PM2)
// ----------------------------------------------------
connectDB()
  .then(() => logger.info("✅ MongoDB Connected"))
  .catch((err) => {
    logger.error("❌ MongoDB connection failed", err);

    // ❌ never hard-crash production
    if (!isProduction) {
      process.exit(1);
    }
  });

// ----------------------------------------------------
// Static files
// ----------------------------------------------------
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ----------------------------------------------------
// Health check
// ----------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ----------------------------------------------------
// API routes
// ----------------------------------------------------
app.use("/api", router);

// ----------------------------------------------------
// Error handler (LAST middleware)
// ----------------------------------------------------
app.use(errorMiddleware);

// ----------------------------------------------------
// HTTP + Socket
// ----------------------------------------------------
const server = http.createServer(app); 
const io = initSocket(server);
SocketService.setIO(io);

// ----------------------------------------------------
// Scheduler
// ----------------------------------------------------
const meetingRepo = new MeetingRepository();
const projectRepo = new ProjectRepository();
const notificationRepo = new NotificationRepository();

const meetingScheduler = new MeetingScheduler(
  meetingRepo,
  projectRepo,
  notificationRepo
);
meetingScheduler.start();

// ----------------------------------------------------
// Start server
// ----------------------------------------------------
const PORT = Number(process.env.PORT) || 7000;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Timeout for long requests
server.timeout = 30000;

export { io };
