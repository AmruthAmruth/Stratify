import React from 'react';
import { Bell } from 'lucide-react'; 
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCredentials } from '@/store/slices/authSlice';
import { logout } from '@/services/authApi';
import { useSnackbar } from "notistack";

const Navbar = ({ role }: { role: string }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const userName = role;

  const handleLogout = async () => {
    try {
      const result = await logout();
      enqueueSnackbar(result.message || "Logout successful!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error?.message || "Logout failed!", { variant: "error" });
    } finally {
      dispatch(clearCredentials());
      localStorage.clear(); 
      navigate("/");
    }
  };

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center border-b border-[#dfdcef]">
      <h1 className="text-xl font-semibold text-gray-900">
        Welcome, <span className="text-[#009063]">{userName}</span>
      </h1>

      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
          title="Notifications"
        >
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#009063] text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
