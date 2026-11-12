import { describe, expect, it } from 'vitest';
import { CANDIDATES } from '../../data/candidates';
import { buildSchedule } from '../schedule';
import { addDays, dayDiff } from '../format';

const byId = new Map(CANDIDATES.map((l) => [l.id, l]));

describe('buildSchedule', () => {
  const s = buildSchedule({ pool: CANDIDATES, from: '2026-11-13', until: '2027-11-12' });
  const entries = Object.entries(s.days);

  it('gives every day five distinct locations from different countries', () => {
    expect(entries).toHaveLength(365);
    for (const [, ids] of entries) {
      expect(new Set(ids).size).toBe(5);
      expect(new Set(ids.map((id) => byId.get(id).country)).size).toBe(5);
    }
  });

  it('does not repeat a location within the first pass of the pool', () => {
    const last = new Map();
    let minGap = Infinity;
    for (const [key, ids] of entries) {
      ids.forEach((id) => {
        if (last.has(id)) minGap = Math.min(minGap, dayDiff(last.get(id), key));
        last.set(id, key);
      });
    }
    expect(minGap).toBeGreaterThanOrEqual(Math.floor(CANDIDATES.length / 5) - 1);
  });

  it('is deterministic', () => {
    expect(buildSchedule({ pool: CANDIDATES, from: '2026-11-13', until: '2027-11-12' })).toEqual(s);
  });

  it('never changes days before `from`, even when the pool grows', () => {
    const bigger = [...CANDIDATES, { id: 'xx-new', country: 'Nowhere', region: 'Nowhere', lat: 0, lng: 0 }];
    const from = addDays('2026-11-13', 30);
    const next = buildSchedule({ pool: bigger, existing: s, from, until: '2027-11-12' });
    for (const [key, ids] of entries) if (key < from) expect(next.days[key]).toEqual(ids);
    expect(Object.values(next.days).flat()).toContain('xx-new');
  });
});
