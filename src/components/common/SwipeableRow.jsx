import { useState, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Swipeable Row Component
 *
 * Touch-friendly table row that reveals action buttons on swipe.
 * Supports swipe-left for delete and swipe-right for edit actions.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Row content
 * @param {Function} props.onEdit - Edit action callback
 * @param {Function} props.onDelete - Delete action callback
 * @param {Function} props.onToggle - Toggle action callback (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable swipe actions
 */
const SwipeableRow = ({
  children,
  onEdit,
  onDelete,
  onToggle,
  className = "",
  disabled = false,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const actionTriggered = useRef(false);

  const ACTION_THRESHOLD = 120; // Distance to trigger action
  const REVEAL_THRESHOLD = 60; // Distance to reveal buttons
  const MAX_SWIPE = 200; // Maximum swipe distance

  const handleTouchStart = (e) => {
    if (disabled) return;

    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setIsSwiping(true);
    actionTriggered.current = false;
  };

  const handleTouchMove = (e) => {
    if (disabled || !isSwiping) return;

    touchCurrentX.current = e.touches[0].clientX;
    let diff = touchCurrentX.current - touchStartX.current;

    // Apply resistance for smoother feel
    const resistance = 3;
    diff = diff / resistance;

    // Limit swipe distance
    diff = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diff));

    setTranslateX(diff);
    setSwipeDirection(diff > 0 ? "right" : "left");
  };

  const handleTouchEnd = () => {
    if (disabled || !isSwiping) return;

    setIsSwiping(false);

    // Check if action should be triggered
    if (Math.abs(translateX) >= ACTION_THRESHOLD && !actionTriggered.current) {
      actionTriggered.current = true;

      if (translateX < 0) {
        // Swiped left - Delete
        onDelete?.();
      } else {
        // Swiped right - Edit
        onEdit?.();
      }

      // Reset after action
      setTimeout(() => {
        setTranslateX(0);
        setSwipeDirection(null);
      }, 300);
    } else if (Math.abs(translateX) >= REVEAL_THRESHOLD) {
      // Snap to revealed position
      setTranslateX(translateX < 0 ? -REVEAL_THRESHOLD : REVEAL_THRESHOLD);
    } else {
      // Snap back to center
      setTranslateX(0);
      setSwipeDirection(null);
    }
  };

  const handleActionClick = (action, e) => {
    e.stopPropagation();
    action?.();
    setTranslateX(0);
    setSwipeDirection(null);
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setSwipeDirection(null);
  };

  return (
    <div className="relative overflow-hidden touch-pan-y select-none">
      {/* Background Actions - Left (Edit) */}
      <div
        className={`absolute inset-y-0 left-0 flex items-center justify-start px-4 transition-opacity duration-200 ${
          swipeDirection === "right" && Math.abs(translateX) > 20
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <button
          onClick={(e) => handleActionClick(onEdit, e)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-semibold text-sm shadow-elevation-2 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
          aria-label="Edit"
        >
          <span className="text-lg">✏️</span>
          {Math.abs(translateX) > 60 && <span>Edit</span>}
        </button>
        {onToggle && (
          <button
            onClick={(e) => handleActionClick(onToggle, e)}
            className="ml-2 flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-full font-semibold text-sm shadow-elevation-2 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
            aria-label="Toggle"
          >
            <span className="text-lg">🔄</span>
            {Math.abs(translateX) > 60 && <span>Toggle</span>}
          </button>
        )}
      </div>

      {/* Background Actions - Right (Delete) */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-end px-4 transition-opacity duration-200 ${
          swipeDirection === "left" && Math.abs(translateX) > 20
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <button
          onClick={(e) => handleActionClick(onDelete, e)}
          className="flex items-center gap-2 px-4 py-2 bg-error text-on-error rounded-full font-semibold text-sm shadow-elevation-2 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
          aria-label="Delete"
        >
          {Math.abs(translateX) > 60 && <span>Delete</span>}
          <span className="text-lg">🗑️</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`relative bg-surface transition-transform duration-200 ease-out ${className} ${
          isSwiping ? "transition-none" : ""
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={resetSwipe}
      >
        {children}
      </div>

      {/* Swipe Indicator */}
      {isSwiping && Math.abs(translateX) > 30 && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200 ${
            translateX < 0 ? "right-4" : "left-4"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              Math.abs(translateX) >= ACTION_THRESHOLD
                ? "bg-primary text-on-primary scale-125"
                : "bg-surface-variant text-on-surface-variant"
            } transition-all duration-200`}
          >
            {translateX < 0 ? "←" : "→"}
          </div>
        </div>
      )}
    </div>
  );
};

SwipeableRow.propTypes = {
  children: PropTypes.node.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SwipeableRow;
