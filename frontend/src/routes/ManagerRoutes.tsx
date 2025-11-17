import ManagerProjectDetailsPage from "@/features/common/ManagerProjectDetailsPage";
import ProjectPage from "@/features/common/ProjectPage";
import { CreateMeeting } from "@/features/manager/CreateMeeting";
import DepartmentLeaves from "@/features/manager/DepartmentLeaves";
import ManagerChatPage from "@/features/manager/ManagerChatPage";
import ManagerDepartmentDetails from "@/features/manager/ManagerDepartmentDetials";
import { ManagerMeeting } from "@/features/manager/ManagerMeeting";
import ManagerProjects from "@/features/manager/ManagerProjects";
import Notification from "@/features/manager/Notification";
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
    element: <ProjectPage />,
  },
  {
    path: "/leave-status",
    element: <DepartmentLeaves />,
  },
  {
    path: "/notification",
    element: <Notification />,
  },
    {
    path: "/meetings",
    element: <ManagerMeeting />,
  },
  {
    path: "/chat",
    element: <ManagerChatPage />,
  },
  

];

export default managerRoutes;
