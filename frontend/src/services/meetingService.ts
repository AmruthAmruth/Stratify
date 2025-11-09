import { AxiosError } from "axios";
import api from "./axiosInstance";
import { MEETING_ROUTES } from "@/constants/routes";


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


export const createMeeting = (title: string) =>
  handleRequest(api.post(MEETING_ROUTES.CREATE_MEETING, {title}));


export const generateToken=(roomId: string, userName: string)=>handleRequest(api.post(MEETING_ROUTES.GENARATE_TOKEN,{roomId,userName}))