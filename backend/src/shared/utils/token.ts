import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";   
const REFRESH_TOKEN_EXPIRY = "7d";   

export interface TokenPayload {
  id: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (
  token: string
): string | jwt.JwtPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = (
  token: string
): string | jwt.JwtPayload => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};
