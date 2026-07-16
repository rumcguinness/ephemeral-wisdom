import { useCallback, useEffect, useRef, useState } from 'react';
import wisdomData from '../data/wisdom.json';
import type { Wisdom } from '../types';

const DATA = wisdomData as Wisdom[];

function readIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('id');
  if (raw === null) return null;
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 0 || id >= DATA.length) return null;
  return id;
}

function writeIdToUrl(id: number) {
  const url = new URL(window.location.href);
  url.searchParams.set('id', String(id));
  window.history.replaceState({}, '', url);
}

/**
 * Picks a random insight, avoiding an immediate repeat of the last one shown.
 * Supports deep-linking a specific insight via ?id=<index> and keeps the URL
 * in sync so the current view is always shareable.
 */
export function useWisdom() {
  const initialId = useRef(readIdFromUrl());
  const [currentIndex, setCurrentIndex] = useState<number>(
    initialId.current ?? Math.floor(Math.random() * DATA.length),
  );
  const [showCounterpoint, setShowCounterpoint] = useState(false);
  const lastIndex = useRef<number | null>(null);

  useEffect(() => {
    writeIdToUrl(currentIndex);
    lastIndex.current = currentIndex;
  }, [currentIndex]);

  const next = useCallback(() => {
    if (DATA.length <= 1) {
      setCurrentIndex(0);
    } else {
      let candidate = Math.floor(Math.random() * DATA.length);
      while (candidate === lastIndex.current) {
        candidate = Math.floor(Math.random() * DATA.length);
      }
      setCurrentIndex(candidate);
    }
    setShowCounterpoint(false);
  }, []);

  const goTo = useCallback((id: number) => {
    if (!Number.isInteger(id) || id < 0 || id >= DATA.length) return;
    setCurrentIndex(id);
    setShowCounterpoint(false);
  }, []);

  const revealCounterpoint = useCallback(() => {
    setShowCounterpoint(true);
  }, []);

  const current: Wisdom | null = DATA[currentIndex] ?? null;

  return {
    current,
    currentIndex,
    total: DATA.length,
    showCounterpoint,
    next,
    goTo,
    revealCounterpoint,
  };
}
