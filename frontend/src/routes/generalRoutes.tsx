import type { RouteObject } from "react-router-dom";
import Homepage from "../features/Genaral/Homepage";
import LoginForm from "../features/auth/Login";
import RegisterForm from "../features/auth/Register";
import SuperAdminLogin from "@/features/auth/SuperAdminLogin";
import ForgotPassword from "../features/auth/ForgotPassword";
import AboutPage from "@/features/Genaral/About";
import ContactPage from "@/features/Genaral/Contact";
import OTPPage from "@/shared/OTP/OTPPage";
import ResetPassword from "@/features/auth/ResetPassword";
import DepartmentDetailsPage from "@/features/company/DepartmentDetailsPage";


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
    path: "verify-otp",
    element: <OTPPage context="register"/>,
  },
   {
    path: "forgot-otp",
    element: <OTPPage context="forgotPassword"/>,
  },{
    path: "forgot-password",
    element: <ForgotPassword/>,
  },{
    path: "reset-password",
    element: <ResetPassword/>,
  }
  ,{
    path: "about",
    element: <AboutPage/>,
  },
  {
    path: "contact",
    element: <ContactPage/>,
  },
  {
    path: "department-details",
    element: <DepartmentDetailsPage/>
  }
  
  
  
];

export default genaralRoutes;
