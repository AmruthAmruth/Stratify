import { NextFunction, Response, Request } from "express";
import { Messages } from "../../shared/constants/messages";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

interface JwtPayload {
  id: string;
  role: "company" | "manager" | "employee";
  iat?: number;
  exp?: number;
}

export const authMiddleware = (
  allowedRoles: ("company" | "manager" | "employee")[] = [],
) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return next({ status: 401, message: Messages.UNAUTHORIZED_ACCESS });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as JwtPayload;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return next({ status: 403, message: "Forbidden" });
      }

      req.role = decoded.role;
      req.userId = decoded.id;

      console.log("Token Verification Successfull:", decoded.role);
      next();
    } catch (err) {
      console.error("Auth error:", err);
      return next({ status: 401, message: Messages.UNAUTHORIZED_ACCESS });
    }
  };
};
