import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define INotification interface locally to avoid import errors
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
}

interface NotificationState {
  notifications: INotification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      // Prevent duplicates by checking if notification already exists
      const exists = state.notifications.some(
        (n: INotification) => n.id === action.payload.id || n.id === action.payload._id
      );
      if (!exists) {
        // Add to beginning of array (newest first)
        state.notifications.unshift(action.payload);
      }
    },
    updateNotification: (state, action: PayloadAction<INotification>) => {
      const index = state.notifications.findIndex(
        (n: INotification) => n.id === action.payload.id
      );
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n: INotification) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  updateNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;