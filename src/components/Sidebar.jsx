import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../store/selectors";

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
  const theme = useSelector(selectTheme);

  const navItems = [
    {
      to: "/dashboard",
      icon: "📊",
      label: "Dashboard",
      magiCode: "[01] TACTICAL TELEMETRY",
    },
    {
      to: "/users",
      icon: "👥",
      label: "Personnel",
      magiCode: "[02] PERSONNEL DIRECTORY",
    },
    {
      to: "/products",
      icon: "📦",
      label: "Armory & Products",
      magiCode: "[03] ORDNANCE INVENTORY",
    },
    {
      to: "/orders",
      icon: "🛒",
      label: "Requisitions",
      magiCode: "[04] SUPPLY MANIFESTS",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-surface-container border-r border-outline-variant/20 shadow-elevation-1 transition-all duration-300 ease-in-out lg:static lg:shadow-none overflow-hidden ${
          isOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full w-0 lg:translate-x-0 lg:w-0 lg:hidden"
        } ${theme === "magi" ? "font-mono" : ""}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            {theme === "magi" && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono">
              {theme === "magi" ? "MAGI-01 ROUTING" : "Navigation"}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant px-1.5 py-0.5 rounded bg-surface border border-outline-variant/30">
            v2.4
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 p-3 sm:p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-xs sm:text-sm ${
                  isActive
                    ? theme === "magi"
                      ? "bg-primary/20 text-primary border border-primary/50 font-bold font-mono shadow-xs"
                      : "bg-primary text-on-primary font-bold shadow-xs"
                    : "text-on-surface hover:bg-surface-variant/40"
                }`
              }
              onClick={onClose}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="truncate">
                {theme === "magi" ? item.magiCode : item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
