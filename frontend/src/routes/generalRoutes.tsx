import type { RouteObject } from "react-router-dom";
import Homepage from "../features/Genaral/Homepage";
import LoginForm from "../features/auth/Login";
import RegisterForm from "../features/auth/Register";
import RegisterOTPPage from "@/features/auth/OTP";
import SuperAdminLogin from "@/features/auth/SuperAdminLogin";

const genaralRoutes: RouteObject[] = [
  {
    path: "",
    element: <Homepage/>,
  },
  {
    path: "login",
    element: <LoginForm/>,
  },
  {
    path: "super-admin-login",
    element: <SuperAdminLogin/>,
  },
  {
    path: "register",
    element: <RegisterForm/>,
  },
   {
    path: "otp",
    element: <RegisterOTPPage/>,
  },
  
  
];

export default genaralRoutes;
