import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

const MainLayout: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Navbar role={role} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
