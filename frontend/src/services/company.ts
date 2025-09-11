import api from './axiosInstance'


export const getAllCompanies = async (params?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}) => {
  try {
    const response = await api.get("/company/companies", { params });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getAllDepartmentInACompany = async () => {
  try {
    const response = await api.get("/company/company-departments");
   
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const createDepartment = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/company/create-department", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const createEmployee = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/company/create-employee", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getTeamMember = async () => {
  try {
    const response = await api.get("/company/team-members"); 
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getUnassignedManager = async () => {
  try {
    const response = await api.get("/company/unassigned-managers");
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};
