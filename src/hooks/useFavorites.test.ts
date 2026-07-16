import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFavorites, MAX_FAVORITES } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with no favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite(3)).toBe(false);
    expect(result.current.atCap).toBe(false);
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

  it('refuses to add past MAX_FAVORITES, but still allows removing', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      for (let i = 0; i < MAX_FAVORITES; i++) {
        result.current.toggleFavorite(i);
      }
    });
    expect(result.current.favorites).toHaveLength(MAX_FAVORITES);
    expect(result.current.atCap).toBe(true);

    act(() => {
      result.current.toggleFavorite(999); // one more, over the cap
    });
    expect(result.current.favorites).toHaveLength(MAX_FAVORITES);
    expect(result.current.isFavorite(999)).toBe(false);

    act(() => {
      result.current.toggleFavorite(0); // remove one
    });
    expect(result.current.favorites).toHaveLength(MAX_FAVORITES - 1);
    expect(result.current.atCap).toBe(false);

    act(() => {
      result.current.toggleFavorite(999); // now there's room
    });
    expect(result.current.isFavorite(999)).toBe(true);
  });
});
