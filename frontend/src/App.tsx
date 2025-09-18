import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./store";
import { SnackbarProvider } from "notistack";
import "./App.css";
// import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
// import { useEffect, useState } from "react";
// import api from "./services/axiosInstance";

const App = () => {
  // const [authLoaded, setAuthLoaded] = useState(false);

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       const res = await api.post("/super-admin/refresh-token");
  //       store.dispatch(
  //         setCredentials({
  //           accessToken: res.data.accessToken,
  //           role: res.data.role || null,
  //           userId: res.data.userId || null,
  //         })
  //       );
  //     } catch (err) {
  //       console.log("No valid refresh token, user needs to login", err);
  //       store.dispatch(clearCredentials());
  //     } finally {
  //       setAuthLoaded(true); 
  //     }
  //   };

  //   initializeAuth();
  // }, []);

  // if (!authLoaded) {
   
  //   return <h1>Loading...</h1>;
  // }

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  );
};

export default App;
