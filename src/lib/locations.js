import { LOCATIONS } from '../data/locations';
import { hashString, mulberry32, shuffled } from './seed';
import { ROUNDS_PER_GAME } from './scoring';

/** Same date => same five locations for everyone. */
export function getDailyLocations(key) {
  return shuffled(LOCATIONS, mulberry32(hashString(`geodaily:${key}`))).slice(0, ROUNDS_PER_GAME);
}

export function getPracticeLocations() {
  return shuffled(LOCATIONS, Math.random).slice(0, ROUNDS_PER_GAME);
}
