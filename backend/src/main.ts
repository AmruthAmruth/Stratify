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


import { errorMiddleware } from "./interfaces/middleware/ErrorMiddleware";
import router from "./router";


import { initSocket } from "./infrastructure/socket/SocketServer";
import { SocketService } from "./shared/services/SocketService";


import { MeetingScheduler } from "./infrastructure/scheduler/MeetingScheduler";
import { MeetingRepository } from "./infrastructure/repositories/MeetingRepository";
import { ProjectRepository } from "./infrastructure/repositories/ProjectRepository";
import { NotificationRepository } from "./infrastructure/repositories/NotificationRepository";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = ["http://localhost:5173", "thunder-client://"];
      if (!origin) return callback(null, true);
      const hostname = new URL(origin).hostname;
      if (allowed.includes(origin) || /\.trycloudflare\.com$/.test(hostname)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));


connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api", router);

app.use(errorMiddleware);


const server = http.createServer(app);
const io = initSocket(server);
SocketService.setIO(io);


const meetingRepo = new MeetingRepository();
const projectRepo = new ProjectRepository();
const notificationRepo = new NotificationRepository();

const meetingScheduler = new MeetingScheduler(meetingRepo, projectRepo, notificationRepo);
meetingScheduler.start();

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Set server timeout to 30 seconds to prevent indefinite hanging
server.timeout = 30000; // 30 seconds

export { io };
