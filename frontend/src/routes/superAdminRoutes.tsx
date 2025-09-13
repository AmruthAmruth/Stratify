import type { RouteObject } from "react-router";
import SuperAdminDashboard from "../features/superAdmin/SuperAdminDashboard";
import Companies from "../features/superAdmin/AllCompanies";
import Plans from "../features/superAdmin/Plans"
import CompanyProfilePage from "@/features/superAdmin/CompanyProfilePage";
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
    element: <Plans/>
  },{
  path: "company-profile/:id",
  element: <CompanyProfilePage/>
}
];

export default superAdminRoutes;
