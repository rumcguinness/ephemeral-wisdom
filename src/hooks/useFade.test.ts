import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFade, FADE_DURATION_S, FADE_TARGET_OPACITY } from './useFade';

describe('useFade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts fully opaque with no transition', () => {
    const { result } = renderHook(() => useFade('a'));
    expect(result.current.opacity).toBe(1);
    expect(result.current.transition).toBe('none');
  });

  it('begins fading to the target opacity shortly after mount', () => {
    const { result } = renderHook(() => useFade('a'));

    act(() => {
      vi.advanceTimersByTime(60);
    });

    expect(result.current.opacity).toBe(FADE_TARGET_OPACITY);
    expect(result.current.transition).toBe(`opacity ${FADE_DURATION_S}s linear`);
  });

  it('resets to full opacity and restarts the fade when resetKey changes', () => {
    const { result, rerender } = renderHook(({ key }) => useFade(key), {
      initialProps: { key: 'a' },
    });

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(result.current.opacity).toBe(FADE_TARGET_OPACITY);

    rerender({ key: 'b' });
    expect(result.current.opacity).toBe(1);
    expect(result.current.transition).toBe('none');

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(result.current.opacity).toBe(FADE_TARGET_OPACITY);
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

    const { result } = renderHook(() => useFade('a'));

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.opacity).toBe(1);

    matchMediaSpy.mockRestore();
  });
});
