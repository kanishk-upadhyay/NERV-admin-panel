import { createSlice } from "@reduxjs/toolkit";

/**
 * Product Management Slice - Handles CRUD operations for products.
 */

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    initProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id,
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateProductCategory: (state, action) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id,
      );
      if (product) {
        product.category = action.payload.category;
      }
    },
  },
});

export const {
  initProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductCategory,
} = productSlice.actions;
export default productSlice.reducer;
