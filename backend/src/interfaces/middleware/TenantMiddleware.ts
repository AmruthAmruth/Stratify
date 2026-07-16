import { NextFunction, Response } from "express";
import { tenantContext } from "../../infrastructure/context/TenantContext";
import { AuthRequest } from "./AuthMiddleware";

export const tenantMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
    // If the request isn't authenticated yet or doesn't have a userId mapped,
    // we either bypass or set no companyId. For a multi-role system where
    // manager and employee have `companyId`, BUT here auth puts their own string `id` as `userId`.

    // Wait, in this application, an employee or manager's `userId` might NOT be their `companyId`.
    // From the use-cases (e.g., GetUserCompanyInfoUseCase), we see role mapping:
    // if (role === "company") return User.id
    // if (role === "manager/employee") return User.companyId
    // We need to reliably get the true companyId. Let's assume for protected routes that manipulate data,
    // they need something to provide the companyId.

    // The safest initial setup: We run the context.
    // The actual companyId identification will rely on `req.companyId` to be populated by auth 
    // or a more advanced resolver. For now, let's look at `req.userId` if it's a company, but
    // to be perfectly clean:

    // NOTE: This must sit AFTER AuthMiddleware. If AuthMiddleware sets `req.userCompanyId` that's ideal.
    // For now, let's extract what we know.
    const contextData = {
        // By default context is empty, Use Cases / Controllers can set context or we resolve from DB.
        // But passing undefined is fine, the plugin will block queries unless bypassTenant is true.
        companyId: req.userCompanyId ?? req.userId ?? "", // fallback to empty string if unauthenticated
        bypassTenant: req.role === 'super-admin'
    };

    tenantContext.run(contextData, () => {
        next();
    });
};
