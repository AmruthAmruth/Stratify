import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import chatReducer from './slices/chatSlice'
import groupChatReducer from './slices/groupChatSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    chat: chatReducer,
    groupChat: groupChatReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
