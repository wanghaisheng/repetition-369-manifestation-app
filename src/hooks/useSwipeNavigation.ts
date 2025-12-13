import { useEffect, useRef, useState, useCallback } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
}

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance to trigger swipe
  edgeWidth?: number; // Edge area width for starting swipe
  enabled?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  edgeWidth = 30,
  enabled = true,
}: UseSwipeNavigationOptions) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isSwiping: false,
    direction: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const startedFromEdge = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    
    // Check if touch started from edge
    const isLeftEdge = touch.clientX < edgeWidth;
    const isRightEdge = touch.clientX > screenWidth - edgeWidth;
    
    startedFromEdge.current = isLeftEdge || isRightEdge;
    
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      isSwiping: false,
      direction: null,
    });
  }, [enabled, edgeWidth]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = touch.clientY - swipeState.startY;
    
    // Only consider horizontal swipes (deltaX > deltaY)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (isHorizontalSwipe && Math.abs(deltaX) > 10) {
      setSwipeState(prev => ({
        ...prev,
        currentX: touch.clientX,
        isSwiping: true,
        direction: deltaX > 0 ? 'right' : 'left',
      }));
    }
  }, [enabled, swipeState.startX, swipeState.startY]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !swipeState.isSwiping) {
      setSwipeState(prev => ({
        ...prev,
        isSwiping: false,
        direction: null,
      }));
      return;
    }
    
    const deltaX = swipeState.currentX - swipeState.startX;
    
    if (Math.abs(deltaX) >= threshold) {
      if (deltaX > 0 && onSwipeRight) {
        // Swiped right - go to previous
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        // Swiped left - go to next
        onSwipeLeft();
      }
    }
    
    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      isSwiping: false,
      direction: null,
    });
    startedFromEdge.current = false;
  }, [enabled, swipeState, threshold, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Calculate swipe progress for visual feedback
  const swipeProgress = swipeState.isSwiping 
    ? (swipeState.currentX - swipeState.startX) / threshold 
    : 0;

  return {
    containerRef,
    isSwiping: swipeState.isSwiping,
    swipeDirection: swipeState.direction,
    swipeProgress: Math.max(-1, Math.min(1, swipeProgress)),
  };
};
