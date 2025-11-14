import type { RouteObject } from "react-router-dom";
import Homepage from "../features/genaral/Homepage";
import LoginForm from "../features/auth/Login";
import RegisterForm from "../features/auth/Register";
import SuperAdminLogin from "@/features/auth/SuperAdminLogin";
import ForgotPassword from "../features/auth/ForgotPassword";
import AboutPage from "@/features/genaral/About";
import ContactPage from "@/features/genaral/Contact";
import OTPPage from "@/shared/OTP/OTPPage";
import ResetPassword from "@/features/auth/ResetPassword";
import CompanyProfilePage from "@/features/superAdmin/CompanyProfilePage";
import CompanyPendingApproval from "@/features/genaral/CompanyPendingApproval";
import SubscriptionPlans from "@/features/genaral/SubscriptionPurchase";
import ProjectDetails from "@/features/genaral/ProjectDetails";
const genaralRoutes: RouteObject[] = [
  {
    path: "",
    element: <Homepage />,
  },
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "super-admin-login",
    element: <SuperAdminLogin />,
  },
  {
    path: "register",
    element: <RegisterForm />,
  },
  {
    path: "verify-otp",
    element: <OTPPage context="register" />,
  },
  {
    path: "forgot-otp",
    element: <OTPPage context="forgotPassword" />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "contact",
    element: <ContactPage />,
  },
  {
    path: "company-profile",
    element: <CompanyProfilePage />,
  },
  {
    path: "company-pending-approval",
    element: <CompanyPendingApproval />,
  },
  {
    path: "subscription-purchase/:companyId",
    element: <SubscriptionPlans />,
  },
  {
    path: "project-details",
    element: <ProjectDetails />,
  },
 
  
  
];

export default genaralRoutes;
