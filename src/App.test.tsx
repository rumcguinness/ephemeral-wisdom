import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import wisdomData from './data/wisdom.json';

describe('App', () => {
  it('renders the brand and an insight on load', () => {
    render(<App />);
    expect(screen.getByText('EPHEMERAL_WISDOM')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${wisdomData.length} insights`, 'i')))
      .toBeInTheDocument();
    // The wisdom text node should be non-empty on first render.
    expect(document.getElementById('wisdom-text')?.textContent).not.toBe('');
  });

  it('reveals and hides the counterpoint when the toggle button is clicked', () => {
    render(<App />);
    expect(document.getElementById('counterpoint-text')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^counterpoint$/i }));

    const counterpointEl = document.getElementById('counterpoint-text');
    expect(counterpointEl).toBeInTheDocument();
    expect(counterpointEl?.textContent).not.toBe('');
    expect(
      screen.getByRole('button', { name: /hide counterpoint/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /hide counterpoint/i }));
    expect(document.getElementById('counterpoint-text')).not.toBeInTheDocument();
  });

  it('loads a new insight and hides the counterpoint when "New Insight" is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^counterpoint$/i }));
    expect(document.getElementById('counterpoint-text')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /new insight/i }));

    expect(document.getElementById('counterpoint-text')).not.toBeInTheDocument();
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
