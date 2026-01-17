import rateLimit from 'express-rate-limit';


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    standardHeaders: true, 
    legacyHeaders: false, 
    skipSuccessfulRequests: false, 
});


export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});


export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 5, 
    message: 'Too many password reset attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});
