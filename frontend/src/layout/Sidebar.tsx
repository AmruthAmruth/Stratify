import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { roleMenus } from './roleMenus';
import { useSelector } from "react-redux";
import { RootState } from '@/store/index';
import { UserRole } from './types';
import { 
  Menu, 
  ChevronRight, 
  User, 
  Settings, 
  Home, 
  Users, 
  FileText, 
  Mail, 
  CreditCard, 
  Bell 
} from 'lucide-react';

// Map menu labels to icons
const iconMap: Record<string, React.FC<any>> = {
  Dashboard: Home,
  Companies: Users,
  Plans: FileText,
  Messages: Mail,
  Payments: CreditCard,
  Notification: Bell,
};

const Sidebar: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.role) as UserRole;
  const menus = role ? roleMenus[role] : [];
  const location = useLocation();
  const currentPath = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 h-screen bg-white shadow-2xl border-r border-gray-100 
        flex flex-col transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stratify</h1>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-4 top-8 w-8 h-8 bg-white border-2 border-gray-200 
            rounded-full flex items-center justify-center shadow-lg hover:shadow-xl 
            transition-all duration-200 hover:border-blue-300 group z-10
            ${isCollapsed ? 'rotate-180' : ''}
          `}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Menu items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menus.map((item) => {
              const IconComponent = iconMap[item.label] || Home;
              const isActive = currentPath === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      w-full flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                      group relative overflow-hidden text-left
                      ${isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                      ${isCollapsed ? 'justify-center px-3' : ''}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                    )}

                    <IconComponent
                      className={`
                        w-5 h-5 transition-colors duration-200 flex-shrink-0
                        ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                        ${isCollapsed ? '' : 'mr-4'}
                      `}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="font-medium tracking-wide flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 text-blue-600 ml-2" />}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile section */}
        <div className="p-4 border-t border-gray-100">
          <div className={`
            flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 
            transition-colors duration-200 cursor-pointer group
            ${isCollapsed ? 'justify-center' : 'space-x-3'}
          `}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Super Admin</p>
              </div>
            )}
            {!isCollapsed && <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
