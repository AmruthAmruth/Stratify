export const CookieConfig = {
  httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE as "strict" | "lax" | "none",
  maxAge: Number(process.env.COOKIE_MAX_AGE),
};
