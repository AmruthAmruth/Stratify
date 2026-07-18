import { CookieOptions } from "express";

function envFlag(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }
  return value === "true";
}

const isProduction = process.env.NODE_ENV === "production";

export const CookieConfig: CookieOptions = {
  httpOnly: envFlag("COOKIE_HTTP_ONLY", true),
  secure: envFlag("COOKIE_SECURE", isProduction),
  sameSite:
    (process.env.COOKIE_SAME_SITE as CookieOptions["sameSite"]) ||
    (isProduction ? "none" : "lax"),
  maxAge: Number(process.env.COOKIE_MAX_AGE) || 604800000,
};
