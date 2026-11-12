import { LOCATIONS } from '../data/locations';
import schedule from '../data/schedule.json';
import { shuffled } from './seed';
import { pickDay } from './schedule';
import { ROUNDS_PER_GAME } from './scoring';

const byId = new Map(LOCATIONS.map((l) => [l.id, l]));

/**
 * Same date => same five locations for everyone, read from the fixed schedule.
 * If a scheduled id is missing from the pool (dropped by the resolver) or the date
 * isn't scheduled, the gap is filled with a date-seeded pick so everyone still matches.
 */
export function getDailyLocations(key) {
  const picked = (schedule.days?.[key] ?? []).map((id) => byId.get(id)).filter(Boolean);
  if (picked.length < ROUNDS_PER_GAME) {
    const rest = LOCATIONS.filter((l) => !picked.includes(l));
    picked.push(...pickDay(rest, new Map(), key, ROUNDS_PER_GAME - picked.length).map((id) => byId.get(id)));
  }
  return picked.slice(0, ROUNDS_PER_GAME);
}

export function getPracticeLocations() {
  return shuffled(LOCATIONS, Math.random).slice(0, ROUNDS_PER_GAME);
}
