import Department from "@/features/company/Department";
import CompanyDepartmentDetails from "@/features/company/DepartmentDetailsPage";
import ProfilePage from "@/features/company/ProfilePage";
import CompanyProfile from "@/features/company/CompanyProfile";
import Projects from "@/features/company/CompanyProjects";
import SubscriptionPlans from "@/features/company/SubscriptionPlans";
import TeamPage from "@/features/company/TeamPage";
import ChatPage from "@/features/company/ChatPage";
import type { RouteObject } from "react-router";
import Notification from "@/features/company/Notification";
import StratifyDashboard from "@/features/company/CompanyDashboard";
import ProjectPage from "@/features/employee/ProjectPage";
import CompanyGroupChatPage from "@/features/company/CompanyGroupChatPage";

const adminRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <StratifyDashboard />,
  },
  {
    path: "companies",
    element: <h1>Companies</h1>,
  },
  {
    path: "department",
    element: <Department />,
  },
  {
    path: "team",
    element: <TeamPage />,
  },
  {
    path: "chat",
    element: <ChatPage />,
  },
  {
    path: "group-chat",
    element: <CompanyGroupChatPage />,
  },
  {
    path: "subscription",
    element: <SubscriptionPlans />,
  },
  {
    path: "department-details/:id",
    element: <CompanyDepartmentDetails />,
  },
  {
    path: "team-member-profile/:id",
    element: <ProfilePage />,
  },
  {
    path: "my-profile",
    element: <CompanyProfile />,
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
    path: "notification",
    element: <Notification />,
  }
];

export default adminRoutes;
