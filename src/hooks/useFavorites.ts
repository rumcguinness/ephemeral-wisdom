import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ephemeral-wisdom:favorites';

function readFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => Number.isInteger(n))
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
 * star insights they like and come back to them later.
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

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((existing) => existing !== id)
        : [...prev, id],
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
