import { useEffect, useRef, useState } from 'react';

/** How long the linear fade-out takes, in seconds. */
export const FADE_DURATION_S = 10;
/** Opacity the insight settles at once faded (0–1). */
export const FADE_TARGET_OPACITY = 0.1;

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

/**
 * Drives the "ephemeral" fade: the insight starts at full opacity, then
 * (almost immediately) begins a continuous linear fade down to
 * FADE_TARGET_OPACITY over FADE_DURATION_S seconds, so it's still legible
 * by the time anyone reveals the counterpoint. Resets to full opacity
 * whenever `resetKey` changes (a new insight loaded). Disabled for
 * prefers-reduced-motion users, who stay at full opacity throughout.
 *
 * Returns inline-style-ready `opacity`/`transition` values — mirrors the
 * reference prototype's approach of snapping to opacity 1 with
 * transition: none, then on the next tick setting the target opacity with
 * a linear transition, so the fade always animates from a clean starting
 * point rather than interrupting a prior transition.
 */
export function useFade(resetKey: unknown) {
  const [opacity, setOpacity] = useState(1);
  const [transition, setTransition] = useState('none');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setOpacity(1);
    setTransition('none');

    if (prefersReducedMotion()) return;

    timerRef.current = setTimeout(() => {
      setOpacity(FADE_TARGET_OPACITY);
      setTransition(`opacity ${FADE_DURATION_S}s linear`);
    }, 60);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resetKey]);

  return { opacity, transition };
}
