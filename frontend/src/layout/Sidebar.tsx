import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { roleMenus } from './roleMenus';

const Sidebar = ({ role }: { role: keyof typeof roleMenus }) => {
  const menus = roleMenus[role] || [];
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-[#f7f7f7] h-screen p-6 shadow-sm border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Stratify</h1>
      </div>

      <ul className="space-y-4">
        {menus.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${currentPath === item.path
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-800 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
