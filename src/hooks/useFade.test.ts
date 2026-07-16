import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFade, FADE_DELAY_MS } from './useFade';

describe('useFade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts fully visible', () => {
    const { result } = renderHook(() => useFade({ enabled: true, resetKey: 'a' }));
    expect(result.current.faded).toBe(false);
  });

  it('fades after the delay elapses', () => {
    const { result } = renderHook(() => useFade({ enabled: true, resetKey: 'a' }));

    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS);
    });

    expect(result.current.faded).toBe(true);
  });

  it('does not fade when disabled', () => {
    const { result } = renderHook(() => useFade({ enabled: false, resetKey: 'a' }));

    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS);
    });

    expect(result.current.faded).toBe(false);
  });

  it('restores full opacity and restarts the timer on interaction', () => {
    const { result } = renderHook(() => useFade({ enabled: true, resetKey: 'a' }));

    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS);
    });
    expect(result.current.faded).toBe(true);

    act(() => {
      result.current.handlers.onMouseEnter();
    });
    expect(result.current.faded).toBe(false);

    // Should not fade again until a full new delay has passed.
    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS - 1);
    });
    expect(result.current.faded).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.faded).toBe(true);
  });

  it('resets to visible and restarts the timer when resetKey changes', () => {
    const { result, rerender } = renderHook(
      ({ resetKey }) => useFade({ enabled: true, resetKey }),
      { initialProps: { resetKey: 'a' } },
    );

    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS);
    });
    expect(result.current.faded).toBe(true);

    rerender({ resetKey: 'b' });
    expect(result.current.faded).toBe(false);

    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS);
    });
    expect(result.current.faded).toBe(true);
  });

  it('never fades when prefers-reduced-motion is set', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useFade({ enabled: true, resetKey: 'a' }));

    act(() => {
      vi.advanceTimersByTime(FADE_DELAY_MS);
    });
    expect(result.current.faded).toBe(false);

    matchMediaSpy.mockRestore();
  });
});
