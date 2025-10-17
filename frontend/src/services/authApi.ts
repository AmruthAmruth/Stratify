import api from "./axiosInstance";
import { AUTH_ROUTES } from "@/constants/routes";
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

export const superAdminLogin = (data: { email: string; password: string }) =>
  handleRequest(api.post(AUTH_ROUTES.SUPER_ADMIN_LOGIN, data));

export const companyRegistration = (data: Record<string, unknown>) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "profileImage" && data.profileImage instanceof File) {
      formData.append("profileImage", data.profileImage);
    } else {
      formData.append(key, String(data[key]));
    }
  }
  return handleRequest(
    api.post(AUTH_ROUTES.COMPANY_REGISTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const verifyOTP = (data: { otp: string; email: string }) =>
  handleRequest(api.post(AUTH_ROUTES.COMPANY_VERIFY_OTP, data));

export const companyLogin = (data: { email: string; password: string }) =>
  handleRequest(api.post(AUTH_ROUTES.COMPANY_LOGIN, data));

export const logout = () => handleRequest(api.post(AUTH_ROUTES.COMPANY_LOGOUT));

export const resendOTP = (email: string) =>
  handleRequest(api.post(AUTH_ROUTES.RESEND_OTP, { email }));

export const forgotPassword = (email: string) =>
  handleRequest(api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email }));

export const forgotPasswordVerifyOTP = (data: { email: string; otp: string }) =>
  handleRequest(api.post(AUTH_ROUTES.FORGOT_PASSWORD_VERIFY_OTP, data));

export const updatePassword = (data: { email: string; password: string }) =>
  handleRequest(api.post(AUTH_ROUTES.RESET_PASSWORD, data));
