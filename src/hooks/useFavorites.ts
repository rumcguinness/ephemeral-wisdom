import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ephemeral-wisdom:favorites';
export const MAX_FAVORITES = 15;

function readFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => Number.isInteger(n)).slice(0, MAX_FAVORITES)
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: number[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded,
    // disabled by the user, etc.) — favoriting just silently won't persist.
  }
}

/**
 * Persists a set of favorited insight indices to localStorage so people can
 * star insights they like and come back to them later. Capped at
 * MAX_FAVORITES — once full, new favorites are refused until one is
 * removed, rather than silently evicting an older save.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => readFavorites());

  useEffect(() => {
    writeFavorites(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  );

  const atCap = favorites.length >= MAX_FAVORITES;

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((existing) => existing !== id);
      }
      if (prev.length >= MAX_FAVORITES) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, atCap };
}
