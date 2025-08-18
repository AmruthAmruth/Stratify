import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { roleMenus } from './roleMenus';
import { useSelector } from "react-redux";
import { RootState } from '@/store/index';
import { UserRole } from './types';

const Sidebar: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.role) as UserRole;
  const menus = role ? roleMenus[role] : [];
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-white h-screen p-6 shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="mb-10 flex items-center justify-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stratify</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {menus.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg font-medium text-gray-900 transition-all duration-200
                  ${currentPath === item.path
                    ? "bg-gray-100 shadow-inner"
                    : "hover:bg-gray-50 hover:text-gray-900"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Profile Section */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
            {/* Placeholder Avatar */}
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
