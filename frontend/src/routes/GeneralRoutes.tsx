import type { RouteObject } from "react-router-dom";
import Homepage from "../features/general/Homepage";
import LoginForm from "../features/auth/Login";
import RegisterForm from "../features/auth/Register";
import SuperAdminLogin from "@/features/auth/SuperAdminLogin";
import ForgotPassword from "../features/auth/ForgotPassword";
import AboutPage from "@/features/general/About";
import ContactPage from "@/features/general/Contact";
import PricingPage from "@/features/general/Pricing";
import OTPPage from "@/shared/OTP/OTPPage";
import ResetPassword from "@/features/auth/ResetPassword";
import CompanyPendingApproval from "@/features/general/CompanyPendingApproval";

const generalRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/super-admin-login",
    element: <SuperAdminLogin />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/verify-otp",
    element: <OTPPage context="register" />,
  },
  {
    path: "/forgot-otp",
    element: <OTPPage context="forgotPassword" />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/company-pending-approval",
    element: <CompanyPendingApproval />,
  },
];

export default generalRoutes;

