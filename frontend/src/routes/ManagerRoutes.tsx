import ManagerProjectDetailsPage from "@/features/common/ManagerProjectDetailsPage";
import ProjectPage from "@/features/common/ProjectPage";
import DepartmentLeaves from "@/features/manager/DepartmentLeaves";
import ChatPage from "@/features/manager/ChatPage";
import GroupChatPage from "@/features/manager/GroupChatPage";
import ManagerDepartmentDetails from "@/features/manager/ManagerDepartmentDetails";
import Meeting from "@/features/manager/Meeting";
import Projects from "@/features/manager/Projects";
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
    element: <Projects />,
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
    element: <Meeting />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/group-chat",
    element: <GroupChatPage />,
  },
];

export default managerRoutes;
