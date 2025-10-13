import ManagerProjectDetailsPage from "@/features/common/ManagerProjectDetailsPage";
import DepartmentLeaves from "@/features/manager/DepartmentLeaves";
import { ManagerChat } from "@/features/manager/ManagerChat";
import ManagerDepartmentDetails from "@/features/manager/ManagerDepartmentDetials";
import ManagerProjects from "@/features/manager/ManagerProjects";
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
    element: <ManagerDepartmentDetails />,
  },
  {
    path: "projects",
    element: <ManagerProjects />,
  },
  {
    path: "project/:id",
    element: <ManagerProjectDetailsPage />,
  },
  {
    path: "/leave-status",
    element: <DepartmentLeaves />,
  },
  {
  path: "chat",
  element: <ManagerChat />
}

];

export default managerRoutes;
