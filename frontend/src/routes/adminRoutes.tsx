import Department from "@/features/company/Department";
import CompanyDepartmentDetails from "@/features/company/DepartmentDetailsPage";
import ProfilePage from "@/features/company/ProfilePage";
import Projects from "@/features/company/CompanyProjects";
import SubscriptionPlans from "@/features/company/SubscriptionPlans";
import TeamPage from "@/features/company/TeamPage";
import type { RouteObject } from "react-router";

const adminRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Admin Dashboard</h1>,
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
  },{
      path: "projects",
      element: <Projects />,
    },
    {
    path: "project/:id",
    element: <ManagerProjectDetailsPage />,
  },
];

export default adminRoutes;
