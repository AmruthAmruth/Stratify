

import { LEAVE_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";




export const getLeaveCurrentMonth = async () => {
  try {
    const response = await api.get(LEAVE_ROUTES.GET_EMPLOYEE_CURRENT_MONTHLEAVE);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};




export const createLeave = async (data:Record<string, unknown>) => {
  try {
    const response = await api.post(LEAVE_ROUTES.CREATE_LEAVE,data );
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};