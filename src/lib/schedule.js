// Shared by the app and scripts/schedule.mjs, so imports carry explicit extensions.
import { addDays, dayDiff } from './format.js';
import { hashString, mulberry32 } from './seed.js';

export const PER_DAY = 5;
const MAX_PER_REGION = 2;

/**
 * Pick one day's set: least-recently-used locations first (never-used before anything),
 * at most one per country and two per region, ties broken by a date-seeded shuffle.
 * `lastUsed` maps id -> date key it last appeared.
 */
export function pickDay(pool, lastUsed, key, perDay = PER_DAY) {
  const rand = mulberry32(hashString(`geodaily-schedule:${key}`));
  const ranked = pool
    .map((l) => ({ l, age: lastUsed.has(l.id) ? dayDiff(lastUsed.get(l.id), key) : Infinity, tie: rand() }))
    .sort((a, b) => b.age - a.age || a.tie - b.tie)
    .map((x) => x.l);

  const picked = [];
  const countries = new Set();
  const regions = new Map();
  const tryAdd = (l, strict) => {
    if (picked.length >= perDay || picked.includes(l)) return;
    if (strict && (countries.has(l.country) || (regions.get(l.region) ?? 0) >= MAX_PER_REGION)) return;
    picked.push(l);
    countries.add(l.country);
    regions.set(l.region, (regions.get(l.region) ?? 0) + 1);
  };
  ranked.forEach((l) => tryAdd(l, true));
  ranked.forEach((l) => tryAdd(l, false)); // only matters for tiny pools
  return picked.map((l) => l.id);
}

/**
 * Returns a new schedule ({ version, days: { [dateKey]: id[] } }) where every day before
 * `from` is kept exactly as published and days from `from` through `until` are (re)generated
 * from the current pool. Past days therefore never change when locations are added.
 */
export function buildSchedule({ pool, existing = { days: {} }, from, until }) {
  const days = {};
  const lastUsed = new Map();
  for (const key of Object.keys(existing.days ?? {}).sort()) {
    if (key >= from) continue;
    days[key] = existing.days[key];
    days[key].forEach((id) => lastUsed.set(id, key));
  }
  for (let key = from; key <= until; key = addDays(key, 1)) {
    days[key] = pickDay(pool, lastUsed, key);
    days[key].forEach((id) => lastUsed.set(id, key));
  }
  return { version: 1, days };
}
