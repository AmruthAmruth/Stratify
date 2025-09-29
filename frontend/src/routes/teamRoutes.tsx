import Leave from "@/features/employee/Leave";
import type { RouteObject } from "react-router";
const teamRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Team Dahsboard</h1>
  },
  {
    path: "leave-status",
    element: <Leave/>
  }
];

export default teamRoutes;