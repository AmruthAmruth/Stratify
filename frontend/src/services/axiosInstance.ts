import { store } from "@/store";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000",
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        
        const refreshRes = await api.post("/auth/refresh-token");
        const newToken = refreshRes.data.accessToken;
      
        const currentAuth = store.getState().auth;
        store.dispatch(
          setCredentials({
            accessToken: newToken,
            role: currentAuth.role,   
            userId: currentAuth.userId,
          })
        );

        
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);

      } catch (refreshError) {
       console.log(refreshError);
        store.dispatch(clearCredentials());
        window.location.href = "/login";
      }
    } 

    return Promise.reject(error);
  }
);

export default api;
 