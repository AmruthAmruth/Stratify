
import EmployeeChatPage from "@/features/employee/EmployeeChatPage";
import EmployeeGroupChatPage from "@/features/employee/EmployeeGroupChatPage";
import { EmployeeJoinMeeting } from "@/features/employee/EmployeeJoinMeeting";
import Leave from "@/features/employee/Leave";
import Notification from "@/features/employee/Notification";
import ProjectPage from "@/features/employee/ProjectPage";
import Task from "@/features/employee/Task";
import type { RouteObject } from "react-router";

const teamRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Team Dahsboard</h1>
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
    path: "/meetings",
    element: <EmployeeJoinMeeting />,
  },
  {
    path: "/message",
    element: <EmployeeChatPage />,
  },
  {
    path: "/group-chat",
    element: <EmployeeGroupChatPage />,
  },
  {
    path: "/project",
    element: <ProjectPage />,
  },
];

export default teamRoutes;