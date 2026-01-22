import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import BottomSheet from "./BottomSheet";

/**
 * Responsive Modal Component
 *
 * Automatically switches between traditional Modal (desktop) and BottomSheet (mobile)
 * based on screen size. Provides optimal UX across all devices.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {Function} props.onClose - Callback when closed
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.title - Modal/Sheet title
 * @param {Function} props.onSubmit - Submit handler (optional)
 * @param {string} props.submitLabel - Submit button label (default: 'Submit')
 * @param {boolean} props.isSubmitting - Loading state for submit button
 * @param {number} props.breakpoint - Screen width breakpoint in px (default: 768)
 * @param {string} props.size - Size for both modal and sheet
 */
const ResponsiveModal = ({
  isOpen,
  onClose,
  children,
  title,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  breakpoint = 768,
  size = "medium",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  // Use BottomSheet on mobile, Modal on desktop
  const Component = isMobile ? BottomSheet : Modal;

  return (
    <Component
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      size={size}
    >
      {children}
    </Component>
  );
};

ResponsiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  isSubmitting: PropTypes.bool,
  breakpoint: PropTypes.number,
  size: PropTypes.string,
};

export default ResponsiveModal;
