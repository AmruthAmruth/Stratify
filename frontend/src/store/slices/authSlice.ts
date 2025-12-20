import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  role: string | null;
  userId: string | null;
  name: string | null;
  companyName: string | null;
  companyLogo: string | null;
  email: string | null;
  companyThemeColor: string | null;
  themeBackgroundColor: string | null;
  themeTextColor: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  userId: null,
  name: null,
  companyName: null,
  companyLogo: null,
  email: null,
  companyThemeColor: null,
  themeBackgroundColor: null,
  themeTextColor: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        role: string | null;
        userId: string | null;
        name: string | null;
        companyName?: string | null;
        companyLogo?: string | null;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.companyName = action.payload.companyName || null;
      state.companyLogo = action.payload.companyLogo || null;
    },
    setCompanyInfo: (
      state,
      action: PayloadAction<{ companyName: string; companyLogo?: string }>
    ) => {
      state.companyName = action.payload.companyName;
      state.companyLogo = action.payload.companyLogo || null;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.role = null;
      state.userId = null;
      state.name = null;
      state.companyName = null;
      state.companyLogo = null;
    },
  },
});

export const { setCredentials, setCompanyInfo, clearCredentials } = authSlice.actions;
export default authSlice.reducer;


