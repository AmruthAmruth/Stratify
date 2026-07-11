import rateLimit from 'express-rate-limit';
import { Messages } from "../shared/constants/messages";

// Rate limiter for authentication endpoints (login, register, etc.)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs (increased for development)
    message: Messages.RATE_LIMIT_AUTH,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count successful requests
});

// Rate limiter for general API endpoints
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: Messages.RATE_LIMIT_API,
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for password reset endpoints
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    message: Messages.RATE_LIMIT_PASSWORD_RESET,
    standardHeaders: true,
    legacyHeaders: false,
});
