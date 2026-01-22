import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../../store/uiSlice";

/**
 * Individual Toast Notification
 *
 * Displays a single notification message with auto-dismiss functionality.
 * Auto-dismisses after 3 seconds unless manually closed.
 */
const Toast = ({ id, message, type }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, id]);

  const bgColors = {
    success: "bg-success-container text-success-on-container border-success/20",
    error: "bg-error-container text-error-on-container border-error/20",
    info: "bg-tertiary-container text-tertiary-on-container border-tertiary/20",
  };

  const icons = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-elevation-2 border ${bgColors[type] || bgColors.info} animate-slide-in min-w-[300px]`}
    >
      <span className="text-xl">{icons[type] || icons.info}</span>
      <p className="font-medium text-sm">{message}</p>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * Toast Container
 *
 * Fixed-position container that displays toast notifications in the bottom-right corner.
 * Renders all active toasts from Redux UI state.
 */
const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts || []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
