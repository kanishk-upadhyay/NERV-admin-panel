import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
        className={`w-full ${maxWidth} bg-surface rounded-2xl shadow-xl border border-outline-variant/20 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 shrink-0">
          <h2
            id="modal-title"
            className="text-2xl font-display font-bold text-primary"
          >
            {title}
          </h2>
          <button
            className="p-2 rounded-full hover:bg-error-container hover:text-error transition-colors text-on-surface-variant"
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
