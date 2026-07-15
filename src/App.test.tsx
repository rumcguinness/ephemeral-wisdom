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
});
