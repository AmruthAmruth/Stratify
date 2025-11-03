import { store } from "@/store";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:7000";

const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies (refresh token)
});

const plainAxios = axios.create({
  baseURL,
  withCredentials: true,
});

// Request Interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use plainAxios to avoid recursion
        const refreshRes = await plainAxios.post("/api/auth/refresh-token");
        const newToken = refreshRes.data.accessToken;

        const currentAuth = store.getState().auth;
        console.log("Current auth",currentAuth);
        
        store.dispatch(
  setCredentials({
    accessToken: newToken,
    role: currentAuth.role,
    userId: currentAuth.userId,
    name: currentAuth.name, 
  })
);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(clearCredentials());
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
