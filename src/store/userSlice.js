import { createSlice } from "@reduxjs/toolkit";

/**
 * User Management Slice - Handles CRUD operations for users.
 */

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    initUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    toggleUserStatus: (state, action) => {
      const user = state.users.find((user) => user.id === action.payload);
      if (user) {
        user.status = user.status === "active" ? "inactive" : "active";
      }
    },
    bulkUpdateUserStatus: (state, action) => {
      const { ids, status } = action.payload;
      state.users.forEach((user) => {
        if (ids.includes(user.id)) {
          user.status = status;
        }
      });
    },
    bulkDeleteUsers: (state, action) => {
      const ids = action.payload;
      state.users = state.users.filter((user) => !ids.includes(user.id));
    },
  },
});

export const {
  initUsers,
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  bulkUpdateUserStatus,
  bulkDeleteUsers,
} = userSlice.actions;
export default userSlice.reducer;
