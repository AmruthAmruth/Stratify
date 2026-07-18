import { Request, Response, NextFunction } from "express";
import { Messages } from "../../shared/constants/messages";
import { getAllowedOrigins } from "../../config/corsConfig";

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
  if (origin && getAllowedOrigins().includes(origin)) {
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
