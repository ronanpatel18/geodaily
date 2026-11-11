import { useCallback, useEffect, useRef, useState } from 'react';
import { haversineKm } from '../lib/geo';
import {
  CLUES, ROUND_SECONDS, ROUNDS_PER_GAME, gradeForDistance, roundPotential, scoreRound,
} from '../lib/scoring';

/**
 * Owns one play-through of five rounds.
 * phase: 'guessing' (a round is live) | 'result' (round result modal is open)
 */
export function useGame({ locations, relaxed }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState('guessing');
  const [guess, setGuess] = useState(null);
  const [cluesUsed, setCluesUsed] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const roundStart = useRef(Date.now());

  const location = locations[roundIndex];
  const isLastRound = roundIndex === ROUNDS_PER_GAME - 1;
  const totalSoFar = rounds.reduce((s, r) => s + r.score.total, 0);
  const potential = roundPotential(cluesUsed);

  const submit = useCallback(() => {
    if (phase !== 'guessing') return;
    const elapsed = (Date.now() - roundStart.current) / 1000;
    const left = relaxed ? null : Math.max(0, ROUND_SECONDS - elapsed);
    const hasGuess = !!guess;
    const distanceKm = hasGuess ? haversineKm(guess, location) : 20000;
    const score = scoreRound({ distanceKm, secondsLeft: left, cluesUsed, hasGuess });
    setRounds((r) => [
      ...r,
      {
        location, guess, hasGuess, distanceKm, score,
        seconds: relaxed ? Math.round(elapsed) : Math.round(Math.min(elapsed, ROUND_SECONDS)),
        cluesUsed, grade: gradeForDistance(distanceKm),
      },
    ]);
    setPhase('result');
  }, [phase, guess, location, relaxed, cluesUsed]);

  // Countdown (timed mode only). Auto-submits at zero.
  const submitRef = useRef(submit);
  submitRef.current = submit;
  useEffect(() => {
    if (relaxed || phase !== 'guessing') return undefined;
    const id = setInterval(() => {
      const left = Math.max(0, ROUND_SECONDS - (Date.now() - roundStart.current) / 1000);
      setSecondsLeft(left);
      if (left <= 0) submitRef.current();
    }, 250);
    return () => clearInterval(id);
  }, [relaxed, phase, roundIndex]);

  const revealClue = useCallback((id) => {
    if (!CLUES.some((c) => c.id === id)) return;
    setCluesUsed((used) => (used.includes(id) ? used : [...used, id]));
  }, []);

  const nextRound = useCallback(() => {
    if (isLastRound) return;
    setRoundIndex((i) => i + 1);
    setGuess(null);
    setCluesUsed([]);
    setSecondsLeft(ROUND_SECONDS);
    roundStart.current = Date.now();
    setPhase('guessing');
  }, [isLastRound]);

  return {
    roundIndex, location, phase, guess, setGuess, cluesUsed, revealClue, rounds,
    secondsLeft: relaxed ? null : secondsLeft, isLastRound, totalSoFar, potential,
    submit, nextRound, lastRound: rounds[rounds.length - 1],
  };
}
