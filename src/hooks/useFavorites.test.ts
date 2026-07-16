import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFavorites } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with no favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite(3)).toBe(false);
  });

  it('toggles an id into and out of favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(3);
    });
    expect(result.current.favorites).toContain(3);
    expect(result.current.isFavorite(3)).toBe(true);

    act(() => {
      result.current.toggleFavorite(3);
    });
    expect(result.current.favorites).not.toContain(3);
  });

  it('persists favorites to localStorage across hook instances', () => {
    const { result: first } = renderHook(() => useFavorites());
    act(() => {
      first.current.toggleFavorite(7);
    });

    const { result: second } = renderHook(() => useFavorites());
    expect(second.current.favorites).toContain(7);
  });
});
