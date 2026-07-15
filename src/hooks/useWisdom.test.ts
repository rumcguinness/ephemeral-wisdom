import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useWisdom } from './useWisdom';
import wisdomData from '../data/wisdom.json';

describe('useWisdom', () => {
  it('exposes the full dataset length', () => {
    const { result } = renderHook(() => useWisdom());
    expect(result.current.total).toBe(wisdomData.length);
  });

  it('starts with an insight and no counterpoint shown', () => {
    const { result } = renderHook(() => useWisdom());
    expect(result.current.current).not.toBeNull();
    expect(result.current.showCounterpoint).toBe(false);
  });

  it('never repeats the same insight twice in a row across many calls', () => {
    const { result } = renderHook(() => useWisdom());
    let previousIndex = result.current.currentIndex;

    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.next();
      });
      expect(result.current.currentIndex).not.toBe(previousIndex);
      previousIndex = result.current.currentIndex;
    }
  });

  it('resets showCounterpoint when a new insight is loaded', () => {
    const { result } = renderHook(() => useWisdom());
    act(() => {
      result.current.revealCounterpoint();
    });
    expect(result.current.showCounterpoint).toBe(true);

    act(() => {
      result.current.next();
    });
    expect(result.current.showCounterpoint).toBe(false);
  });
});
