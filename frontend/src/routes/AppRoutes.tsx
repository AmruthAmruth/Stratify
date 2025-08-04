import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import superAdminRoutes from "./superAdminRoutes";
import adminRoutes from "./adminRoutes";
import managerRoutes from "./managerRoutes";
import teamRoutes from "./teamRoutes";

const userRole = "superAdmin";

const roleRoutesMap: Record<string, any[]> = {
  superAdmin: superAdminRoutes,
  admin: adminRoutes,
  manager: managerRoutes,
  team: teamRoutes
};

const AppRoutes = () => {
  const routes = roleRoutesMap[userRole] || [];


  return (
    <Routes>
      <Route path="/" element={<MainLayout role={userRole} />}>
        {routes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
        <Route index element={<Navigate to="dashboard" />} />
      </Route>
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
