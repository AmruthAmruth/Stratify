
import api from "./axiosInstance";



export const getManagerForCompany= async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.UNASSIGNED_MANAGERS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};