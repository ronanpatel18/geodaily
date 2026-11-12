import { describe, expect, it } from 'vitest';
import schedule from '../../data/schedule.json';
import { getDailyLocations } from '../locations';

describe('getDailyLocations', () => {
  it('returns the scheduled five for a scheduled date', () => {
    const key = Object.keys(schedule.days)[0];
    expect(getDailyLocations(key).map((l) => l.id)).toEqual(schedule.days[key]);
  });

  it('falls back to a stable date-seeded pick for unscheduled dates', () => {
    const a = getDailyLocations('2020-01-01').map((l) => l.id);
    expect(a).toHaveLength(5);
    expect(new Set(a).size).toBe(5);
    expect(getDailyLocations('2020-01-01').map((l) => l.id)).toEqual(a);
  });
});
