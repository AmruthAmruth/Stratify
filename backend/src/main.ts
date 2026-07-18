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
import { buildCorsOptions, getAllowedOrigins } from "./config/corsConfig";

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

const allowedOrigins = getAllowedOrigins();
const corsOptions = buildCorsOptions();

// CORS must run before helmet and all routes (including OPTIONS preflight).
app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

const logDirectory = path.join(__dirname, "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});

app.use(
  morgan("combined", {
    stream: accessLogStream,
  }),
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));

  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log("Origin:", req.headers.origin);
    next();
  });
}

connectDB()
  .then(() => {
    logger.info("MongoDB Connected");
  })
  .catch((err) => {
    logger.error(err);

    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads")),
);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
  });
});

app.use("/api", router);

app.use(errorMiddleware);

const server = http.createServer(app);

const io = initSocket(server);

SocketService.setIO(io);

const meetingScheduler = new MeetingScheduler(
  new MeetingRepository(),
  new ProjectRepository(),
  new NotificationRepository(),
);

meetingScheduler.start();

const PORT = Number(process.env.PORT) || 7000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Allowed origins: ${allowedOrigins.join(", ")}`);
});

server.timeout = 30000;

export { io };
