import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSwipe } from "../../hooks/useSwipe";

/**
 * Bottom Sheet Component
 *
 * Mobile-optimized modal that slides up from the bottom of the screen.
 * Supports swipe-down to dismiss and backdrop tap to close.
 * Better UX than traditional modals on mobile devices.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {Function} props.onClose - Callback when closed
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.title - Sheet title
 * @param {string} props.size - Sheet size: 'small' | 'medium' | 'large' | 'full'
 * @param {boolean} props.dismissible - Allow dismiss by swipe/backdrop (default: true)
 * @param {boolean} props.showHandle - Show drag handle (default: true)
 */
const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  size = "medium",
  dismissible = true,
  showHandle = true,
}) => {
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);

  const swipeHandlers = useSwipe({
    onSwipeDown: () => {
      if (dismissible) {
        onClose?.();
      }
    },
    minSwipeDistance: 80,
  });

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (dismissible && e.target === backdropRef.current) {
      onClose?.();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (dismissible && isOpen && e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, dismissible]);

  // Size classes
  const sizeClasses = {
    small: "max-h-[40vh]",
    medium: "max-h-[60vh]",
    large: "max-h-[80vh]",
    full: "h-[100vh]",
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`relative w-full bg-surface rounded-t-3xl shadow-elevation-4 transform transition-all duration-300 ease-out overflow-hidden ${
          sizeClasses[size]
        } ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
        {...(showHandle ? swipeHandlers : {})}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2 touch-manipulation">
            <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h2
              id="bottom-sheet-title"
              className="text-2xl font-display font-bold text-on-surface"
            >
              {title}
            </h2>
            {dismissible && (
              <button
                onClick={onClose}
                className="touch-target p-2 rounded-full hover:bg-surface-variant/30 active:bg-surface-variant/50 transition-colors touch-manipulation"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6 text-on-surface-variant"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto touch-scroll p-6 pb-safe">
          {children}
        </div>
      </div>
    </div>
  );
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large", "full"]),
  dismissible: PropTypes.bool,
  showHandle: PropTypes.bool,
};

export default BottomSheet;
