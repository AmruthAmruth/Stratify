import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import "./App.css";
import NotificationListener from "./shared/socket/NotificationListener";
import ChatListener from "./shared/socket/ChatListener";
import GroupChatListener from "./shared/socket/GroupChatListener";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { useEffect } from "react";
import { connectSocket } from "./shared/socket/socket";
import { getNotification } from "./services/notification";
import { setNotifications } from "./store/slices/notificationSlice";

const App = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && accessToken) {
      connectSocket(userId, accessToken);

      // Load initial notifications on login
      const loadInitialNotifications = async () => {
        try {
          interface INotification {
            id?: string;
            _id?: string;
            userId?: string;
            role?: "company" | "manager" | "employee";
            title: string;
            message: string;
            type?: "info" | "success" | "warning" | "error";
            isRead: boolean;
            createdAt: string;
            [key: string]: unknown;
          }

          interface NotificationResponse {
            response: INotification[];
          }

          const data = (await getNotification()) as unknown as NotificationResponse;
          if (data?.response?.length) {
            const notifications = data.response.map((n) => ({
              ...n,
              id: n.id || n._id,
            }));
            dispatch(setNotifications(notifications));
          }
        } catch (err) {
          // Failed to load notifications
        }
      };

      loadInitialNotifications();
    }
  }, [userId, accessToken, dispatch]);

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <NotificationListener />
        <ChatListener />
        <GroupChatListener />
        <AppRoutes />
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;