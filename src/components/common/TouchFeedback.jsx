import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Touch Feedback Component
 *
 * Provides visual feedback for touch interactions with ripple effect.
 * Enhances touch-friendly UX by showing where the user tapped.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to wrap
 * @param {Function} props.onClick - Click/tap handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.rippleColor - Color of the ripple effect
 * @param {boolean} props.disabled - Disable touch feedback
 * @param {string} props.as - HTML element type (default: 'button')
 */
const TouchFeedback = ({
  children,
  onClick,
  className = "",
  rippleColor = "rgba(255, 255, 255, 0.3)",
  disabled = false,
  as: ElementType = "button", // eslint-disable-line no-unused-vars
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (event) => {
    if (disabled) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    // Get click/touch position
    const x = (event.clientX || event.touches?.[0]?.clientX) - rect.left;
    const y = (event.clientY || event.touches?.[0]?.clientY) - rect.top;

    // Calculate ripple size (diagonal of the button)
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleInteraction = (event) => {
    addRipple(event);
    onClick?.(event);
  };

  return (
    <ElementType
      className={`relative overflow-hidden touch-manipulation ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={handleInteraction}
      onTouchStart={addRipple}
      disabled={disabled}
      {...props}
    >
      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: "translate(-50%, -50%) scale(0)",
            backgroundColor: rippleColor,
            animation: "ripple 600ms ease-out",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </ElementType>
  );
};

TouchFeedback.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  rippleColor: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.elementType,
};

export default TouchFeedback;
