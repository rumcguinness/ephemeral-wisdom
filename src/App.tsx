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
    revealCounterpoint,
  } = useWisdom();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    <>
      <Header />
      <IntroCard />
      <WisdomCard
        current={current}
        currentIndex={currentIndex}
        showCounterpoint={showCounterpoint}
        isFavorite={isFavorite(currentIndex)}
        onNext={next}
        onChallenge={revealCounterpoint}
        onToggleFavorite={toggleFavorite}
      />
      <FavoritesList favorites={favorites} onSelect={goTo} />
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
    </>
  );
}

export default App;
