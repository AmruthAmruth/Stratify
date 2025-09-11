
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
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
app.use(morgan("dev"));

connectDB();

app.use("/super-admin", superAdminRouter);
app.use("/company", companyRouter);



app.use(errorMiddleware);
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => { 
  console.log(`Server running on http://localhost:${PORT}`);
});
 