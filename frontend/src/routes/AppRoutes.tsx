import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from '../store/index'

import MainLayout from "../layout/MainLayout";
import superAdminRoutes from "./superAdminRoutes";
import adminRoutes from "./adminRoutes";
import managerRoutes from "./managerRoutes";
import teamRoutes from "./teamRoutes";
import generalRoutes from "./generalRoutes"; 

type UserRole = "superAdmin" | "company" | "manager" | "employee" | "general";

const roleRoutesMap: Record<UserRole, RouteObject[]> = {
  superAdmin: superAdminRoutes,
  company: adminRoutes,
  manager: managerRoutes,
  employee: teamRoutes,
  general: generalRoutes
};

const AppRoutes: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.role) ?? "general";
  
  
  const roleRoutes = roleRoutesMap[userRole as UserRole] ?? []; 

  let routes: RouteObject[];

  if (userRole === "general") {
    routes = [
      ...roleRoutes,
      { path: "*", element: <h1>404 - Not Found</h1> }
    ];
  } else {
   routes = [
  {
    path: "/",
    element: <MainLayout />,
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
