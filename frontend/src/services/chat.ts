import { CHAT_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";
import { AxiosError } from "axios";


const handleRequest = async <T>(request: Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data || new Error("Network error");
    }
    throw new Error("Network error");
  }
};

export const getMemebersForCompany = () => handleRequest(api.get(CHAT_ROUTES.CHAT_FOR_COMPANY));

export const getMemebersForManager = () => handleRequest(api.get(CHAT_ROUTES.CHAT_FOR_MANAGER));

export const getMemebersForEmployee = () => handleRequest(api.get(CHAT_ROUTES.CHAT_FOR_EMPLOYEE));
