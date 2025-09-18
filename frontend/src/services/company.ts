import api from "./axiosInstance";
import { COMPANY_ROUTES } from "@/constants/routes";

export const getAllCompanies = async (params?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}) => {
  try {
    const response = await api.get(COMPANY_ROUTES.ALL_COMPANIES, { params });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getAllDepartmentInACompany = async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.COMPANY_DEPARTMENTS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const createDepartment = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post(COMPANY_ROUTES.CREATE_DEPARTMENT, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const createEmployee = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post(COMPANY_ROUTES.CREATE_EMPLOYEE, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const createManager = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post(COMPANY_ROUTES.CREATE_MANAGER, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getTeamMember = async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.TEAM_MEMBERS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getUnassignedManager = async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.UNASSIGNED_MANAGERS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getUnassignedDepartments = async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.UNASSIGNED_DEPARTMENTS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getDepartmentDetails = async (departmentId: string) => {
  try {
    const response = await api.get(COMPANY_ROUTES.DEPARTMENT_DETAILS(departmentId));
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getTeamMemberProfile = async (profileId: string) => {
  try {
    const response = await api.get(COMPANY_ROUTES.TEAM_MEMBER_PROFILE(profileId));
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getCompanyProfile = async (profileId: string) => {
  try {
    const response = await api.get(COMPANY_ROUTES.COMPANY_PROFILE(profileId));
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const listSubscriptionPlan = async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.SUBSCRIPTION_PLANS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const createSubscriptionPlan = async (planName: string) => {
  try {
    const response = await api.post(COMPANY_ROUTES.PURCHASE, { planName });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const createSubscriptionPlanForUnauthenticated = async (planName: string, companyId: string) => {
  try {
    const response = await api.post(COMPANY_ROUTES.PURCHASE_UNAUTH, { planName, companyId });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const verifyPayment = async (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
}) => {
  try {
    const response = await api.post(COMPANY_ROUTES.VERIFY_PAYMENT, payload);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Payment verification failed");
  }
};

export const verifyPaymentForUnauthenticated = async (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
  companyId: string;
}) => {
  try {
    const response = await api.post(COMPANY_ROUTES.VERIFY_PAYMENT_UNAUTH, payload);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Payment verification failed");
  }
};

export const approveCompany = async (companyId: string) => {
  try {
    const response = await api.post(COMPANY_ROUTES.APPROVE_COMPANY, { companyId });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const unapproveCompany = async (companyId: string,reason:string) => {
  try {
    const response = await api.post(COMPANY_ROUTES.UNAPPROVE_COMPANY, { companyId ,reason});
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getManagerDepartments = async (managerId: string) => {
  try {
    const response = await api.get(COMPANY_ROUTES.MANAGER_DEPARTMENTS(managerId));
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const listPurchasedCompany = async () => {
  try {
    const response = await api.get(COMPANY_ROUTES.LIST_PURCHASED_COMPANY);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};
