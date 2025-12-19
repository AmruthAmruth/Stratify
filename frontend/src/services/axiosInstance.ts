import { store } from "@/store";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000",
  withCredentials: true,
});

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper to check if token is expired or about to expire
const isTokenExpiringSoon = (token: string, bufferSeconds = 60): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + bufferSeconds;
  } catch {
    return true; // Treat invalid tokens as expired
  }
};

// Request Interceptor - Add token and check expiration
api.interceptors.request.use(
  async (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      // Check if token is expired or expiring soon (within 1 minute)
      if (isTokenExpiringSoon(token, 60)) {
        console.log("Token expiring soon, will be refreshed on next 401");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle 401 and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors and prevent infinite loops
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Skip refresh for the refresh-token endpoint itself
      if (originalRequest.url?.includes('/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const token = store.getState().auth.accessToken;
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api.request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshRes = await api.post("/api/auth/refresh-token");
        const newToken = refreshRes.data.accessToken;

        if (!newToken) {
          throw new Error("No access token received from refresh");
        }

        // Decode and validate the new token
        const decoded = jwtDecode<{ id: string; role: string; exp: number }>(newToken);

        if (!decoded.id || !decoded.role || !decoded.exp) {
          throw new Error("Invalid token payload received");
        }

        // Update Redux store with new token
        const currentAuth = store.getState().auth;
        store.dispatch(
          setCredentials({
            accessToken: newToken,
            role: decoded.role,
            userId: decoded.id,
            name: currentAuth.name, // Preserve existing name
          })
        );

        // Process queued requests
        processQueue(null, newToken);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api.request(originalRequest);
      } catch (refreshError) {
        // Refresh failed - log out user
        processQueue(refreshError as AxiosError, null);

        console.error("Token refresh failed:", refreshError);

        // Clear credentials
        store.dispatch(clearCredentials());

        // Call logout endpoint to clear refresh token cookie
        try {
          await api.post("/api/auth/logout");
        } catch (logoutError) {
          console.error("Logout API call failed:", logoutError);
        }

        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;