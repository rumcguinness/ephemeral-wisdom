import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSwipe } from './useSwipe';

function touch(x: number, y: number) {
  return { touches: [{ clientX: x, clientY: y }], changedTouches: [{ clientX: x, clientY: y }] };
}

describe('useSwipe', () => {
  it('calls onSwipe for a horizontal swipe past the threshold', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe(onSwipe));

    result.current.onTouchStart(touch(200, 100) as never);
    result.current.onTouchEnd(touch(100, 105) as never);

    expect(onSwipe).toHaveBeenCalledTimes(1);
  });

  it('ignores a swipe below the threshold', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe(onSwipe));

    result.current.onTouchStart(touch(200, 100) as never);
    result.current.onTouchEnd(touch(180, 100) as never);

    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('ignores a swipe that is more vertical than horizontal', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe(onSwipe));

    result.current.onTouchStart(touch(200, 100) as never);
    result.current.onTouchEnd(touch(160, 300) as never);

    expect(onSwipe).not.toHaveBeenCalled();
  });
});
