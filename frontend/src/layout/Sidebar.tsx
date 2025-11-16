import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { UserRole } from "./types";
import { roleMenus } from "./roleMenus";
import * as Icons from "lucide-react";

const getIcon = (iconName: string) => {
  return (Icons as any)[iconName] || Icons.Circle;
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

      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen bg-[#fbfbfb] shadow-xl border-r border-[#dfdcef]
          flex flex-col transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-72"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#dfdcef]">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#009063] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-[#3b3b3b] tracking-tight">Stratify</h1>
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#009063] rounded-xl flex items-center justify-center mx-auto shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-4 top-8 w-8 h-8 bg-white border-2 border-[#dfdcef]
            rounded-full flex items-center justify-center shadow-md hover:shadow-lg 
            transition-all duration-200 hover:border-[#009063] group z-10
            ${isCollapsed ? "rotate-180" : ""}
          `}
        >
          <Icons.Menu className="w-4 h-4 text-[#3b3b3b] group-hover:text-[#009063]" />
        </button>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menus.map((item) => {
              const IconComponent = getIcon(item.icon);
              const isActive = currentPath === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      w-full flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                      group relative overflow-hidden text-left
                      ${isActive
                        ? "bg-[#dfdcef] text-[#009063] shadow-sm border border-[#009063]/20"
                        : "text-[#3b3b3b] hover:bg-[#f2f2f2] hover:text-[#009063]"
                      }
                      ${isCollapsed ? "justify-center px-3" : ""}
                    `}
                    title={isCollapsed ? item.label : ""}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#009063] rounded-r-full" />
                    )}

                    <IconComponent
                      className={`
                        w-5 h-5 transition-colors duration-200 flex-shrink-0
                        ${isActive ? "text-[#009063]" : "text-gray-500 group-hover:text-[#009063]"}
                        ${isCollapsed ? "" : "mr-4"}
                      `}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="font-medium tracking-wide flex-1">{item.label}</span>
                        {isActive && (
                          <Icons.ChevronRight className="w-4 h-4 text-[#009063] ml-2" />
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
