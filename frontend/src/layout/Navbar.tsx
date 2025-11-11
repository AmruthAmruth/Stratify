import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react'; 
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearCredentials } from '@/store/slices/authSlice';
import { logout } from '@/services/authApi';
import { useSnackbar } from "notistack";
import { getSocket } from '@/shared/socket/socket';
import { getNotification } from '@/services/notification'; // ✅ Import API to fetch notifications

const Navbar = ({ role }: { role: string }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = role;

  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Handle logout
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

  // ✅ Fetch initial notifications and calculate unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getNotification();
        if (data?.response?.length) {
          const unread = data.response.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchUnreadCount();
  }, []);

  // ✅ Listen for new notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (data: any) => {
      console.log("New notification received:", data);
      setUnreadCount((prev) => prev + 1); // Increment unread count
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, []);

  // ✅ Reset count when user navigates to /notification
  useEffect(() => {
    if (location.pathname === "/notification") {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center border-b border-[#dfdcef]">
      <h1 className="text-xl font-semibold text-gray-900">
        Welcome, <span className="text-[#009063]">{userName}</span>
      </h1>

      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
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
