import { useDispatch } from "react-redux";
import { addToast } from "../store/uiSlice";

/**
 * Hook for displaying toast notifications.
 */
export const useToast = () => {
    const dispatch = useDispatch();

    const showToast = (message, type = "info") => {
        const id = Date.now();
        dispatch(addToast({ id, message, type }));
    };

    return {
        success: (message) => showToast(message, "success"),
        error: (message) => showToast(message, "error"),
        info: (message) => showToast(message, "info"),
    };
};
