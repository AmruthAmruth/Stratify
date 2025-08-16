import type { RouteObject } from "react-router-dom";
import Homepage from "../features/Genaral/Homepage";
import LoginForm from "../features/auth/Login";
import RegisterForm from "../features/auth/Register";
import RegisterOTPPage from "@/features/auth/OTP";

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
    path: "register",
    element: <RegisterForm/>,
  },
   {
    path: "otp",
    element: <RegisterOTPPage/>,
  },
  
  
];

export default genaralRoutes;
