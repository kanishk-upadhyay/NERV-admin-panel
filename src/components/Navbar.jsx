import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { setTheme, toggleSimulatedLatency } from "../store/uiSlice";
import { selectTheme, selectSimulatedLatency } from "../store/selectors";

/**
 * Navigation Bar Component
 *
 * Top navigation with mobile menu toggle, theme switcher (Light, Dark, MAGI System),
 * simulated latency switch, and authentic MAGI consensus indicators.
 */
const Navbar = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const simulatedLatency = useSelector(selectSimulatedLatency);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="w-full sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-20 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 transition-all shadow-elevation-1 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          className="p-2 -ml-2 rounded-lg text-on-surface hover:bg-surface-variant transition-colors active:scale-95 duration-200"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl">☰</span>
        </button>

        <div className="flex items-baseline gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-primary">
            NERV
          </h1>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/50 font-bold hidden sm:inline">
            {theme === "magi" ? "MAGI-01 TERMINAL" : "ADMIN PANEL"}
          </span>
        </div>
      </div>

      {/* Theme Status Badge for MAGI mode */}
      {theme === "magi" && (
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 bg-surface-container border border-primary/50 text-primary font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>MAGI-01 TRIAD ONLINE</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simulated 400ms Network Latency Toggle */}
        <button
          onClick={() => dispatch(toggleSimulatedLatency())}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
            simulatedLatency
              ? "bg-primary/20 text-primary border-primary shadow-xs"
              : "bg-surface-variant/30 text-on-surface-variant border-outline-variant/30 hover:bg-surface-variant/50 hover:text-on-surface"
          }`}
          title="Toggle 400ms simulated network latency with optimistic state updates"
          aria-label="Toggle simulated network latency"
        >
          <span className={`w-2 h-2 rounded-full transition-colors ${simulatedLatency ? "bg-primary animate-pulse" : "bg-outline-variant"}`} />
          <span className="hidden sm:inline">Async Lag:</span>
          <span className="font-bold">{simulatedLatency ? "400ms" : "OFF"}</span>
        </button>

        {/* Theme Switcher: Light / Dark / MAGI */}
        <div className="flex items-center p-1 rounded-lg bg-surface-container border border-outline-variant/30 text-xs font-mono">
          <button
            onClick={() => dispatch(setTheme("light"))}
            className={`px-2 py-1 rounded transition-all ${
              theme === "light"
                ? "bg-primary text-on-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            title="Light Theme"
          >
            ☀️
          </button>
          <button
            onClick={() => dispatch(setTheme("dark"))}
            className={`px-2 py-1 rounded transition-all ${
              theme === "dark"
                ? "bg-primary text-on-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            title="Dark Theme"
          >
            🌙
          </button>
          <button
            onClick={() => dispatch(setTheme("magi"))}
            className={`px-2 py-1 rounded transition-all ${
              theme === "magi"
                ? "bg-primary text-on-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            title="MAGI System Terminal"
          >
            ⚡ MAGI
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-error hover:bg-error-container/20 border border-error/40 transition-colors"
          title="Log out of terminal"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
