import { beforeEach, describe, expect, it } from 'vitest';
import { migrateStats } from '../stats';
import { clearProgress, loadProgress, saveProgress } from '../progress';
import { initialGameState } from '../round';

beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
});

describe('migrateStats', () => {
  it('strips v0.1 mock games and recomputes `since`', () => {
    const out = migrateStats({
      since: '2026-08-01',
      games: [
        { id: 'mock-daily-3', date: '2026-08-02' },
        { id: 'daily-1', date: '2026-11-10' },
        { id: 'practice-2', date: '2026-11-11' },
      ],
    }, '2026-11-12');
    expect(out.games.map((g) => g.id)).toEqual(['daily-1', 'practice-2']);
    expect(out.since).toBe('2026-11-10');
  });

  it('starts empty for garbage input', () => {
    expect(migrateStats(null, '2026-11-12')).toEqual({ since: '2026-11-12', games: [] });
  });
});

describe('daily progress', () => {
  const p = { date: '2026-11-12', mode: 'daily', relaxed: false, locations: [{ id: 'a' }], game: initialGameState() };

  it('round-trips for the same day', () => {
    saveProgress(p);
    expect(loadProgress('2026-11-12')).toMatchObject(p);
  });

  it('ignores progress from another day', () => {
    saveProgress(p);
    expect(loadProgress('2026-11-13')).toBeNull();
  });

  it('clears', () => {
    saveProgress(p);
    clearProgress();
    expect(loadProgress('2026-11-12')).toBeNull();
  });
});
