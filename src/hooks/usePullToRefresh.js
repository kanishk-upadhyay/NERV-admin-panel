import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Pull-to-Refresh Hook
 *
 * Implements pull-to-refresh gesture for mobile devices.
 * Shows a loading indicator when user pulls down at the top of the page.
 *
 * @param {Function} onRefresh - Async function to call when refreshing
 * @param {Object} options - Configuration options
 * @param {number} options.pullDownThreshold - Distance to trigger refresh (default: 80px)
 * @param {number} options.maxPullDown - Maximum pull distance (default: 120px)
 * @param {HTMLElement} options.scrollableElement - Element to attach listener (default: window)
 * @returns {Object} Pull-to-refresh state and indicator position
 *
 * @example
 * const { isRefreshing, pullPosition } = usePullToRefresh(async () => {
 *   await fetchData();
 * });
 */
export const usePullToRefresh = (
  onRefresh,
  {
    pullDownThreshold = 80,
    maxPullDown = 120,
    scrollableElement = null,
  } = {}
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullPosition, setPullPosition] = useState(0);
  const [canPull, setCanPull] = useState(false);

  const touchStart = useRef(0);
  const touchCurrent = useRef(0);
  const isPulling = useRef(false);

  const isAtTop = useCallback(() => {
    const element = scrollableElement || window;
    if (element === window) {
      return window.scrollY === 0;
    }
    return element.scrollTop === 0;
  }, [scrollableElement]);

  const handleTouchStart = useCallback(
    (e) => {
      if (isAtTop() && !isRefreshing) {
        setCanPull(true);
        touchStart.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    },
    [isAtTop, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isPulling.current || !canPull || isRefreshing) return;

      touchCurrent.current = e.touches[0].clientY;
      const pullDistance = touchCurrent.current - touchStart.current;

      if (pullDistance > 0 && isAtTop()) {
        // Prevent page scroll while pulling
        e.preventDefault();

        // Apply resistance - gets harder to pull as distance increases
        const resistance = 2.5;
        const adjustedDistance = Math.min(
          pullDistance / resistance,
          maxPullDown
        );
        setPullPosition(adjustedDistance);
      }
    },
    [canPull, isRefreshing, isAtTop, maxPullDown]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;

    isPulling.current = false;

    if (pullPosition >= pullDownThreshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullPosition(pullDownThreshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
        setPullPosition(0);
        setCanPull(false);
      }
    } else {
      // Animate back to 0
      setPullPosition(0);
      setCanPull(false);
    }
  }, [pullPosition, pullDownThreshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const element = scrollableElement || document;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, scrollableElement]);

  return {
    isRefreshing,
    pullPosition,
    isPulling: isPulling.current,
    canPull,
  };
};
