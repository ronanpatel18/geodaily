# GeoDaily

A daily geography game inspired by GeoGuessr and Wordle. Every day, every player gets the same five locations. Look around in Google Street View, drop a pin on the world map, and see how close you got.

GeoDaily is for casual players who want a short, fun break that also teaches some geography.

> **Status:** Coming soon. The repo currently holds a static landing page (`index.html`) deployed on Vercel.

## How to play

1. Each daily challenge has **five rounds**, the same five for everyone.
2. In each round you're dropped somewhere in **Google Street View**. Look around for clues in the scenery, signs, and roads.
3. When you're ready, **drop a pin** on the world map to make your guess.
4. After all five rounds, see **how far off each guess was** on the map and share your results.

## Features

### Scoring
- Your score depends on **how close** your guess is and **how quickly** you made it.
- **Clues** such as the region, language, or flag are available, but each clue you use lowers your maximum possible score.

### Modes
- **Daily challenge**: the shared five-location puzzle that counts toward your streak.
- **Relaxed mode**: turns off the timer so you can take your time.
- **Practice mode**: play random rounds without affecting your streak.

### Results and sharing
- A results map shows each guess next to the real location, with the distance between them.
- Share a **spoiler-free emoji summary** of your game, Wordle-style.

### Stats
- Tracks **streaks**, **average distance**, and **best scores** over time.
- Everything is saved in the browser. No account needed.

## Tech stack

- **React**
- **Google Maps JavaScript API** for Street View and the interactive guessing map

## Project areas

The work is split into three parts:

| Area | Covers |
| --- | --- |
| Game logic and scoring | Daily location selection, rounds, distance and time scoring, game modes |
| Street View and clues | Street View panorama, guessing map, clue system and its score penalties |
| Stats and sharing | Results map, emoji share summary, browser-saved streaks and stats |


## Running locally (v0.1)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

v0.1 is a Vite + React app with in-memory mock data: locations come from `src/data/locations.js`,
and Street View and the maps are placeholders (the SVG `WorldMap` stands in for Google Maps).
Stats and settings persist in `localStorage` (seeded with mock history on first launch).

### Landing page

The original coming-soon page now lives at `public/landing.html` (served at `/landing.html`).
