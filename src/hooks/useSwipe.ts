import { useRef } from 'react';
import type { TouchEvent } from 'react';

const SWIPE_THRESHOLD_PX = 50;

/**
 * Returns touch handlers that call `onSwipe` when a horizontal swipe (either
 * direction) exceeds the threshold. Swipes that are more vertical than
 * horizontal are ignored so normal page scrolling isn't hijacked.
 */
export function useSwipe(onSwipe: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    start.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: TouchEvent) => {
    const origin = start.current;
    start.current = null;
    if (!origin) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;

    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      onSwipe();
    }
  };

  return { onTouchStart, onTouchEnd };
}
