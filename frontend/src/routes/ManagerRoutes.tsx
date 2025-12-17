import ManagerProjectDetailsPage from "@/features/common/ManagerProjectDetailsPage";
import ProjectPage from "@/features/common/ProjectPage";
import DepartmentLeaves from "@/features/manager/DepartmentLeaves";
import ChatPage from "@/features/manager/ChatPage";
import GroupChatPage from "@/features/manager/GroupChatPage";
import ManagerDepartmentDetails from "@/features/manager/ManagerDepartmentDetails";
import Meeting from "@/features/manager/Meeting";
import Projects from "@/features/manager/Projects";
import Notification from "@/features/manager/Notification";
import MyTeam from "@/features/manager/MyTeam";
import type { RouteObject } from "react-router-dom";
import Dashboard from "@/features/manager/Dashboard";
import Profile from "@/features/manager/Profile";
import Tasks from "@/features/manager/Tasks";

const managerRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
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
    path: "/team",
    element: <MyTeam />,
  },
  {
    path: "projects",
    element: <Projects />,
  },
  {
    path: "tasks",
    element: <Tasks />,
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
  {
    path: "/profile",
    element: <Profile />,
  },

];

export default managerRoutes;
