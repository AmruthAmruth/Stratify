import { AxiosError } from "axios";
import api from "./axiosInstance";
import { NOTIFICATION_ROUTES } from "@/constants/routes";


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


export const getNotification= () => handleRequest(api.get(NOTIFICATION_ROUTES.GET_NOTIFICATIONS));


export const toggleStatusUpdate = (id: string) =>
  handleRequest(api.post(NOTIFICATION_ROUTES.TOGGLE_STATUS_UPDATE, { id }));

export const deleteNotification = (id: string) =>
  handleRequest(api.delete(`${NOTIFICATION_ROUTES.DELETE_NOTIFICATION}/${id}`));

export const deleteAllNotifications= () => handleRequest(api.delete(NOTIFICATION_ROUTES.DELETE_ALL_NOTIFICATION));