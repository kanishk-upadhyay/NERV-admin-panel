/**
 * Loading Spinner Component
 *
 * Animated circular spinner for loading states.
 * Uses CSS border trick with transparent top for rotation effect.
 *
 * @param {string} size - Size variant: "sm", "md", "lg", or "xl" (default: "md")
 * @param {string} color - Tailwind border color class (default: "border-primary")
 * @param {string} className - Additional Tailwind classes
 */
const Spinner = ({ size = "md", color = "border-primary", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`rounded-full border-t-transparent animate-spin ${sizeClasses[size]} ${color} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
