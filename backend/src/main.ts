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



dotenv.config();

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = ["http://localhost:5173", "thunder-client://"];

      // allow undefined origins (Thunder, Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      const hostname = new URL(origin).hostname;

      if (
        allowed.includes(origin) ||
        /\.trycloudflare\.com$/.test(hostname)
      ) {
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
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));


connectDB()
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB connection failed:", err));
  
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api", router);
  
app.use(errorMiddleware);


const server = http.createServer(app);
const io = initSocket(server)
import { SocketService } from "./shared/services/SocketService";
SocketService.setIO(io);

import { MeetingScheduler } from "./infrastructure/scheduler/MeetingScheduler";
const meetingScheduler = new MeetingScheduler();
meetingScheduler.start();

export { io }

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
