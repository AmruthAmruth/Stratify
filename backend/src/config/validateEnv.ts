import logger from '../shared/utils/logger';

const requiredEnvVars = [
    'MONGO_URI',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'ZEGO_APP_ID',
    'ZEGO_SERVER_SECRET',
    'COOKIE_HTTP_ONLY',
    'COOKIE_SECURE',
    'COOKIE_SAME_SITE',
    'COOKIE_MAX_AGE',
];

const optionalEnvVars = [
    'PORT',
    'NODE_ENV',
    'FRONTEND_URL',
];

export function validateEnv(): void {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    // Check optional but recommended variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(envVar);
        }
    }

    // Log warnings for optional variables
    if (warnings.length > 0) {
        logger.warn(`Optional environment variables not set: ${warnings.join(', ')}`);
        logger.warn('Using default values where applicable');
    }

    // Throw error if required variables are missing
    if (missing.length > 0) {
        logger.error(`Missing required environment variables: ${missing.join(', ')}`);
        throw new Error(
            `Environment validation failed. Missing required variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }

    // Validate specific values
    const sameSiteValues = ['strict', 'lax', 'none'];
    if (process.env.COOKIE_SAME_SITE && !sameSiteValues.includes(process.env.COOKIE_SAME_SITE)) {
        logger.error(`Invalid COOKIE_SAME_SITE value: ${process.env.COOKIE_SAME_SITE}`);
        throw new Error(`COOKIE_SAME_SITE must be one of: ${sameSiteValues.join(', ')}`);
    }

    logger.info('✅ Environment validation passed');
}
