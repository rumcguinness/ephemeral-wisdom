import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia. Default to "no preference" so
// components that check prefers-reduced-motion (e.g. useFade) behave
// predictably in tests unless a test explicitly overrides this mock.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
