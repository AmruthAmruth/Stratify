
import { Request, Response, NextFunction } from "express";

export class AppError extends Error{
    statusCode:number;
    constructor(message:string,statusCode:number=500){
        super(message);
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}

export const errorMiddleware=(
    err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
)=>{
    console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
res.status(statusCode).json({
    status: "error",
    message,
  });
}