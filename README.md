# GeoDaily

A daily geography game inspired by GeoGuessr and Wordle. Every day, every player gets the same five locations. Look around in Google Street View, drop a pin on the world map, and see how close you got.

GeoDaily is for casual players who want a short, fun break that also teaches some geography.

> **Status:** Live on Vercel; Phase 1 (real locations, locked dailies) in progress.

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


## Running locally

```bash
npm install
cp .env.example .env.local   # then paste your Google Maps key into it
npm run dev                  # http://localhost:5173
npm test                     # unit tests (Vitest)
npm run build                # production build into dist/
```

Without `VITE_GOOGLE_MAPS_API_KEY` the game still runs, with a placeholder instead of Street View.
On Vercel, set the same variable under Project Settings → Environment Variables (Production and
Preview) and redeploy: Vite bakes it into the bundle at build time.

## Locations and the daily schedule

| File | What it is |
| --- | --- |
| `src/data/candidates.js` | Source list of candidate places with country, region, language and flag. Ids are permanent. |
| `src/data/locations.json` | Generated. Each candidate pinned to one Google panorama (`panoId`); candidates without coverage dropped. |
| `src/data/schedule.json` | Generated. The five location ids for each date. Days already published never change. |

To add or refresh locations:

1. Append rows to `src/data/candidates.js`.
2. With the key in `.env.local`, run `npm run dev` and open
   http://localhost:5173/tools/resolve-locations.html, then click **Resolve and save**.
   Locations already in `locations.json` keep their panorama.
3. Run `npm run schedule` to regenerate days from two days out through one year ahead.
4. Commit all three files.

Until `locations.json` has been generated, the game falls back to the raw candidates and snaps
them to the nearest panorama at game start.

## Saved data (browser only)

- `geodaily.stats.v1`: finished games, used for streaks and stats.
- `geodaily.settings.v1`: relaxed mode and units.
- `geodaily.progress.v1`: today's daily in progress. Reloading or leaving resumes it, and the round
  timer keeps running in real time, so a daily can't be restarted or paused.

### Landing page

The original coming-soon page now lives at `public/landing.html` (served at `/landing.html`).
