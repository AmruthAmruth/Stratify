import { NextFunction, Response, Request } from "express";
import { Messages } from "../../shared/constants/messages";
import { StatusCodes } from "../../shared/constants/statusCodes";
import jwt from "jsonwebtoken";
import logger from "../../shared/utils/logger";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
  userCompanyId?: string;
}

interface JwtPayload {
  id: string;
  role: "company" | "manager" | "employee" | "super-admin";
  iat?: number;
  exp?: number;
}

interface WithCompanyId {
  companyId?: unknown;
}

// Minimal models for middleware lookup to keep dependencies lightweight
import mongoose from "mongoose";
const ManagerModel = mongoose.models.Manager || mongoose.model("Manager", new mongoose.Schema({ companyId: String }, { strict: false }));
const EmployeeModel = mongoose.models.Employee || mongoose.model("Employee", new mongoose.Schema({ companyId: String }, { strict: false }));

export const authMiddleware = (
  allowedRoles: ("company" | "manager" | "employee" | "super-admin")[] = [],
) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return next({ status: StatusCodes.UNAUTHORIZED, message: Messages.UNAUTHORIZED_ACCESS });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as JwtPayload;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return next({ status: StatusCodes.FORBIDDEN, message: Messages.ACCESS_DENIED });
      }

      req.role = decoded.role;
      req.userId = decoded.id;

      let userCompanyId = decoded.id; // defaults to company
      if (decoded.role === "manager") {
        const manager = await ManagerModel.findById(decoded.id).select("companyId").lean();
        if (manager) userCompanyId = String((manager as WithCompanyId).companyId);
      } else if (decoded.role === "employee") {
        const employee = await EmployeeModel.findById(decoded.id).select("companyId").lean();
        if (employee) userCompanyId = String((employee as WithCompanyId).companyId);
      }
      req.userCompanyId = userCompanyId;

      logger.debug(`Token verified for user ${decoded.id} with role ${decoded.role} and company ${userCompanyId}`);
      next();
    } catch (err) {
      logger.error("Auth middleware error", { error: err });
      return next({ status: 401, message: Messages.UNAUTHORIZED_ACCESS });
    }
  };
};
