import React from 'react';
import { Bell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCredentials } from '@/store/slices/authSlice';
import { logout } from '@/services/authApi';
import { useSnackbar } from "notistack";
import { RootState } from '@/store';

const Navbar = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Get auth data from Redux
  const name = useSelector((state: RootState) => state.auth.name);

  // Just read from Redux - NotificationListener handles socket updates
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    try {
      const result = await logout();
      enqueueSnackbar(result.message || "Logout successful!", { variant: "success" });
    } catch (err: unknown) {
      const error = err as { message?: string };
      enqueueSnackbar(error?.message || "Logout failed!", { variant: "error" });
    } finally {
      dispatch(clearCredentials());
      localStorage.clear();
      navigate("/");
    }
  };

  // REMOVED: The useEffect with socket listener - NotificationListener handles this globally

  return (
    <header className="w-full bg-white shadow px-6 py-6 flex justify-between items-center border-b border-[#dfdcef]">
      <h1 className="text-xl font-semibold text-gray-900">
        Welcome, <span className="text-[#009063]">{name || 'User'}</span>
      </h1>

      <div className="flex items-center space-x-6">
        <Link
          to="/notification"
          className="relative p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
          title="Notifications"
        >
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>

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

