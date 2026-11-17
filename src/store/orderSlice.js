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
    bulkUpdateOrderStatus: (state, action) => {
      const { ids, status } = action.payload;
      state.orders.forEach((order) => {
        if (ids.includes(order.id)) {
          order.status = status;
        }
      });
    },
    bulkDeleteOrders: (state, action) => {
      const ids = action.payload;
      state.orders = state.orders.filter((order) => !ids.includes(order.id));
    },
  },
});

export const { initOrders, updateOrderStatus, deleteOrder, bulkUpdateOrderStatus, bulkDeleteOrders } =
  orderSlice.actions;
export default orderSlice.reducer;
