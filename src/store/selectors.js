import { createSelector } from "@reduxjs/toolkit";

/**
 * User Selectors
 */

export const selectAllUsers = (state) => state.users.users;

export const selectTotalUsers = createSelector(
  [selectAllUsers],
  (users) => users.length,
);

export const selectActiveUsers = createSelector(
  [selectAllUsers],
  (users) => users.filter((user) => user.status === "active").length,
);

export const selectInactiveUsers = createSelector(
  [selectAllUsers],
  (users) => users.filter((user) => user.status === "inactive").length,
);

export const selectUserById = (userId) =>
  createSelector([selectAllUsers], (users) =>
    users.find((user) => user.id === userId),
  );

/**
 * Product Selectors
 */

export const selectAllProducts = (state) => state.products.products;

export const selectTotalProducts = createSelector(
  [selectAllProducts],
  (products) => products.length,
);

export const selectProductsByCategory = createSelector(
  [selectAllProducts],
  (products) => {
    const categoryMap = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(product);
    });
    return categoryMap;
  },
);

export const selectCategoryCount = createSelector(
  [selectProductsByCategory],
  (categoryMap) => Object.keys(categoryMap).length,
);

export const selectTotalRevenue = createSelector(
  [selectAllProducts],
  (products) =>
    products.reduce(
      (sum, product) => sum + product.price * (product.sold || 0),
      0,
    ),
);

export const selectAverageProductPrice = createSelector(
  [selectAllProducts],
  (products) => {
    if (products.length === 0) return 0;
    const total = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );
    return total / products.length;
  },
);

/**
 * UI Selectors
 */

export const selectTheme = (state) => state.ui.theme;

/**
 * Auth Selectors
 */

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectToken = (state) => state.auth.token;

/**
 * Order Selectors
 */

export const selectAllOrders = (state) => state.orders.orders;

export const selectTotalOrders = createSelector(
  [selectAllOrders],
  (orders) => orders.length,
);

export const selectOrderRevenue = createSelector([selectAllOrders], (orders) =>
  orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0),
);
