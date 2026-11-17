import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/selectors";

/**
 * Unified TableContainer Component
 *
 * Provides a standardized outer card wrapper for data tables across the application.
 * In MAGI mode, automatically applies the authentic hexagonal chamfers and orange glow.
 * In standard mode, provides a clean elevated Material 3 card with crisp borders.
 */
export const TableContainer = ({ children, className = "" }) => {
  const theme = useSelector(selectTheme);

  return (
    <div
      className={`bg-surface border overflow-hidden transition-all ${
        theme === "magi"
          ? "magi-hex-card border-primary/40 font-mono shadow-[0_0_15px_rgba(255,153,0,0.1)]"
          : "rounded-2xl border-outline-variant/30 shadow-sm"
      } ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};

export default TableContainer;
