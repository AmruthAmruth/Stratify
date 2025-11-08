import EmployeeProjectDetailsPage from "@/features/employee/EmployeeProjectDetailsPage";
import Leave from "@/features/employee/Leave";
import Notification from "@/features/employee/Notification";
import type { RouteObject } from "react-router";
const teamRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Team Dahsboard</h1>
  },
  {
    path: "leave-status",
    element: <Leave/>
  },
  {
    path: "my-tasks",
    element: <EmployeeProjectDetailsPage/>
  },
   {
    path: "notification",
    element: <Notification/>
  }

];

export default teamRoutes;