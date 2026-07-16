import { useFade } from '../hooks/useFade';
import { useSwipe } from '../hooks/useSwipe';
import type { Wisdom } from '../types';

interface WisdomCardProps {
  current: Wisdom | null;
  currentIndex: number;
  showCounterpoint: boolean;
  isFavorite: boolean;
  onNext: () => void;
  onChallenge: () => void;
  onToggleFavorite: (id: number) => void;
}

export function WisdomCard({
  current,
  currentIndex,
  showCounterpoint,
  isFavorite,
  onNext,
  onChallenge,
  onToggleFavorite,
}: WisdomCardProps) {
  const ready = current !== null;

  // The insight fades toward (but not all the way to) transparent after a
  // period of inactivity — restored instantly on hover/focus/touch. Fading
  // is paused once the counterpoint is revealed, since at that point you're
  // meant to be comparing the two, not racing a timer.
  const { faded, handlers: fadeHandlers } = useFade({
    enabled: !showCounterpoint,
    resetKey: current?.wisdom ?? currentIndex,
  });

  const swipeHandlers = useSwipe(() => {
    if (ready) onNext();
  });

  return (
    <section className="card" {...swipeHandlers}>
      <div
        className={`wisdom${faded ? ' faded' : ''}`}
        id="wisdom-text"
        aria-live="polite"
        tabIndex={0}
        {...fadeHandlers}
      >
        {current ? (
          current.wisdom
        ) : (
          <span className="error-message" role="alert">
            No insights loaded. Try refreshing the page.
          </span>
        )}
      </div>

      <div
        className={`counterpoint${showCounterpoint ? ' visible' : ''}`}
        id="counterpoint-text"
        aria-live="polite"
      >
        {current?.counterpoint}
      </div>

      <div className="button-container">
        <button onClick={onNext} disabled={!ready}>
          New insight
        </button>
        <button
          onClick={onChallenge}
          disabled={!ready || showCounterpoint}
        >
          Counterpoint
        </button>
        <button
          onClick={() => onToggleFavorite(currentIndex)}
          disabled={!ready}
          aria-pressed={isFavorite}
          className="favorite-toggle"
        >
          {isFavorite ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </section>
  );
}
