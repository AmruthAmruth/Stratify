const isProduction = process.env.NODE_ENV === 'production';

export const CookieConfig = {
  httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false', 
  secure: isProduction || process.env.COOKIE_SECURE === 'true', 
  sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict', 
  maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800000', 10), 
};
