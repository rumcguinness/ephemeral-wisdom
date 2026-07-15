import type { Wisdom } from '../types';

interface WisdomCardProps {
  current: Wisdom | null;
  showCounterpoint: boolean;
  onNext: () => void;
  onChallenge: () => void;
}

export function WisdomCard({
  current,
  showCounterpoint,
  onNext,
  onChallenge,
}: WisdomCardProps) {
  const ready = current !== null;

  return (
    <section className="card">
      <div className="wisdom" id="wisdom-text" aria-live="polite">
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
      </div>
    </section>
  );
}
