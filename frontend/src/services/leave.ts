import { LEAVE_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";
import { AxiosError } from "axios";
import type { Leave } from "@/types/types";


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


export const getLeaveCurrentMonth = (): Promise<Leave[]> =>
  handleRequest(api.get(LEAVE_ROUTES.GET_EMPLOYEE_CURRENT_MONTHLEAVE));

export const createLeave = (data: Record<string, unknown>): Promise<Leave> =>
  handleRequest(api.post(LEAVE_ROUTES.CREATE_LEAVE, data));

export const getDepartmentLeave = (): Promise<Leave[]> =>
  handleRequest(api.get(LEAVE_ROUTES.GET_DEPARTMENT_LEAVE));

export const leaveStatusUpdate = (data: Record<string, unknown>): Promise<Leave> =>
  handleRequest(api.post(LEAVE_ROUTES.LEAVE_STATUS_UPDATE, data));
