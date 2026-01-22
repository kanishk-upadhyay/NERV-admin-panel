import { NavLink } from "react-router-dom";

/**
 * Sidebar Navigation Component
 *
 * Responsive sidebar with navigation links. Fixed on desktop, overlay drawer on mobile.
 * Automatically closes on mobile when a route is selected.
 *
 * @param {boolean} isOpen - Controls sidebar visibility on mobile
 * @param {Function} onClose - Callback to close sidebar (mobile only)
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50  bg-surface-container shadow-elevation-1 transition-all duration-300 ease-in-out lg:static lg:shadow-none overflow-hidden ${
          isOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full w-0 lg:translate-x-0 lg:w-0 lg:hidden"
        }`}
      >
        <div className="flex items-center h-20 px-6 border-b border-outline-variant/20">
          <h2 className="text-xl font-display font-bold text-primary">
            Navigation
          </h2>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container text-secondary-on-container shadow-sm"
                  : "text-on-surface hover:bg-surface-variant/50 hover:pl-7"
              }`
            }
            onClick={onClose}
          >
            <span className="text-xl">📊</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container text-secondary-on-container shadow-sm"
                  : "text-on-surface hover:bg-surface-variant/50 hover:pl-7"
              }`
            }
            onClick={onClose}
          >
            <span className="text-xl">👥</span>
            Users
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container text-secondary-on-container shadow-sm"
                  : "text-on-surface hover:bg-surface-variant/50 hover:pl-7"
              }`
            }
            onClick={onClose}
          >
            <span className="text-xl">📦</span>
            Products
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? "bg-secondary-container text-secondary-on-container shadow-sm"
                  : "text-on-surface hover:bg-surface-variant/50 hover:pl-7"
              }`
            }
            onClick={onClose}
          >
            <span className="text-xl">🛒</span>
            Orders
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
