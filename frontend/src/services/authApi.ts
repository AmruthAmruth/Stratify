import api from "./axiosInstance";
import { AUTH_ROUTES } from "@/constants/routes";

export const superAdminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post(AUTH_ROUTES.SUPER_ADMIN_LOGIN, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const companyRegistration = async (data: any) => {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (key === "profileImage" && data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage);
      } else {
        formData.append(key, String(data[key]));
      }
    }

    const response = await api.post(AUTH_ROUTES.COMPANY_REGISTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const verifyOTP = async (data: { otp: string; email: string }) => {
  try {
    const response = await api.post(AUTH_ROUTES.COMPANY_VERIFY_OTP, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const companyLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post(AUTH_ROUTES.COMPANY_LOGIN, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const logout = async () => {
  try {
    const response = await api.post(AUTH_ROUTES.COMPANY_LOGOUT);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const resendOTP = async (email: string) => {
  try {
    const response = await api.post(AUTH_ROUTES.RESEND_OTP, { email });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const forgotPasswordVerifyOTP = async (data: { email: string; otp: string }) => {
  try {
    const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD_VERIFY_OTP, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const updatePassword = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post(AUTH_ROUTES.RESET_PASSWORD, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};
