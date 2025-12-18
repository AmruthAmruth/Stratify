import { CHAT_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import api from "./axiosInstance";
import type { ChatMessage, ChatTeamMember } from "@/types/types";

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

export const sendTheMessage = (data: Record<string, unknown>, file?: File): Promise<ChatMessage> => {
  if (file) {
    // Use FormData for file upload
    const formData = new FormData();
    formData.append('receiverId', data.receiverId as string);
    formData.append('message', data.message as string || '');
    formData.append('file', file);

    return handleRequest(api.post(CHAT_ROUTES.SENT_MESSAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  }

  // Text-only message
  return handleRequest(api.post(CHAT_ROUTES.SENT_MESSAGE, data));
};

export const getTeamMemeberList = (): Promise<ChatTeamMember[]> => handleRequest(api.get(CHAT_ROUTES.TEAM_MEMEBER_LIST))

export const getChatHistory = (receiverId: string): Promise<ChatMessage[]> => handleRequest(api.get(`${CHAT_ROUTES.CHAT_HISTROY_ROUTES}/${receiverId}`))

export const markMessagesAsRead = (senderId: string): Promise<{ success: boolean }> =>
  handleRequest(api.put(`${CHAT_ROUTES.MARK_AS_READ}/${senderId}`));

export const getUnreadCounts = (): Promise<Record<string, number>> =>
  handleRequest<Record<string, number>>(api.get(CHAT_ROUTES.UNREAD_COUNTS));





