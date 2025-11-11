// src/store/slices/notificationSlice.ts
import { INotification } from "@/shared/components/Notification/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      if (!state.notifications.some(n => n.id === action.payload.id)) {
        state.notifications.unshift(action.payload);
      }
    },
    updateNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications = state.notifications.map(n =>
        n.id === action.payload.id ? action.payload : n
      );
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
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
