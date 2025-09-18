import api from "./axiosInstance";
import { SUPER_ADMIN_ROUTES } from "@/constants/routes";

export const createSubscription = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post(SUPER_ADMIN_ROUTES.CREATE_PLAN, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const updateSubscription = async (data: Record<string, unknown>) => {
  try {
    const response = await api.put(SUPER_ADMIN_ROUTES.UPDATE_PLAN, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const deleteSubscription = async (plan: string) => {
  try {
    const response = await api.delete(SUPER_ADMIN_ROUTES.DELETE_PLAN, { data: { plan } });
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Network error");
    }
  }
};
