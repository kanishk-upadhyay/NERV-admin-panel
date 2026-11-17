import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "magi", // Default to MAGI System Tactical Terminal
  simulatedLatency: true, // 400ms network lag simulation toggle
  simulateFailure: false, // Optimistic rollback test toggle
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === "magi") state.theme = "dark";
      else if (state.theme === "dark") state.theme = "light";
      else state.theme = "magi";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSimulatedLatency: (state) => {
      state.simulatedLatency = !state.simulatedLatency;
    },
    toggleSimulateFailure: (state) => {
      state.simulateFailure = !state.simulateFailure;
    },
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSimulatedLatency,
  toggleSimulateFailure,
  addToast,
  removeToast
} = uiSlice.actions;

export default uiSlice.reducer;
