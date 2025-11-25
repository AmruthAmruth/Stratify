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
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Im running", userId);

    if (userId) {
      connectSocket(userId);

      // Load initial notifications on login
      const loadInitialNotifications = async () => {
        try {
          const data: any = await getNotification();
          if (data?.response?.length) {
            const notifications = data.response.map((n: any) => ({
              ...n,
              id: n.id || n._id,
            }));
            dispatch(setNotifications(notifications));
          }
        } catch (err) {
          console.error("Failed to load notifications:", err);
        }
      };

      loadInitialNotifications();
    }
  }, [userId, dispatch]);

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