import Department from "@/features/company/Department";
import DepartmentDetailsPage from "@/features/company/DepartmentDetailsPage";
import ProfilePage from "@/features/company/ProfilePage";
import SubscriptionPlans from "@/features/company/SubscriptionPlans";
import TeamPage from "@/features/company/TeamPage";
import type { RouteObject } from "react-router";

const adminRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <h1>Admin Dashboard</h1>
  },
  {
    path: "companies",
    element: <h1>Companies</h1>
  },
   {
    path: "department",
    element: <Department/>
  },
  {
    path: "team",
    element: <TeamPage/>
  }
  ,{
  path: "subscription",
  element: <SubscriptionPlans/>
}
  ,{
  path: "department-details/:id",
  element: <DepartmentDetailsPage/>
},{
  path: "team-member-profile/:id",
  element: <ProfilePage/>
}

   
];

export default adminRoutes;
