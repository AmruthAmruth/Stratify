import { CookieOptions } from "express";
import { agentLog } from "../shared/utils/agentDebugLog";

const isProduction = process.env.NODE_ENV === "production";

export const CookieConfig: CookieOptions = {
  httpOnly: true,

  secure: isProduction,

  sameSite: isProduction
    ? "none"
    : "lax",

  maxAge: Number(process.env.COOKIE_MAX_AGE) || 604800000,
};

// #region agent log
agentLog("A", "CookieConfig.ts:init", "Resolved CookieConfig at boot", {
  NODE_ENV: process.env.NODE_ENV ?? null,
  isProduction,
  cookieSecure: CookieConfig.secure,
  cookieSameSite: CookieConfig.sameSite,
  envCOOKIE_SECURE: process.env.COOKIE_SECURE ?? null,
  envCOOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE ?? null,
  envCOOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY ?? null,
  ignoresEnvCookieFlags: true,
});
// #endregion