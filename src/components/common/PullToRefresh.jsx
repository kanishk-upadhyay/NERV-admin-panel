import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import PropTypes from "prop-types";

/**
 * Pull-to-Refresh Component
 *
 * Wrapper component that adds pull-to-refresh functionality to its children.
 * Shows a loading indicator when user pulls down at the top of the scrollable area.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to wrap
 * @param {Function} props.onRefresh - Async function called when refreshing
 * @param {number} props.pullDownThreshold - Distance to trigger refresh
 * @param {number} props.maxPullDown - Maximum pull distance
 * @param {boolean} props.disabled - Disable pull-to-refresh
 */
const PullToRefresh = ({
  children,
  onRefresh,
  pullDownThreshold = 80,
  maxPullDown = 120,
  disabled = false,
}) => {
  const { isRefreshing, pullPosition } = usePullToRefresh(
    disabled ? () => Promise.resolve() : onRefresh,
    {
      pullDownThreshold,
      maxPullDown,
    }
  );

  const showIndicator = pullPosition > 0 || isRefreshing;
  const indicatorOpacity = Math.min(pullPosition / pullDownThreshold, 1);
  const shouldTrigger = pullPosition >= pullDownThreshold;

  return (
    <div className="relative">
      {/* Pull-to-Refresh Indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out ${
          showIndicator ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          transform: `translateY(${Math.max(0, pullPosition - 40)}px)`,
          height: `${pullPosition}px`,
        }}
      >
        <div
          className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-elevation-2 transition-all duration-200 ${
            shouldTrigger
              ? "bg-primary text-on-primary scale-110"
              : "bg-surface-container text-on-surface"
          }`}
          style={{ opacity: indicatorOpacity }}
        >
          {/* Loading Spinner */}
          <div
            className={`w-6 h-6 border-3 border-current border-t-transparent rounded-full transition-all duration-300 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            style={{
              transform: isRefreshing
                ? "rotate(0deg)"
                : `rotate(${(pullPosition / pullDownThreshold) * 360}deg)`,
            }}
          />

          {/* Status Text */}
          <span className="font-semibold text-sm whitespace-nowrap">
            {isRefreshing
              ? "Refreshing..."
              : shouldTrigger
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: isRefreshing
            ? `translateY(${pullDownThreshold}px)`
            : "translateY(0)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

PullToRefresh.propTypes = {
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func.isRequired,
  pullDownThreshold: PropTypes.number,
  maxPullDown: PropTypes.number,
  disabled: PropTypes.bool,
};

export default PullToRefresh;
