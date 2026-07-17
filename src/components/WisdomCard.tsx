import { useFade } from '../hooks/useFade';
import { useSwipe } from '../hooks/useSwipe';
import { MAX_FAVORITES } from '../hooks/useFavorites';
import type { Wisdom } from '../types';

interface WisdomCardProps {
  current: Wisdom | null;
  currentIndex: number;
  showCounterpoint: boolean;
  isFavorite: boolean;
  favoritesAtCap: boolean;
  favoritesCount: number;
  onNext: () => void;
  onChallenge: () => void;
  onToggleFavorite: (id: number) => void;
}

export function WisdomCard({
  current,
  currentIndex,
  showCounterpoint,
  isFavorite,
  favoritesAtCap,
  favoritesCount,
  onNext,
  onChallenge,
  onToggleFavorite,
}: WisdomCardProps) {
  const ready = current !== null;
  const saveDisabled = !ready || (favoritesAtCap && !isFavorite);

  // The insight fades toward (but not all the way to) transparent — the
  // "ephemeral" part of Ephemeral Wisdom. It keeps fading on its own
  // schedule regardless of whether the counterpoint is open, so by the time
  // you reveal it the counterpoint reads as the more prominent of the two.
  const { opacity, transition } = useFade(current?.wisdom ?? currentIndex);

  const swipeHandlers = useSwipe(() => {
    if (ready) onNext();
  });

  return (
    <>
      <div className="insight-stage" {...swipeHandlers}>
        <div className="insight-label">
          &gt; insight<span className="cursor">_</span>
        </div>
        <div
          className="wisdom"
          id="wisdom-text"
          aria-live="polite"
          style={{ opacity, transition }}
        >
          {current ? (
            current.wisdom
          ) : (
            <span className="error-message" role="alert">
              No insights loaded. Try refreshing the page.
            </span>
          )}
        </div>
      </div>

      {showCounterpoint && (
        <div className="counterpoint-panel">
          <div className="counterpoint-label">// counterpoint</div>
          <div className="counterpoint-text" id="counterpoint-text" aria-live="polite">
            {current?.counterpoint}
          </div>
        </div>
      )}

      <div className="button-row">
        <button className="btn-primary" onClick={onNext} disabled={!ready}>
          New Insight
        </button>
        <button className="btn-ghost" onClick={onChallenge} disabled={!ready}>
          {showCounterpoint ? 'Hide Counterpoint' : 'Counterpoint'}
        </button>
        <button
          className="btn-ghost"
          onClick={() => onToggleFavorite(currentIndex)}
          disabled={saveDisabled}
          aria-pressed={isFavorite}
          title={
            saveDisabled
              ? `Saved insights are capped at ${MAX_FAVORITES} — remove one to save another.`
              : undefined
          }
        >
          {isFavorite ? '★ Saved' : '☆ Save'}
        </button>
        <div className="saved-count">
          saved {favoritesCount}/{MAX_FAVORITES}
        </div>
      </div>
    </>
  );
}
