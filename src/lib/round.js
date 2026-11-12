import { haversineKm } from './geo';
import { ROUND_SECONDS, gradeForDistance, scoreRound } from './scoring';

/** Distance recorded for a round with no pin (time ran out). */
export const NO_GUESS_KM = 20000;

export const initialGameState = () => ({
  roundIndex: 0,
  phase: 'guessing', // 'guessing' | 'result'
  guess: null,
  cluesUsed: [],
  rounds: [],
  roundStartedAt: null, // epoch ms; null until the panorama has loaded
});

/**
 * Score one round. Elapsed time is measured from when the panorama finished loading
 * (roundStartedAt), so slow image loads don't eat into the speed bonus.
 */
export function buildRound({ location, guess, cluesUsed, roundStartedAt, relaxed, now = Date.now() }) {
  const elapsed = roundStartedAt == null ? 0 : Math.max(0, (now - roundStartedAt) / 1000);
  const counted = relaxed ? elapsed : Math.min(elapsed, ROUND_SECONDS);
  const hasGuess = !!guess;
  const distanceKm = hasGuess ? haversineKm(guess, location) : NO_GUESS_KM;
  const score = scoreRound({
    distanceKm,
    secondsLeft: relaxed ? null : ROUND_SECONDS - counted,
    cluesUsed,
    hasGuess,
  });
  return {
    location, guess, hasGuess, distanceKm, score, cluesUsed,
    seconds: Math.round(counted),
    grade: gradeForDistance(distanceKm),
  };
}
