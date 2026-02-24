import { AsyncLocalStorage } from "async_hooks";

export interface TenantData {
    companyId: string;
    bypassTenant?: boolean; // Useful for super-admin or public operations
}

export const tenantContext = new AsyncLocalStorage<TenantData>();

export const getTenantContext = (): TenantData | undefined => {
    return tenantContext.getStore();
};
