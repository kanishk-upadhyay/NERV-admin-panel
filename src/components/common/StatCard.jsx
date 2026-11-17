import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/selectors";

/**
 * Stat Card Component
 *
 * Displays a statistic with an icon, label, and value.
 * In MAGI mode, renders as a crisp mechanical telemetry card.
 */
const StatCard = ({ icon, title, value, colorClass }) => {
  const theme = useSelector(selectTheme);

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
      className={`p-6 transition-all duration-200 relative overflow-hidden group bg-surface border ${
        theme === "magi"
          ? "magi-hex-card border-primary/50 hover:border-primary shadow-sm font-mono"
          : "rounded-3xl border-outline-variant/30 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <div
            className={`p-3.5 text-2xl ${
              theme === "magi"
                ? "bg-primary/20 text-primary border border-primary/40 rounded"
                : `${containerStyle} rounded-2xl`
            }`}
          >
            {icon}
          </div>
        </div>

        <div>
          <h3 className="text-on-surface-variant text-xs font-bold tracking-wider uppercase">
            {title}
          </h3>
          <p
            className={`text-3xl sm:text-4xl font-extrabold text-on-surface mt-1 tracking-tight ${
              theme === "magi" ? "font-mono text-primary" : "font-display"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  colorClass: PropTypes.string.isRequired,
};

export default StatCard;
