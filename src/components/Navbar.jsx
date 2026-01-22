import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { toggleTheme } from "../store/uiSlice";
import { selectTheme } from "../store/selectors";

/**
 * Navigation Bar Component
 *
 * Top navigation with mobile menu toggle, theme switcher, and logout button.
 * Sticky positioned at the top of the layout.
 *
 * @param {Function} onMenuToggle - Callback to toggle mobile sidebar visibility
 */
const Navbar = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="w-full sticky top-0 z-30 flex items-center justify-between px-6 h-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 transition-all shadow-elevation-1 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          className="p-2 -ml-2 rounded-full text-on-surface hover:bg-surface-variant transition-colors active:scale-95 duration-200"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl">☰</span>
        </button>
        <h1 className="text-xl font-display font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          NERV Admin Panel
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full text-on-surface hover:bg-primary-container hover:text-primary hover:scale-110 transition-all duration-300 active:scale-90"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          <span className="text-xl">{theme === "light" ? "🌙" : "☀️"}</span>
        </button>

        <button
          className="px-5 py-2.5 text-sm font-bold tracking-wide text-error bg-error-container/30 rounded-full hover:bg-error hover:text-white transition-all duration-300 shadow-elevation-1 hover:shadow-elevation-3 active:scale-95"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
