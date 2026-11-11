import { buildMockGames } from '../data/mockStats';
import { addDays, dailyNumber, dateKey } from './format';

const KEY = 'geodaily.stats.v1';

function seed() {
  const today = dateKey();
  const games = buildMockGames(today).map((g) =>
    g.mode === 'daily' ? { ...g, dailyNo: dailyNumber(g.date) } : g,
  );
  return { since: addDays(today, -73), games };
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  return seed();
}

export function saveStats(stats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    /* storage unavailable; stats live in memory for this session */
  }
}

export function resetStats() {
  return { since: dateKey(), games: [] };
}

/** Streaks are computed from the set of dates that have a completed daily. */
export function computeStreaks(games, today = dateKey()) {
  const days = [...new Set(games.filter((g) => g.mode === 'daily').map((g) => g.date))].sort();
  let max = 0, run = 0, maxEnd = null, prev = null;
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    if (run > max) { max = run; maxEnd = d; }
    prev = d;
  }
  // current streak: consecutive days ending today or yesterday
  let current = 0;
  let cursor = days.includes(today) ? today : addDays(today, -1);
  while (days.includes(cursor)) { current++; cursor = addDays(cursor, -1); }
  return { current, max, bestRun: max ? { start: addDays(maxEnd, -(max - 1)), end: maxEnd } : null };
}

export function computeSummary(games, today = dateKey()) {
  const n = games.length;
  const { current, max, bestRun } = computeStreaks(games, today);
  const avgDistanceKm = n ? games.reduce((s, g) => s + g.avgDistanceKm, 0) / n : 0;
  const best = games.reduce((b, g) => (!b || g.score > b.score ? g : b), null);
  const buckets = [0, 0, 0, 0, 0]; // <10k, 10-15k, 15-20k, 20-23k, 23k+
  for (const g of games) {
    const i = g.score < 10000 ? 0 : g.score < 15000 ? 1 : g.score < 20000 ? 2 : g.score < 23000 ? 3 : 4;
    buckets[i]++;
  }
  return { gamesPlayed: n, current, max, bestRun, avgDistanceKm, best, buckets };
}

export const findDaily = (games, key) => games.find((g) => g.mode === 'daily' && g.date === key);
