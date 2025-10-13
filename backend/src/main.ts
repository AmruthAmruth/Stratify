import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import { errorMiddleware } from "./interfaces/middleware/ErrorMiddleware";
import router from "./router";
import { createSocketGateway } from "./di/ChatDI";
 
dotenv.config(); 

const app = express();

// -------------------------------------
// CORS Configuration
// --------------------------------- ----
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// -------------------------------------
// Middleware for parsing requests
// -------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------------------------
// Logging Configuration
// -------------------------------------
const logDirectory = path.join(__dirname, "logs");
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

// -------------------------------------
// Connect to MongoDB
// -------------------------------------
connectDB();

// -------------------------------------
// API Routes
// -------------------------------------
app.use("/api", router);

// -------------------------------------
// Error Handling Middleware
// -------------------------------------
app.use(errorMiddleware);

// -------------------------------------
// HTTP & WebSocket Server Initialization
// -------------------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// -------------------------------------
// Socket.IO Gateway Initialization
// -------------------------------------
const socketGateway = createSocketGateway(io);
socketGateway.init();

// -------------------------------------
// Start Server
// -------------------------------------
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`💬 WebSocket running and ready for connections`);
});
