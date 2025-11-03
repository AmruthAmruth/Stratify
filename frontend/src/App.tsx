import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
import api from "./services/axiosInstance";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // <-- added

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await api.post("/api/auth/refresh-token");
        const newToken = res.data.accessToken;
        const user = res.data.user;

        dispatch(
          setCredentials({
            accessToken: newToken,
            role: user?.role || null,
            userId: user?._id || null,
            name: user?.name || null,
          })
        );
      } catch (err) {
        console.error("Auto refresh failed:", err);
        dispatch(clearCredentials());
      } finally {
        setLoading(false); // done loading either way
      }
    };

    refreshAccessToken();
  }, [dispatch]);

  if (loading) {
    // Show loader while checking refresh token
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
