import React from "react";

/**
 * Unified Status Configuration Token Generator
 * Single source of truth for semantic classes and dot indicators.
 */
export const getStatusConfig = (status = "") => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "delivered":
    case "active":
      return {
        colorClasses: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        dotColor: "bg-emerald-500",
      };
    case "shipped":
      return {
        colorClasses: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
        dotColor: "bg-sky-500",
      };
    case "pending":
      return {
        colorClasses: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        dotColor: "bg-amber-500",
      };
    case "inactive":
    case "suspended":
    case "cancelled":
    case "error":
      return {
        colorClasses: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
        dotColor: "bg-rose-500",
      };
    default:
      return {
        colorClasses: "bg-surface-variant text-on-surface-variant border-outline-variant/30",
        dotColor: "bg-on-surface-variant",
      };
  }
};

/**
 * Unified StatusBadge Component
 *
 * Single source of truth for all status indicators across orders, personnel, and inventory.
 * Guarantees correct semantic colors (Pending = Amber, Shipped = Sky Blue, Delivered/Active = Emerald Green).
 *
 * @param {string} status - Status key ("Delivered", "Shipped", "Pending", "active", "inactive", "error")
 * @param {string} label - Optional custom text to display instead of raw status
 * @param {boolean} pulse - Whether the status dot should pulse
 * @param {string} className - Optional additional classes
 */
export const StatusBadge = ({ status = "", label, pulse = false, className = "" }) => {
  const { colorClasses, dotColor } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold border ${colorClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} ${
          pulse ? "animate-pulse" : ""
        }`}
      />
      <span>{label || status}</span>
    </span>
  );
};

export default StatusBadge;
