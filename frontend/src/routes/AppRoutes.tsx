import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from '../store/index'

import MainLayout from "../layout/MainLayout";
import superAdminRoutes from "./SuperAdminRoutes";
import adminRoutes from "./CompanyRoutes";
import managerRoutes from "./ManagerRoutes";
import teamRoutes from "./EmployeeRoutes";
import generalRoutes from "./GeneralRoutes";

type UserRole = "super-admin" | "company" | "manager" | "employee" | "general";

const roleRoutesMap: Record<UserRole, RouteObject[]> = {
  "super-admin": superAdminRoutes,
  company: adminRoutes,
  manager: managerRoutes,
  employee: teamRoutes,
  general: []
};

const AppRoutes: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.role) ?? "general";

  const roleRoutes = roleRoutesMap[userRole as UserRole] ?? [];

  let routes: RouteObject[];

  if (userRole === "general") {
    // Unauthenticated users - only show general routes
    routes = [
      ...generalRoutes,
      { path: "*", element: <h1>404 - Not Found</h1> }
    ];
  } else {
    // Authenticated users - show both role-specific routes AND general routes
    routes = [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          ...roleRoutes,
          { index: true, element: <Navigate to="dashboard" replace /> }
        ]
      },
      // Include general routes so authenticated users can still access login, register, etc.
      ...generalRoutes,
      { path: "*", element: <h1>404 - Not Found</h1> }
    ];
  }

  return useRoutes(routes);
};

export default AppRoutes;
