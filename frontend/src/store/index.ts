import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import chatReducer from './slices/chatSlice';
import groupChatReducer from './slices/groupChatSlice';
import themeReducer from './slices/themeSlice';

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['themeName', 'themeMode', 'primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 'textColor', 'surfaceColor', 'borderColor', 'mutedColor', 'headingColor', 'isCustom', 'companyId', 'isCompanyTheme']
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'role', 'userId', 'name', 'companyName', 'companyLogo', 'email', 'companyId']
};

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notification: notificationReducer,
    chat: chatReducer,
    groupChat: groupChatReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
