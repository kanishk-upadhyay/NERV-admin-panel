import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../store/selectors";

/**
 * Protected Route Guard
 *
 * Wraps routes that require authentication. Redirects to login if user is not authenticated.
 * Used in App.jsx to protect dashboard and admin pages.
 *
 * @param {ReactNode} children - Components to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
