import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleTheme, setTheme, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
