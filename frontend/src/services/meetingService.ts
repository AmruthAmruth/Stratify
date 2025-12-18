import { AxiosError } from "axios";
import api from "./axiosInstance";
import { MEETING_ROUTES } from "@/constants/routes";
import type { Meeting } from "@/types/types";


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



export const createMeeting = (title: string): Promise<Meeting> =>
  handleRequest(api.post(MEETING_ROUTES.CREATE_MEETING, { title }));


export const getMeetingsByCreator = (): Promise<Meeting[]> => handleRequest(api.get(MEETING_ROUTES.GET_MEETINGS_BY_CREATOR));
export const generateToken = (roomId: string, userName: string): Promise<{ token: string }> => handleRequest(api.post(MEETING_ROUTES.GENARATE_TOKEN, { roomId, userName }));
export const joinMeeting = (roomId: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.post(`${MEETING_ROUTES.JOING_MEETING}/${roomId}`));

export const closeMeeting = (roomId: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.post(`${MEETING_ROUTES.CLOSE_MEETING}/${roomId}`));


export const employeeMeetings = (): Promise<Meeting[]> => handleRequest(api.get(MEETING_ROUTES.GET_MEETINGS_FOR_EMPLOYEE))
