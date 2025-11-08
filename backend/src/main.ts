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
import { initSocket } from "./infrastructure/socket/NotificationSocket";



dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
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

  
app.use("/api", router);

app.use(errorMiddleware);


const server = http.createServer(app);
const io=initSocket(server)
export {io}

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
 