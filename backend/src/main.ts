import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import superAdminRouter from "./interfaces/routes/SuperAdminRoutes";
import companyRouter from "./interfaces/routes/CompanyRoutes";
import cors from 'cors';
import { errorMiddleware } from "./interfaces/middleware/ErrorMiddleware";

dotenv.config();

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logDirectory = path.join(__dirname, "logs");


const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",  
  path: logDirectory,
  maxFiles: 7      
});

app.use(morgan("combined", { stream: accessLogStream }));


app.use(morgan("dev"));


connectDB();


app.use("/super-admin", superAdminRouter);
app.use("/company", companyRouter);


app.use(errorMiddleware);


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 