import ChatPage from "@/features/employee/ChatPage";
import GroupChatPage from "@/features/employee/GroupChatPage";
import JoinMeeting from "@/features/employee/JoinMeeting";
import Leave from "@/features/employee/Leave";
import Notification from "@/features/employee/Notification";
import EmployeeProjects from "@/features/employee/EmployeeProjects";
import EmployeeProjectDetailsPage from "@/features/employee/ProjectDetailsPage";
import Task from "@/features/employee/Task";
import type { RouteObject } from "react-router";
import EmployeeDashboard from "@/features/employee/Dashboard";
import EmployeeProfile from "@/features/employee/EmployeeProfile";

const teamRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <EmployeeDashboard />
  },
  {
    path: "leave-status",
    element: <Leave />
  },
  {
    path: "my-task",
    element: <Task />
  },
  {
    path: "notification",
    element: <Notification />
  },
  {
    path: "meetings",
    element: <JoinMeeting />,
  },
  {
    path: "message",
    element: <ChatPage />,
  },
  {
    path: "group-chat",
    element: <GroupChatPage />,
  },
  {
    path: "project",
    element: <EmployeeProjects />,
  },
  {
    path: "project/:id",
    element: <EmployeeProjectDetailsPage />,
  },
  {
    path: "my-profile",
    element: <EmployeeProfile />,
  },
];

export default teamRoutes;