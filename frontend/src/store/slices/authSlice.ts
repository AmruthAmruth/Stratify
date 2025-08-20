import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  role: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; role: string | null; userId: string | null }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.role = null;
      state.userId = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
