import PropTypes from "prop-types";

/**
 * Stat Card Component
 *
 * Displays a statistic with an icon, label, and value in a card format.
 * Features hover animations and a colored accent glow effect.
 *
 * @param {string} icon - Emoji icon to display
 * @param {string} title - Stat label/description
 * @param {string|number} value - The statistic value to display
 * @param {string} colorClass - Tailwind color class for accent glow
 */
const StatCard = ({ icon, title, value, colorClass }) => {
  // Map generic colors to M3 specific container styles
  const getStyles = () => {
    if (colorClass.includes("primary")) return "bg-primary-container text-on-primary-container";
    if (colorClass.includes("secondary")) return "bg-secondary-container text-on-secondary-container";
    if (colorClass.includes("tertiary")) return "bg-tertiary-container text-on-tertiary-container";
    if (colorClass.includes("success")) return "bg-success-container text-on-success-container";
    if (colorClass.includes("error")) return "bg-error-container text-on-error-container";
    return "bg-surface-variant text-on-surface-variant";
  };

  const containerStyle = getStyles();

  return (
    <div
      className={`p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group bg-surface shadow-sm hover:shadow-md border border-outline-variant/30`}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className={`p-4 rounded-2xl text-2xl ${containerStyle}`}>
            {icon}
          </div>
        </div>

        <div>
          <h3 className="text-on-surface-variant text-sm font-medium tracking-wide uppercase opacity-80">
            {title}
          </h3>
          <p className="text-4xl font-display font-bold text-on-surface mt-1 tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  colorClass: PropTypes.string,
};

export default StatCard;
