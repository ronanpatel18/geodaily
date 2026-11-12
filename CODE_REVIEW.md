# Code Review — GeoDaily v0.1 (PR #1)

Reviewed 2026-11-12 via `/code-review` (medium effort). Target: merged PR #1, 46 files
(`git diff HEAD~1`), since HEAD equalled `origin/main` with a clean tree. Read-only review:
nothing was run or tested.

## Likely bugs

### 1. Date recomputed at game end — `src/App.jsx:38`
`finish()` calls `dateKey()` again instead of using the date the session started with.
- **Scenario:** Start the daily at 11:58pm (locations seeded from day N), finish after midnight. The game is saved as day N+1 with dailyNo N+1. Day N is never recorded, the streak breaks, and the share number is wrong.
- **Fix:** Store the key in `session` at `start()` and reuse it.

### 2. Submit and timer auto-submit can both fire — `src/hooks/useGame.js:25`
The phase guard reads a closed-over value, so it is stale until re-render.
- **Scenario:** Click Submit in the same tick the 250ms interval hits zero. Both see `phase === 'guessing'`, two entries are appended to `rounds`, totals are double-counted, `lastRound` is wrong, and the game has six rounds.
- **Fix:** Guard with a ref (e.g. `submittedRef`).

### 3. `haversineKm` can return NaN — `src/lib/geo.js:10`
`asin(sqrt(h))` is not clamped.
- **Scenario:** A guess almost exactly antipodal gives `h` slightly above 1, so `asin` returns NaN. `scoreRound` gets `exp(NaN)`, the round score is NaN, and total score and stats break.
- **Fix:** `Math.min(1, Math.sqrt(h))`.

### 4. Daily can be replayed after quitting — `src/App.jsx:32`
`startDaily` only blocks when a finished game with rounds exists.
- **Scenario:** Quit a daily after seeing the locations. `onQuit` clears the session, so the same seeded locations can be replayed with known answers. Each completed run calls `addGame`, so Daily Rank and stats count multiple dailies for one date.

### 5. `start()` has no re-entry guard or timeout — `src/App.jsx:20`
- **Scenario:** With a Maps key set, clicking Play Daily or Practice twice while "loading" runs two `snapAll()` and two `setSession` calls; the later one wins. If the Maps script never fires `onload`/`onerror`, or `getPanorama` never settles, the loading screen has no exit and no Quit button.

### 6. Practice games use the daily share format — `src/lib/share.js:8`
- **Scenario:** `SummaryScreen` passes `dailyNo = 'Practice'`. Share text reads "GeoDaily #Practice — …", the link becomes `geodaily.app/Practice`, and it includes a daily streak line. The summary also shows "Daily Rank" / "Top x%" for practice games, mixing them into the rank.

### 7. Fabricated history seeded into real stats — `src/lib/stats.js:6`
- **Scenario:** A new user gets 7 fake daily games ending yesterday, saved to localStorage under the real key. Their first real daily shows "Streak extended → 8 days". Rank, average distance and best score are computed against made-up games until the user resets.
- **Also:** In `mockStats.js`, `games.slice(0, 43)` runs before the sort and drops ~13 of the 56 generated games, mostly practice games.

### 8. Panorama creation race and no disposal — `src/components/game/StreetViewPanel.jsx:13`
`PanoramaView` creates the panorama asynchronously from `initial.current`.
- **Scenario:** If `panoId` changes before `importLibrary` resolves, the swap effect skips because `panoRef.current` is null, and the panorama is built with the round-1 pano (wrong location).
- Cleanup only nulls the ref; it never releases the `StreetViewPanorama` or its listeners.
- Placeholder zoom/pan carry over between rounds because the same component instance is reused.

### 9. Markers lost when `interactive` changes — `src/components/common/WorldMap.jsx:103`
- **Scenario:** Toggling `interactive` on a mounted `WorldMap` runs cleanup (clears `markerObjs`, removes the map) and creates a new map, but the marker effect only depends on `[markers]`, so no markers appear until the prop changes. The line sync re-runs via `ready`.

## Minor

### 10. Inconsistent grade boundaries — `src/lib/scoring.js:37`
`km < 250` is green but `km <= 1000` is yellow, so exactly 250 km and exactly 1000 km are both yellow. The share legend ("under 250 / 250–1,000 / over 1,000") doesn't say where exactly 1000 falls.

## Suggested order
Start with #1 (date key), #2 (double submit) and #3 (NaN clamp): small fixes with real impact.
