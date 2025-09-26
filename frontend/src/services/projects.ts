

import { PROJECT_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";



export const getCompanyProjects = async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.COMPANY_PROJECTS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};



export const getDepartmentProjects = async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.DEPARTMENT_PROJECTS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};