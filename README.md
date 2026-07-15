# Ephemeral Wisdom

One product/design/lateral-thinking insight at a time....and its counterpoint. It's built as an exercise to make you think and challenge your thinking. 

**[Live demo](https://rumcguinness.github.io/ephemeral-wisdom/)**

## Why I built this

Most advice in product and creative work is stated as if it's universally true. It rarely is though...and most good advice has an equally good counter-argument depending on context. This app forces that tension: it shows you one piece of wisdom, and only reveals the counterpoint when you ask for it. The point isn't to pick a side....it's to notice you were about to agree with the first thing you read.

## How it works

- Static React app, no backend. All 585 insight/counterpoint pairs live in a single JSON file bundled at build time.
- A custom hook (`useWisdom`) picks a random insight, guarantees it's never the same one twice in a row, and syncs the current insight to the URL (`?id=<n>`) so any specific insight can be shared as a direct link.
- Deployed as a static site via GitHub Pages, built and published automatically on every push to `main`.

## Stack

React + TypeScript + Vite, Vitest + React Testing Library for tests, GitHub Actions for CI/deploy. No CSS framework — styling is plain CSS using a small set of custom properties carried over from the original version of this project.

## Running locally

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Deploying

This repo is set up to deploy to GitHub Pages automatically:

1. Push this repo to GitHub as `ephemeral-wisdom` (or update `base` in `vite.config.ts` to match whatever you name it).
2. In the repo settings, under **Pages**, set the source to **GitHub Actions**.
3. Push to `main` — the included workflow (`.github/workflows/static.yml`) builds and deploys automatically.
4. Your site will be live at `https://<your-username>.github.io/ephemeral-wisdom/`.

## Background

This started as a single static HTML page in 2025 — three separate near-duplicate HTML files sharing one JSON file, with the design tokens hardcoded inline. This version cleans up the original: deduplicated content, doubled the size of the insight library (325 → 585 unique entries), rebuilt as a tested React app, and set up for one-command deployment.
