import { useState, useRef, useCallback } from "react";

/**
 * Swipe Gesture Detection Hook
 *
 * Detects swipe gestures (left, right, up, down) with configurable thresholds.
 * Provides touch-friendly interactions for mobile devices.
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback when swiped left
 * @param {Function} options.onSwipeRight - Callback when swiped right
 * @param {Function} options.onSwipeUp - Callback when swiped up
 * @param {Function} options.onSwipeDown - Callback when swiped down
 * @param {number} options.minSwipeDistance - Minimum distance for swipe (default: 50px)
 * @param {number} options.maxSwipeTime - Maximum time for swipe (default: 300ms)
 * @returns {Object} Touch event handlers
 *
 * @example
 * const swipeHandlers = useSwipe({
 *   onSwipeLeft: () => handleDelete(),
 *   onSwipeRight: () => handleEdit(),
 *   minSwipeDistance: 100
 * });
 * <div {...swipeHandlers}>Swipeable content</div>
 */
export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
  maxSwipeTime = 300,
} = {}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const touchStartTime = useRef(null);

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    touchStartTime.current = Date.now();
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const touchDuration = Date.now() - touchStartTime.current;
    if (touchDuration > maxSwipeTime) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      // Horizontal swipe
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          // Swipe left
          onSwipeLeft?.();
        } else {
          // Swipe right
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          // Swipe up
          onSwipeUp?.();
        } else {
          // Swipe down
          onSwipeDown?.();
        }
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [
    touchStart,
    touchEnd,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance,
    maxSwipeTime,
  ]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
