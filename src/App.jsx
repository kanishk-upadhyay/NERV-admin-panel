import { useEffect, lazy, Suspense } from "react";
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
import Spinner from "./components/common/Spinner";
import { ConfirmProvider } from "./context/ConfirmContext";
import usersData from "./data/users.json";
import productsData from "./data/products.json";
import ordersData from "./data/orders.json";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));

const PageLoader = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[50vh] text-center font-mono">
    <Spinner size="lg" />
    <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-4">
      MAGI System · Synchronizing Neural Interface...
    </span>
  </div>
);


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

  const basename =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/NERV-admin-panel")
      ? "/NERV-admin-panel"
      : import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  return (
    <BrowserRouter basename={basename}>
      <div className="w-full flex h-screen bg-surface-container-low text-on-surface font-sans selection:bg-primary/20 transition-colors duration-300">
        <ErrorBoundary>
          <ConfirmProvider>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
            <ToastContainer />
          </ConfirmProvider>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
