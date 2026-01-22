import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import uiReducer from "./uiSlice";
import orderReducer from "./orderSlice";

const persistConfig = {
  key: "nerv-admin-root",
  version: 2,
  storage,
  whitelist: ["auth", "users", "products", "ui", "orders"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  products: productReducer,
  ui: uiReducer,
  orders: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
