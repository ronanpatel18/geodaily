#!/usr/bin/env node
/**
 * (Re)generates src/data/schedule.json, the fixed list of five location ids per date.
 *
 *   npm run schedule                        # regenerate from 2 days out through 1 year ahead
 *   npm run schedule -- --from 2026-11-13   # regenerate from a specific date
 *   npm run schedule -- --until 2027-12-31
 *
 * Days before --from are never touched, so dailies people have already played stay put.
 * The default starts 2 days out because some time zones are already a day ahead.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CANDIDATES } from '../src/data/candidates.js';
import { addDays, dateKey } from '../src/lib/format.js';
import { buildSchedule } from '../src/lib/schedule.js';

const file = (p) => fileURLToPath(new URL(p, import.meta.url));
const SCHEDULE = file('../src/data/schedule.json');
const LOCATIONS = file('../src/data/locations.json');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, a, i, all) => (a.startsWith('--') ? [...pairs, [a.slice(2), all[i + 1]]] : pairs), []),
);
const isKey = (k) => /^\d{4}-\d{2}-\d{2}$/.test(k ?? '');
const today = dateKey();
const from = args.from ?? addDays(today, 2);
const until = args.until ?? addDays(today, 365);
if (!isKey(from) || !isKey(until) || from > until) {
  console.error(`Bad dates: --from ${from} --until ${until} (use YYYY-MM-DD, from <= until)`);
  process.exit(1);
}

const resolved = JSON.parse(readFileSync(LOCATIONS, 'utf8'));
const pool = resolved.length ? resolved : CANDIDATES;
if (!resolved.length) {
  console.warn('! locations.json is empty: scheduling from unresolved candidates. Re-run after resolving.');
}

let existing = { days: {} };
try { existing = JSON.parse(readFileSync(SCHEDULE, 'utf8')); } catch { /* first run */ }

const schedule = buildSchedule({ pool, existing, from, until });
const lines = Object.entries(schedule.days).map(([k, ids]) => `    ${JSON.stringify(k)}: ${JSON.stringify(ids)}`);
writeFileSync(SCHEDULE, `{\n  "version": 1,\n  "days": {\n${lines.join(',\n')}\n  }\n}\n`);

const kept = Object.keys(schedule.days).filter((k) => k < from).length;
console.log(`schedule.json: kept ${kept} published days, generated ${from} → ${until} from ${pool.length} locations.`);
