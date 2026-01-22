import { createSlice } from "@reduxjs/toolkit";

/**
 * Order Management Slice - Handles order entities.
 */

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    initOrders: (state, action) => {
      state.orders = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find((order) => order.id === id);
      if (order) {
        order.status = status;
      }
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
    },
  },
});

export const { initOrders, updateOrderStatus, deleteOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
