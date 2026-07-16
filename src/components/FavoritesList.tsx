import wisdomData from '../data/wisdom.json';
import { MAX_FAVORITES } from '../hooks/useFavorites';
import type { Wisdom } from '../types';

const DATA = wisdomData as Wisdom[];

interface FavoritesListProps {
  favorites: number[];
  onSelect: (id: number) => void;
}

/**
 * A quiet list of insights the person has saved, persisted via useFavorites.
 * Renders nothing when there are no favorites yet, so it doesn't clutter the
 * page for anyone who isn't using the feature.
 */
export function FavoritesList({ favorites, onSelect }: FavoritesListProps) {
  if (favorites.length === 0) return null;

  return (
    <section className="card favorites-card">
      <h2>
        Saved insights ({favorites.length}/{MAX_FAVORITES})
      </h2>
      <ul className="favorites-list">
        {favorites.map((id) => {
          const entry = DATA[id];
          if (!entry) return null;
          return (
            <li key={id}>
              <button
                type="button"
                className="favorite-item"
                onClick={() => onSelect(id)}
              >
                {entry.wisdom}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
