import { CHAT_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import api from "./axiosInstance";

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

export const sendTheMessage = (data: Record<string, unknown>) =>
  handleRequest(api.post(CHAT_ROUTES.SENT_MESSAGE, data));







