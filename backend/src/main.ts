import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import fs from "fs";
import cors from "cors";   
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
// CORS
// ----------------------------------------------------
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  process.env.FRONTEND_URL!, // Production frontend URL
];

// Add localhost origins for local development
if (!isProduction) {
  allowedOrigins.push(
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) =>
        origin.startsWith(allowed)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
