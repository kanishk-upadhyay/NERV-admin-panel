import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { initUsers } from "./store/userSlice";
import { initProducts } from "./store/productSlice";
import { initOrders } from "./store/orderSlice";
import {
  selectTheme,
  selectAllUsers,
  selectAllProducts,
  selectAllOrders,
} from "./store/selectors";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import ToastContainer from "./components/common/ToastContainer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ConfirmProvider } from "./context/ConfirmContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import usersData from "./data/users.json";
import productsData from "./data/products.json";
import ordersData from "./data/orders.json";


function App() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const users = useSelector(selectAllUsers);
  const products = useSelector(selectAllProducts);
  const orders = useSelector(selectAllOrders);

  /* Initialize store with default data if empty to preserve persisted state */
  useEffect(() => {
    if (users.length === 0) {
      dispatch(initUsers(usersData));
    }
    if (products.length === 0) {
      dispatch(initProducts(productsData));
    }
    if (orders.length === 0) {
      dispatch(initOrders(ordersData));
    }
  }, [dispatch, users.length, products.length, orders.length]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="w-full flex h-screen bg-surface-container-low text-on-surface font-sans selection:bg-primary/20 transition-colors duration-300">
        <ErrorBoundary>
          <ConfirmProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer />
          </ConfirmProvider>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
