import { useCallback, useEffect, useRef, useState } from 'react';

export const FADE_DELAY_MS = 10_000;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

interface UseFadeOptions {
  /** Whether the fade behaviour is active at all right now. */
  enabled: boolean;
  /** Changing this value resets the fade timer (e.g. a new insight loaded). */
  resetKey: unknown;
  delayMs?: number;
}

/**
 * Fades content out (to near-transparent, not fully invisible) after a period
 * of inactivity — the "ephemeral" part of Ephemeral Wisdom. Any interaction
 * (hover, focus, touch) immediately restores full opacity and restarts the
 * countdown. Disabled automatically for prefers-reduced-motion users.
 */
export function useFade({ enabled, resetKey, delayMs = FADE_DELAY_MS }: UseFadeOptions) {
  const [faded, setFaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!enabled || prefersReducedMotion()) return;
    timerRef.current = setTimeout(() => setFaded(true), delayMs);
  }, [clearTimer, enabled, delayMs]);

  useEffect(() => {
    setFaded(false);
    startTimer();
    return clearTimer;
    // resetKey and enabled intentionally drive this effect; startTimer/clearTimer
    // are stable across the values that matter here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, enabled]);

  const wake = useCallback(() => {
    setFaded(false);
    startTimer();
  }, [startTimer]);

  return {
    faded: enabled && faded,
    handlers: {
      onMouseEnter: wake,
      onFocus: wake,
      onTouchStart: wake,
    },
  };
}
