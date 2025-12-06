import api from "./axiosInstance";
import { COMPANY_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";


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
}) => handleRequest(api.get(COMPANY_ROUTES.ALL_COMPANIES, { params }));

export const getAllDepartmentInACompany = () => handleRequest(api.get(COMPANY_ROUTES.COMPANY_DEPARTMENTS));

export const createDepartment = (data: Record<string, unknown>) =>
  handleRequest(api.post(COMPANY_ROUTES.CREATE_DEPARTMENT, data));

export const createEmployee = (data: Record<string, unknown>) =>
  handleRequest(api.post(COMPANY_ROUTES.CREATE_EMPLOYEE, data));

export const createManager = (data: Record<string, unknown>) =>
  handleRequest(api.post(COMPANY_ROUTES.CREATE_MANAGER, data));

export const getTeamMember = () => handleRequest(api.get(COMPANY_ROUTES.TEAM_MEMBERS));

export const getUnassignedManager = () => handleRequest(api.get(COMPANY_ROUTES.UNASSIGNED_MANAGERS));

export const getUnassignedDepartments = () => handleRequest(api.get(COMPANY_ROUTES.UNASSIGNED_DEPARTMENTS));

export const getDepartmentDetails = (departmentId: string) =>
  handleRequest(api.get(COMPANY_ROUTES.DEPARTMENT_DETAILS(departmentId)));

export const getTeamMemberProfile = (profileId: string) =>
  handleRequest(api.get(COMPANY_ROUTES.TEAM_MEMBER_PROFILE(profileId)));

export const getCompanyProfile = (profileId: string) =>
  handleRequest(api.get(COMPANY_ROUTES.COMPANY_PROFILE(profileId)));

export const listSubscriptionPlan = () => handleRequest(api.get(COMPANY_ROUTES.SUBSCRIPTION_PLANS));

export const createSubscriptionPlan = (planName: string) =>
  handleRequest(api.post(COMPANY_ROUTES.PURCHASE, { planName }));

export const createSubscriptionPlanForUnauthenticated = (planName: string, companyId: string) =>
  handleRequest(api.post(COMPANY_ROUTES.PURCHASE_UNAUTH, { planName, companyId }));

export const verifyPayment = (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
}) => handleRequest(api.post(COMPANY_ROUTES.VERIFY_PAYMENT, payload), "Payment verification failed");

export const verifyPaymentForUnauthenticated = (payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
  companyId: string;
}) => handleRequest(api.post(COMPANY_ROUTES.VERIFY_PAYMENT_UNAUTH, payload), "Payment verification failed");

export const approveCompany = (companyId: string) =>
  handleRequest(api.post(COMPANY_ROUTES.APPROVE_COMPANY, { companyId }));

export const unapproveCompany = (companyId: string, reason: string) =>
  handleRequest(api.post(COMPANY_ROUTES.UNAPPROVE_COMPANY, { companyId, reason }));

export const getManagerDepartments = (managerId: string) =>
  handleRequest(api.get(COMPANY_ROUTES.MANAGER_DEPARTMENTS(managerId)));

export const listPurchasedCompany = () => handleRequest(api.get(COMPANY_ROUTES.LIST_PURCHASED_COMPANY));

export const getCompanyAnalytics = () =>
  handleRequest(api.get(COMPANY_ROUTES.COMPANY_ANALYTICS));

