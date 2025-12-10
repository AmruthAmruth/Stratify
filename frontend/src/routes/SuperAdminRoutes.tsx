import type { RouteObject } from "react-router";
import SuperAdminDashboard from "../features/superAdmin/SuperAdminDashboard";
import Companies from "../features/superAdmin/AllCompanies";
import Plans from "../features/superAdmin/ManagePlans"
import CompanyProfilePage from "@/features/superAdmin/CompanyProfilePage";
import SuperAdminProfile from "@/features/superAdmin/SuperAdminProfile";
const superAdminRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <SuperAdminDashboard />
  },
  {
    path: "companies",
    element: <Companies />
  },
  {
    path: "plans",
    element: <Plans />
  }, {
    path: "company-profile/:id",
    element: <CompanyProfilePage />
  }
  , {
    path: "purchased-comapny",
    element: <CompanyProfilePage />
  },
  {
    path: "profile",
    element: <SuperAdminProfile />
  }
];

export default superAdminRoutes;
