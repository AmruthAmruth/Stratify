import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

const MainLayout: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 bg-bg flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;