import { formatClock, formatNumber } from './format';
import { MAX_GAME_POINTS } from './scoring';

const EMOJI = { green: '🟩', yellow: '🟨', red: '🟥' };

export const gradesToEmoji = (grades) => grades.map((g) => EMOJI[g]).join('');

export function buildShareText({ dailyNo, score, grades, totalSeconds, cluesUsed, streak }) {
  const clue = cluesUsed === 1 ? 'clue' : 'clues';
  return [
    `GeoDaily #${dailyNo} — ${formatNumber(score)} / ${formatNumber(MAX_GAME_POINTS)}`,
    gradesToEmoji(grades),
    `⏱ ${formatClock(totalSeconds)} · 💡 ${cluesUsed} ${clue} · 🔥 ${streak}-day streak`,
    `geodaily.app/${dailyNo}`,
  ].join('\n');
}
