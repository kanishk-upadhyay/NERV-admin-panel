import React from "react";

/**
 * Unified ActionPill Component
 *
 * Reusable table action button (Edit, Delete, Toggle, Custom).
 * Eliminates ad-hoc styling and ensures consistent sizing, font, and accessibility.
 */
export const ActionPill = ({
  variant = "default",
  onClick,
  title,
  children,
  className = "",
  disabled = false,
}) => {
  let variantStyles = "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant border-outline-variant/30";

  if (variant === "primary" || variant === "edit") {
    variantStyles = "text-primary hover:bg-primary/10 border-outline-variant/30 hover:border-primary/50";
  } else if (variant === "danger" || variant === "delete") {
    variantStyles = "text-error hover:bg-error-container/20 border-error/30 hover:border-error/60";
  } else if (variant === "success") {
    variantStyles = "text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title || (typeof children === "string" ? children : undefined)}
      className={`px-2.5 py-1 rounded border font-mono text-xs font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionPill;
