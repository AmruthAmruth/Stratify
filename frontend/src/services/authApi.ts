import api from "./axiosInstance";
import { AUTH_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import type { UserProfile } from "@/types/types";


const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError) {
    const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage;
    }
  }

  if (typeof err === "object" && err !== null) {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeData = (err as { data?: { message?: unknown } }).data;
    if (typeof maybeData?.message === "string" && maybeData.message.trim()) {
      return maybeData.message;
    }
  }

  return fallback;
};

const handleRequest = async <T>(request: Promise<{ data: T }>, errorMessage?: string): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    const message = extractErrorMessage(err, errorMessage || "Network error");
    throw new Error(message);
  }
};

export const superAdminLogin = (data: { email: string; password: string }): Promise<{ accessToken: string }> =>
  handleRequest(api.post(AUTH_ROUTES.SUPER_ADMIN_LOGIN, data));

export const companyRegistration = (data: Record<string, unknown>): Promise<{ message: string; companyId: string; time?: string }> => {
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


export const verifyOTP = (data: { otp: string; email: string }): Promise<{ message: string; success: boolean }> =>
  handleRequest(api.post(AUTH_ROUTES.COMPANY_VERIFY_OTP, data));

export const companyLogin = (data: { email: string; password: string }): Promise<{
  accessToken: string;
  companyId: string;
  theme: {
    themeName: string;
    themeMode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    surfaceColor: string;
    borderColor: string;
    mutedColor: string;
    headingColor: string;
    isCustom: boolean;
  } | null;
}> =>
  handleRequest(api.post(AUTH_ROUTES.COMPANY_LOGIN, data));

export const logout = (): Promise<{ message: string }> => handleRequest(api.post(AUTH_ROUTES.COMPANY_LOGOUT));

export const resendOTP = (params: { email: string; context?: string }): Promise<{ message: string }> =>
  handleRequest(api.post(AUTH_ROUTES.RESEND_OTP, { email: params.email }));

export const forgotPassword = (email: string): Promise<{ message: string; time: string }> =>
  handleRequest(api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email }));

export const forgotPasswordVerifyOTP = (data: { email: string; otp: string }): Promise<{ message: string; success: boolean }> =>
  handleRequest(api.post(AUTH_ROUTES.FORGOT_PASSWORD_VERIFY_OTP, data));

export const updatePassword = (data: { email: string; password: string }): Promise<{ message: string }> =>
  handleRequest(api.post(AUTH_ROUTES.RESET_PASSWORD, data));

// Manager Profile APIs
export const getManagerProfile = (): Promise<UserProfile> =>
  handleRequest(api.get('/manager/profile'));

export const updateManagerProfile = (data: Record<string, unknown>): Promise<UserProfile> => {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'profileImage' && data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, String(data[key]));
    }
  }
  return handleRequest(
    api.put('/manager/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

export const changeManagerPassword = (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> =>
  handleRequest(api.post('/manager/change-password', data));
