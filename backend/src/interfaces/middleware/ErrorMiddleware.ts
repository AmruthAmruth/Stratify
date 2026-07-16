import { Request, Response, NextFunction } from "express";
import { Messages } from "../../shared/constants/messages";

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const ALLOWED_ORIGINS_FOR_ERRORS = [
  "https://stratify-sigma.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", err);

  // Re-apply CORS headers on error responses.
  // The browser checks these headers even on 4xx/5xx, so they MUST be present.
  const origin = req.headers.origin as string | undefined;
  if (origin && ALLOWED_ORIGINS_FOR_ERRORS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (err instanceof AppError) {
    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  } else {
    res.status(500).json({
      status: "error",
      message: Messages.SERVER_ERROR,
    });
  }
};
