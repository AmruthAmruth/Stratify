import Department from "@/features/company/Department";
import DepartmentDetailsPage from "@/features/company/DepartmentDetailsPage";
import TeamPage from "@/features/company/TeamPage";
import type { RouteObject } from "react-router";

const adminRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Admin Dashboard</h1>
  },
  {
    path: "companies",
    element: <h1>Companies</h1>
  },
   {
    path: "department",
    element: <Department/>
  },
  {
    path: "team",
    element: <TeamPage/>
  }
  ,{
  path: "department-details/:id",
  element: <DepartmentDetailsPage/>
}
   
];

export default adminRoutes;
