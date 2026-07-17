import { Header } from './components/Header';
import { IntroCard } from './components/IntroCard';
import { WisdomCard } from './components/WisdomCard';
import { FavoritesList } from './components/FavoritesList';
import { useWisdom } from './hooks/useWisdom';
import { useFavorites } from './hooks/useFavorites';
import './App.css';

function App() {
  const {
    current,
    currentIndex,
    total,
    showCounterpoint,
    next,
    goTo,
    toggleCounterpoint,
  } = useWisdom();
  const { favorites, isFavorite, toggleFavorite, atCap } = useFavorites();

  return (
    <>
      <main className="frame">
        <Header currentIndex={currentIndex} total={total} />
        <IntroCard />
        <WisdomCard
          current={current}
          currentIndex={currentIndex}
          showCounterpoint={showCounterpoint}
          isFavorite={isFavorite(currentIndex)}
          favoritesAtCap={atCap}
          favoritesCount={favorites.length}
          onNext={next}
          onChallenge={toggleCounterpoint}
          onToggleFavorite={toggleFavorite}
        />
        <footer className="footer">
          <p>
            {total} insights, one at a time.{' '}
            <a
              href="https://github.com/rumcguinness/ephemeral-wisdom"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </main>
      <FavoritesList favorites={favorites} onSelect={goTo} />
    </>
  );
}

export default App;
