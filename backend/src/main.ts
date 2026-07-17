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
validateEnv();

const app = express();
app.set("trust proxy", 1);

// ✅ Allowed origins
const allowedOrigins = [
  "https://stratify-sigma.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// ✅ Proper CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server, curl, Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    logger.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

// ✅ Handle preflight requests globally
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Logging setup
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});
app.use(morgan("combined", { stream: accessLogStream }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ✅ Database connection
connectDB()
  .then(() => logger.info("MongoDB Connected"))
  .catch((err) => {
    logger.error(err);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Debugging middleware (non-production)
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log("Origin:", req.headers.origin);
    console.log("Cookies:", req.cookies);
    next();
  });
}

// ✅ API routes
app.use("/api", router);

// ✅ Error handler
app.use(errorMiddleware);

const server = http.createServer(app);

// ✅ Socket.io setup
const io = initSocket(server);
SocketService.setIO(io);

// ✅ Meeting scheduler
const meetingScheduler = new MeetingScheduler(
  new MeetingRepository(),
  new ProjectRepository(),
  new NotificationRepository()
);
meetingScheduler.start();

const PORT = Number(process.env.PORT) || 7000;
server.listen(PORT, () => {
  logger.info(`Server running on ${PORT}`);
});
server.timeout = 30000;

export { io };
