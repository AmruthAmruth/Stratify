import { Schema } from "mongoose";
import { getTenantContext } from "../context/TenantContext";

export function tenantPlugin(schema: Schema) {
    // We only want to apply the plugin if the schema has a companyId field to filter by.
    // Models that are global (like SuperAdmin, global Settings) won't have this.
    const hasCompanyId = Boolean(schema.path("companyId"));

    if (!hasCompanyId) return;

    const handleTenantInjection = function (this: any, next: (err?: Error) => void) {
        const context = getTenantContext();

        if (!context) {
            // If we are outside a tenant context, we prevent queries unless explicitly bypassed.
            // This forces developers to either run within the middleware, or explicitly bypass.
            // NOTE: In some systems you might want to allow this if context is missing, but strict is safer.
            const isBypass = this.getOptions().bypassTenant;
            if (!isBypass) {
                return next(new Error("Mongoose Query Error: Tenant context missing. Cannot execute query without companyId scope. Use .setOptions({ bypassTenant: true }) to bypass."));
            }
            return next();
        }

        if (context.bypassTenant) {
            return next();
        }

        if (context.companyId) {
            // Inject the companyId into the current Mongoose query condition implicitly
            this.where({ companyId: context.companyId });
        }

        next();
    };

    // Types of queries to intercept
    schema.pre("find", handleTenantInjection);
    schema.pre("findOne", handleTenantInjection);
    schema.pre("countDocuments", handleTenantInjection);
    schema.pre("updateOne", handleTenantInjection);
    schema.pre("updateMany", handleTenantInjection);
    schema.pre("deleteMany", handleTenantInjection);
    schema.pre("deleteOne", handleTenantInjection);
    schema.pre("aggregate", function (this: any, next: (err?: Error) => void) {
        const context = getTenantContext();
        const isBypass = this.options.bypassTenant || (context && context.bypassTenant);

        if (hasCompanyId && !isBypass) {
            if (!context || !context.companyId) {
                return next(new Error("Mongoose Aggregate Error: Tenant context missing."));
            }
            // Prepend a $match stage to force companyId filtering
            this.pipeline().unshift({ $match: { companyId: context.companyId } });
        }
        next();
    });
}
