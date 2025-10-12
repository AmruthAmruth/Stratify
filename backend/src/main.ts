import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./interfaces/middleware/ErrorMiddleware";
import router from "./router";
import http from "http";
import { Server } from "socket.io";
import socketHandlers from "./interfaces/adapters/socketHandlers";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware for parsing JSON, URL-encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging setup
const logDirectory = path.join(__dirname, "logs");
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

// Connect to database
connectDB();

// Routes
app.use("/api", router); 

// Error handling middleware
app.use(errorMiddleware);

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize socket handlers
socketHandlers(io);

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});