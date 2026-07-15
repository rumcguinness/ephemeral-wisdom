import { Header } from './components/Header';
import { IntroCard } from './components/IntroCard';
import { WisdomCard } from './components/WisdomCard';
import { useWisdom } from './hooks/useWisdom';
import './App.css';

function App() {
  const { current, total, showCounterpoint, next, revealCounterpoint } =
    useWisdom();

  return (
    <>
      <Header />
      <IntroCard />
      <WisdomCard
        current={current}
        showCounterpoint={showCounterpoint}
        onNext={next}
        onChallenge={revealCounterpoint}
      />
      <footer className="footer">
        <p>
          {total} insights, one at a time.{' '}
          <a
            href="https://github.com/"
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
