import api from "./axiosInstance";
import { AUTH_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import type { UserProfile } from "@/types/types";

const extractErrorMessage = (
  err: unknown,
  fallback = "Network error"
): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data;

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (typeof err.message === "string" && err.message.trim()) {
      return err.message;
    }
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }

  return fallback;
};

const handleRequest = async <T>(
  request: Promise<{ data: T }>,
  fallbackMessage?: string
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    throw new Error(
      extractErrorMessage(err, fallbackMessage ?? "Network error")
    );
  }
};

const createFormData = (
  data: Record<string, unknown>,
  fileField = "profileImage"
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === fileField && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// ==========================
// Authentication APIs
// ==========================

export const superAdminLogin = (
  data: { email: string; password: string }
): Promise<{ accessToken: string }> =>
  handleRequest(api.post(AUTH_ROUTES.SUPER_ADMIN_LOGIN, data));

export const companyRegistration = (
  data: Record<string, unknown>
): Promise<{
  message: string;
  companyId: string;
  time?: string;
}> => {
  const formData = createFormData(data);

  // Debug (remove after testing)
  console.log("Registration FormData:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  return handleRequest(
    api.post(AUTH_ROUTES.COMPANY_REGISTER, formData)
  );
};

export const verifyOTP = (
  data: { otp: string; email: string }
): Promise<{
  message: string;
  success: boolean;
}> =>
  handleRequest(
    api.post(AUTH_ROUTES.COMPANY_VERIFY_OTP, data)
  );

export const companyLogin = (
  data: { email: string; password: string }
): Promise<{
  accessToken: string;
  companyId: string;
  theme: {
    themeName: string;
    themeMode: "light" | "dark";
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
  handleRequest(
    api.post(AUTH_ROUTES.COMPANY_LOGIN, data)
  );

export const logout = (): Promise<{ message: string }> =>
  handleRequest(api.post(AUTH_ROUTES.COMPANY_LOGOUT));

export const resendOTP = (
  params: { email: string; context?: string }
): Promise<{ message: string }> =>
  handleRequest(
    api.post(AUTH_ROUTES.RESEND_OTP, {
      email: params.email,
    })
  );

export const forgotPassword = (
  email: string
): Promise<{
  message: string;
  time: string;
}> =>
  handleRequest(
    api.post(AUTH_ROUTES.FORGOT_PASSWORD, {
      email,
    })
  );

export const forgotPasswordVerifyOTP = (
  data: { email: string; otp: string }
): Promise<{
  message: string;
  success: boolean;
}> =>
  handleRequest(
    api.post(
      AUTH_ROUTES.FORGOT_PASSWORD_VERIFY_OTP,
      data
    )
  );

export const updatePassword = (
  data: { email: string; password: string }
): Promise<{ message: string }> =>
  handleRequest(
    api.post(AUTH_ROUTES.RESET_PASSWORD, data)
  );

// ==========================
// Manager Profile APIs
// ==========================

export const getManagerProfile = (): Promise<UserProfile> =>
  handleRequest(api.get("/manager/profile"));

export const updateManagerProfile = (
  data: Record<string, unknown>
): Promise<UserProfile> => {
  const formData = createFormData(data);

  return handleRequest(
    api.put("/manager/profile", formData)
  );
};

export const changeManagerPassword = (
  data: {
    currentPassword: string;
    newPassword: string;
  }
): Promise<{ message: string }> =>
  handleRequest(
    api.post("/manager/change-password", data)
  );    

   