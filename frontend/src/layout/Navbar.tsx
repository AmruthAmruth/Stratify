import React from 'react';
import { Bell } from 'lucide-react'; 

const Navbar = ({ role }: { role: string }) => {
  const userName = role; 
  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center border-b border-gray-200">
     
      <h1 className="text-xl font-semibold text-gray-800">
        Welcome, {userName}
      </h1>

      <div className="flex items-center space-x-6">
       
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          title="Notifications"
        >
          <Bell className="h-6 w-6 text-gray-600" />
    
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header> 
  );
};

export default Navbar;
