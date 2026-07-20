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

const compressImageIfNeeded = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.size <= 600 * 1024) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1200;
    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height)
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.8);
    });

    if (!blob) {
      return file;
    }

    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
};

const createFormData = async (
  data: Record<string, unknown>,
  fileField = "profileImage"
): Promise<FormData> => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (key === fileField && value instanceof File) {
      const sanitizedFile = await compressImageIfNeeded(value);

      if (sanitizedFile.size <= 1 * 1024 * 1024) {
        formData.append(key, sanitizedFile);
      }
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
};

// ==========================
// Authentication APIs
// ==========================

export const superAdminLogin = (
  data: { email: string; password: string }
): Promise<{ accessToken: string }> =>
  handleRequest(api.post(AUTH_ROUTES.SUPER_ADMIN_LOGIN, data));

export const companyRegistration = async (
  data: Record<string, unknown>
): Promise<{
  message: string;
  companyId: string;
  time?: string;
}> => {
  const formData = await createFormData(data);

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

export const updateManagerProfile = async (
  data: Record<string, unknown>
): Promise<UserProfile> => {
  const formData = await createFormData(data);

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

   