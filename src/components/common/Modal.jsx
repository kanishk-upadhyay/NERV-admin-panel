import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/selectors";

/**
 * Modal Component
 *
 * Accessible modal dialog with backdrop, keyboard support, and focus management.
 * Rendered via portal to avoid z-index conflicts.
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Function} onClose - Callback when modal should close
 * @param {string} title - Modal header title
 * @param {ReactNode} children - Modal content
 * @param {string} maxWidth - Tailwind max-width class (default: "max-w-lg")
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  const modalRef = useRef(null);
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll

      // Focus modal for keyboard navigation (slight delay for animation)
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`w-full ${maxWidth} bg-surface shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col outline-none ${
          theme === "magi"
            ? "border-2 border-primary font-mono magi-hex-card shadow-[0_0_25px_rgba(255,153,0,0.15)]"
            : "rounded-2xl border border-outline-variant/30 shadow-elevation-3"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-2">
            {theme === "magi" && <span className="w-2.5 h-2.5 bg-primary animate-pulse" />}
            <h2
              id="modal-title"
              className={`text-xl sm:text-2xl font-bold text-primary ${
                theme === "magi" ? "font-mono tracking-wider uppercase" : "font-display"
              }`}
            >
              {title}
            </h2>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-error-container/30 hover:text-error transition-colors text-on-surface-variant font-mono text-sm border border-outline-variant/30 cursor-pointer"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
