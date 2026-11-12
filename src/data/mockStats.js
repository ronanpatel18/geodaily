import { addDays, dateKey } from '../lib/format';
import { mulberry32 } from '../lib/seed';

const GRADES = ['green', 'yellow', 'red'];

/**
 * Builds ~43 mock games relative to today so the Stats screen is populated
 * on first launch: a current 7-day streak (ending yesterday, so finishing
 * today's daily makes it 8) and an earlier 14-day best run.
 */
export function buildMockGames(today = dateKey()) {
  const rand = mulberry32(287);
  const games = [];
  const dailyDays = [];
  for (let i = 1; i <= 7; i++) dailyDays.push(i); //  current streak
  for (let i = 9; i <= 22; i++) dailyDays.push(i); // best run (14)
  for (const i of [25, 26, 28, 31, 33, 34, 37, 40, 41, 44, 47, 52, 55, 58, 60, 63]) dailyDays.push(i);

  const make = (offset, mode, n) => {
    const score = Math.round(8000 + rand() * 16000);
    const grades = Array.from({ length: 5 }, () =>
      GRADES[Math.min(2, Math.floor((1 - score / 25000) * 3 + rand() * 1.2))]);
    return {
      id: `mock-${mode}-${offset}`,
      date: addDays(today, -offset),
      mode,
      dailyNo: mode === 'daily' ? n : null,
      score,
      avgDistanceKm: Math.round(60 + (1 - score / 25000) * 1400 + rand() * 120),
      cluesUsed: Math.floor(rand() * 4),
      totalSeconds: Math.round(150 + rand() * 200),
      grades,
    };
  };

  dailyDays.forEach((off) => games.push(make(off, 'daily', 0)));
  [2, 4, 6, 8, 10, 12, 14, 16, 19, 24, 29, 35, 42, 50, 57, 62, 66, 70, 74].forEach((off) =>
    games.push(make(off, 'practice')),
  );
  return games.slice(0, 43).sort((a, b) => (a.date < b.date ? -1 : 1));
}
