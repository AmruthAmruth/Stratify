import ManagerDepartmentDetails from "@/features/manager/ManagerDepartmentDetials";
import type { RouteObject } from "react-router-dom";

const managerRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1 className="text-black">Manager</h1>,
  },
  {
    path: "companies",
    element: <h1>Companies</h1>,
  },
  
  {
    path: "department",
    element: <ManagerDepartmentDetails/>,
  },
];

export default managerRoutes;
