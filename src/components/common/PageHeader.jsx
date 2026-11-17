import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/selectors";

/**
 * Unified PageHeader Component
 *
 * Guarantees visual harmony, identical typography, responsive layouts,
 * and seamless MAGI/Standard theme switching across all application pages.
 *
 * @param {string} title - Standard theme title
 * @param {string} magiTitle - Tactical MAGI theme title
 * @param {string} description - Page descriptive subtitle
 * @param {React.ReactNode} children - Action controls (Search, Filters, Action buttons)
 */
export const PageHeader = ({ title, magiTitle, description, children }) => {
  const theme = useSelector(selectTheme);
  const displayTitle = theme === "magi" && magiTitle ? magiTitle : title;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] ${
            theme === "magi" ? "font-mono text-primary uppercase" : "font-display text-on-surface"
          }`}
        >
          {displayTitle}
        </h1>
        {description && (
          <p className="text-on-surface-variant mt-1.5 text-sm sm:text-base [text-wrap:pretty]">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
