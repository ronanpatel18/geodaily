import { describe, expect, it } from 'vitest';
import { NO_GUESS_KM, buildRound } from '../round';
import { MAX_SPEED_BONUS, ROUND_SECONDS } from '../scoring';

const location = { lat: 48.8566, lng: 2.3522 };
const base = { location, guess: location, cluesUsed: [], relaxed: false };

describe('buildRound', () => {
  it('gives the full speed bonus when the panorama has not loaded yet (clock not started)', () => {
    const r = buildRound({ ...base, roundStartedAt: null, now: 1e12 });
    expect(r.seconds).toBe(0);
    expect(r.score.speed).toBe(MAX_SPEED_BONUS);
  });

  it('measures time from when the panorama loaded and caps it at the round length', () => {
    const start = 1e12;
    expect(buildRound({ ...base, roundStartedAt: start, now: start + 30_000 }).seconds).toBe(30);
    const late = buildRound({ ...base, roundStartedAt: start, now: start + 999_000 });
    expect(late.seconds).toBe(ROUND_SECONDS);
    expect(late.score.speed).toBe(0);
  });

  it('has no speed bonus or cap in relaxed mode', () => {
    const r = buildRound({ ...base, relaxed: true, roundStartedAt: 0, now: 600_000 });
    expect(r.seconds).toBe(600);
    expect(r.score.speed).toBe(0);
  });

  it('scores a missing guess as zero', () => {
    const r = buildRound({ ...base, guess: null, roundStartedAt: 0, now: 1000 });
    expect(r.distanceKm).toBe(NO_GUESS_KM);
    expect(r.score.total).toBe(0);
  });
});
