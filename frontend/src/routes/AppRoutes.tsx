import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import superAdminRoutes from "./superAdminRoutes";
import adminRoutes from "./adminRoutes";
import managerRoutes from "./managerRoutes";
import teamRoutes from "./teamRoutes";
import generalRoutes from "./generalRoutes"; 

// Add "general" as a possible role
type UserRole = "superAdmin" | "admin" | "manager" | "team" | "general";

// Map each role to its routes
const roleRoutesMap: Record<UserRole, RouteObject[]> = {
  superAdmin: superAdminRoutes,
  admin: adminRoutes,
  manager: managerRoutes,
  team: teamRoutes,
  general: generalRoutes
};

// Example: get role from authentication
// If no user is logged in, set to "general"
const userRole: UserRole = getUserRoleOrDefault();

// Simulated function — replace with your auth logic
function getUserRoleOrDefault(): UserRole {
  const storedRole = localStorage.getItem("userRole") as UserRole | null;
  return storedRole ?? "general";
}

const AppRoutes: React.FC = () => {
  const roleRoutes = roleRoutesMap[userRole];

  let routes: RouteObject[];

  if (userRole === "general") {
    // Public routes only
    routes = [
      ...roleRoutes, // homepage, about, etc.
      { path: "*", element: <h1>404 - Not Found</h1> }
    ];
  } else {
    // Authenticated role-based routes
    routes = [
      {
        path: "/",
        element: <MainLayout role={userRole} />,
        children: [
          ...roleRoutes,
          { index: true, element: <Navigate to="dashboard" replace /> }
        ]
      },
      { path: "*", element: <h1>404 - Not Found</h1> }
    ];
  }

  return useRoutes(routes);
};

export default AppRoutes;
