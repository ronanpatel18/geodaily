export const ROUNDS_PER_GAME = 5;
export const MAX_ROUND_POINTS = 5000;
export const MAX_DISTANCE_POINTS = 4000;
export const MAX_SPEED_BONUS = 1000;
export const ROUND_SECONDS = 120;
export const MAX_GAME_POINTS = ROUNDS_PER_GAME * MAX_ROUND_POINTS;

export const CLUES = [
  { id: 'region', label: 'Region', icon: '🌐', penalty: 200 },
  { id: 'language', label: 'Language / Script', icon: 'Aa', penalty: 300 },
  { id: 'flag', label: 'Country Flag', icon: '⚑', penalty: 500 },
];

export const cluePenalty = (usedIds) =>
  CLUES.filter((c) => usedIds.includes(c.id)).reduce((s, c) => s + c.penalty, 0);

export const roundPotential = (usedIds) => MAX_ROUND_POINTS - cluePenalty(usedIds);

/**
 * Distance score decays exponentially; speed bonus rewards accurate AND fast
 * answers. In relaxed mode (secondsLeft === null) there is no speed bonus.
 */
export function scoreRound({ distanceKm, secondsLeft, cluesUsed, hasGuess = true }) {
  if (!hasGuess) return { distance: 0, speed: 0, penalty: 0, total: 0 };
  const accuracy = Math.exp(-distanceKm / 1500);
  const distance = Math.round(MAX_DISTANCE_POINTS * accuracy);
  const speed =
    secondsLeft == null
      ? 0
      : Math.round(MAX_SPEED_BONUS * accuracy * (secondsLeft / ROUND_SECONDS));
  const penalty = cluePenalty(cluesUsed);
  const total = Math.max(0, Math.min(MAX_ROUND_POINTS, distance + speed - penalty));
  return { distance, speed, penalty, total };
}

/** Grade used for emoji squares and colour chips. */
export function gradeForDistance(km) {
  if (km < 250) return 'green';
  if (km <= 1000) return 'yellow';
  return 'red';
}
