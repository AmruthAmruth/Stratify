import axios from "axios";

const API_URL="http://localhost:7000"

const axiosInstance=axios.create({
    baseURL:API_URL,
    withCredentials:true,
})

export const superAdminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/super-admin/login", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};
