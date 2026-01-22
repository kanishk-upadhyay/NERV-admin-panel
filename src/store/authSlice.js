import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth Slice - Manages authentication state.
 */

const initialState = {
  isLoggedIn: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token || "fake-jwt-token-12345";
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
