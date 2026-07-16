import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import wisdomData from './data/wisdom.json';

describe('App', () => {
  it('renders the header and an insight on load', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /ephemeral wisdom/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${wisdomData.length} insights`, 'i')))
      .toBeInTheDocument();
    // The wisdom text node should be non-empty on first render.
    expect(document.getElementById('wisdom-text')?.textContent).not.toBe('');
  });

  it('reveals the counterpoint when the Counterpoint button is clicked', () => {
    render(<App />);
    const counterpointEl = document.getElementById('counterpoint-text');
    expect(counterpointEl?.className).not.toMatch(/visible/);

    fireEvent.click(screen.getByRole('button', { name: /counterpoint/i }));

    expect(counterpointEl?.className).toMatch(/visible/);
    expect(counterpointEl?.textContent).not.toBe('');
  });

  it('loads a new insight and hides the counterpoint when "New insight" is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /counterpoint/i }));
    const counterpointEl = document.getElementById('counterpoint-text');
    expect(counterpointEl?.className).toMatch(/visible/);

    fireEvent.click(screen.getByRole('button', { name: /new insight/i }));

    expect(counterpointEl?.className).not.toMatch(/visible/);
  });

  it('links to the actual repo, not the GitHub homepage', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /view on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/rumcguinness/ephemeral-wisdom',
    );
  });

  it('saves the current insight and lists it under Saved insights', () => {
    window.localStorage.clear();
    render(<App />);

    const wisdomText = document.getElementById('wisdom-text')?.textContent;
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(
      screen.getByRole('heading', { name: /saved insights \(1\/15\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: wisdomText ?? '' }),
    ).toBeInTheDocument();
  });
});
