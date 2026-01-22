import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import Modal from "../components/common/Modal";

/**
 * Confirmation Dialog Context
 *
 * Provides a promise-based confirmation dialog that can be used anywhere in the app.
 * Replaces native window.confirm() with a styled modal matching the design system.
 */

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    message: "",
    title: "Confirm Action",
  });

  // Store promise resolver to handle async confirmation
  const resolveRef = useRef(null);

  const confirm = useCallback((message, title = "Confirm Action") => {
    setDialogState({
      isOpen: true,
      message,
      title,
    });

    // Return promise that resolves when user confirms/cancels
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        title={dialogState.title}
        maxWidth="max-w-sm"
      >
        <div className="p-6">
          <p className="text-on-surface-variant mb-8">{dialogState.message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-full font-bold bg-primary text-on-primary hover:bg-primary-dark shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
};

/**
 * Confirmation Dialog Hook
 *
 * @returns {Function} confirm - Async function that shows confirmation dialog
 *
 * @example
 * const confirm = useConfirm();
 * const confirmed = await confirm('Delete this item?', 'Confirm Delete');
 * if (confirmed) { // user clicked Confirm }
 */
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
