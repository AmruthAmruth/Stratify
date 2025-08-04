import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

type MainLayoutProps = {
  role: string;
};

const MainLayout = ({ role }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
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
