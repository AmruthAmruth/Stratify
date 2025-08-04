import type { RouteObject } from "react-router";
import SuperAdminDashboard from "../features/superAdmin/SuperAdminDashboard";
import Companies from "../features/superAdmin/AllCompanies";
import Plans from "../features/superAdmin/Plans"
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
  }
];

export default superAdminRoutes;
