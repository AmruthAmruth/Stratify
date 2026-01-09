import api from "./axiosInstance";
import { COMPANY_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import type {
  CompanyAnalytics,
  CompanyListResponse,
  Department,
  DepartmentDetails,
  TeamMember,
  SubscriptionPlan,
  PaymentResponse as CustomPaymentResponse,
  UserProfile,
  Company,
} from "@/types/types";

// Response wrapper types for APIs that return wrapped data
export interface DepartmentListResponse {
  response?: Department[];
  departments?: Department[];
}

export interface ManagerListResponse {
  managers?: TeamMember[];
}

const handleRequest = async <T>(request: Promise<{ data: T }>, errorMessage?: string): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data || new Error(errorMessage || "Network error");
    }
    throw new Error(errorMessage || "Network error");
  }
};

export const getAllCompanies = (params?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}): Promise<CompanyListResponse> => handleRequest(api.get(COMPANY_ROUTES.ALL_COMPANIES, { params }));

export const getAllDepartmentInACompany = (): Promise<DepartmentListResponse | Department[]> =>
  handleRequest(api.get(COMPANY_ROUTES.COMPANY_DEPARTMENTS));

export const createDepartment = (data: Record<string, unknown>): Promise<Department> =>
  handleRequest(api.post(COMPANY_ROUTES.CREATE_DEPARTMENT, data));

export const createEmployee = (data: Record<string, unknown>): Promise<TeamMember> =>
  handleRequest(api.post(COMPANY_ROUTES.CREATE_EMPLOYEE, data));

export const createManager = (data: Record<string, unknown>): Promise<TeamMember> =>
  handleRequest(api.post(COMPANY_ROUTES.CREATE_MANAGER, data));

export const getTeamMember = (): Promise<TeamMember[]> => handleRequest(api.get(COMPANY_ROUTES.TEAM_MEMBERS));

export const getUnassignedManager = (): Promise<ManagerListResponse | TeamMember[]> =>
  handleRequest(api.get(COMPANY_ROUTES.UNASSIGNED_MANAGERS));

export const getUnassignedDepartments = (): Promise<DepartmentListResponse | Department[]> =>
  handleRequest(api.get(COMPANY_ROUTES.UNASSIGNED_DEPARTMENTS));

export const getDepartmentDetails = (departmentId: string): Promise<DepartmentDetails> =>
  handleRequest(api.get(COMPANY_ROUTES.DEPARTMENT_DETAILS(departmentId)));

export const getTeamMemberProfile = (profileId: string): Promise<UserProfile> =>
  handleRequest(api.get(COMPANY_ROUTES.TEAM_MEMBER_PROFILE(profileId)));

export const getCompanyProfile = (profileId: string): Promise<Company> =>
  handleRequest(api.get(COMPANY_ROUTES.COMPANY_PROFILE(profileId)));

export const listSubscriptionPlan = (): Promise<SubscriptionPlan[]> => handleRequest(api.get(COMPANY_ROUTES.SUBSCRIPTION_PLANS));

export const createSubscriptionPlan = (planName: string): Promise<CustomPaymentResponse> =>
  handleRequest(api.post(COMPANY_ROUTES.PURCHASE, { planName }));

export const createSubscriptionPlanForUnauthenticated = (planName: string, companyId: string): Promise<CustomPaymentResponse> =>
  handleRequest(api.post(COMPANY_ROUTES.PURCHASE_UNAUTH, { planName, companyId }));

export const verifyPayment = (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
}): Promise<{ success: boolean; message: string }> => handleRequest(api.post(COMPANY_ROUTES.VERIFY_PAYMENT, payload), "Payment verification failed");

export const verifyPaymentForUnauthenticated = (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
  companyId: string;
}): Promise<{ success: boolean; message: string }> => handleRequest(api.post(COMPANY_ROUTES.VERIFY_PAYMENT_UNAUTH, payload), "Payment verification failed");

export const approveCompany = (companyId: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.post(COMPANY_ROUTES.APPROVE_COMPANY, { companyId }));

export const unapproveCompany = (companyId: string, reason: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.post(COMPANY_ROUTES.UNAPPROVE_COMPANY, { companyId, reason }));

export const getManagerDepartments = (managerId: string): Promise<Department[]> =>
  handleRequest(api.get(COMPANY_ROUTES.MANAGER_DEPARTMENTS(managerId)));

export const listPurchasedCompany = (): Promise<CompanyListResponse> => handleRequest(api.get(COMPANY_ROUTES.LIST_PURCHASED_COMPANY));

export const getCompanyAnalytics = (): Promise<CompanyAnalytics> =>
  handleRequest(api.get(COMPANY_ROUTES.COMPANY_ANALYTICS));

export const updateCompanyProfile = (data: Record<string, unknown>): Promise<Company> =>
  handleRequest(api.put(COMPANY_ROUTES.UPDATE_PROFILE, data));
