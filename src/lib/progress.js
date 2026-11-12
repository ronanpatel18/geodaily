import { dateKey } from './format';

/**
 * The daily challenge in progress, saved after every change so a refresh or
 * "leave" resumes exactly where the player was instead of offering a replay.
 * Shape: { version, date, mode: 'daily', relaxed, locations, game }
 */
const KEY = 'geodaily.progress.v1';

export function loadProgress(today = dateKey()) {
  try {
    const p = JSON.parse(localStorage.getItem(KEY));
    if (p?.version === 1 && p.mode === 'daily' && p.date === today && Array.isArray(p.locations) && p.game) return p;
  } catch {
    /* unreadable: treat as no progress */
  }
  return null;
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, ...progress }));
  } catch {
    /* storage unavailable: progress lives only in memory */
  }
}

export function clearProgress() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
