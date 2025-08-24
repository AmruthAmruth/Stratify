import api from './axiosInstance'


export const getAllCompanies = async (params?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}) => {
  try {
    const response = await api.get("/company/companies", {
      params, 
    return response.data; 
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};  