import api from "./axiosInstance";
import { SUPER_ADMIN_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import type { SubscriptionPlan } from "@/types/types";

const handleRequest = async <T>(request: Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data || new Error("Network error");
    }
    throw new Error("Network error");
  }
};


export const createSubscription = (data: Record<string, unknown>): Promise<SubscriptionPlan> =>
  handleRequest(api.post(SUPER_ADMIN_ROUTES.CREATE_PLAN, data));

export const updateSubscription = (data: Record<string, unknown>): Promise<SubscriptionPlan> =>
  handleRequest(api.put(SUPER_ADMIN_ROUTES.UPDATE_PLAN, data));

export const deleteSubscription = (plan: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.delete(SUPER_ADMIN_ROUTES.DELETE_PLAN, { data: { plan } }));

export const getSuperAdminDashboardStats = (): Promise<{
  stats?: {
    totalCompanies: number;
    approvedCompanies: number;
    pendingCompanies: number;
    rejectedCompanies: number;
    activeSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  graphs?: {
    companiesByStatus: { labels: string[]; data: number[] };
    subscriptionsByPlan: { labels: string[]; data: number[] };
    revenueTrend: { labels: string[]; data: number[] };
  };
}> =>
  handleRequest(api.get(SUPER_ADMIN_ROUTES.DASHBOARD_STATS));
