const isProduction = process.env.NODE_ENV === "production";

export const CookieConfig = {
  httpOnly: true,

  secure: isProduction,

  sameSite: isProduction
    ? "none"
    : "lax",

  maxAge: Number(process.env.COOKIE_MAX_AGE) || 604800000,
};