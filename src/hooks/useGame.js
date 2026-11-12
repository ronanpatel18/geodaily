import { useCallback, useEffect, useRef, useState } from 'react';
import { CLUES, ROUND_SECONDS, roundPotential } from '../lib/scoring';
import { buildRound, initialGameState } from '../lib/round';

/** If the panorama never reports ready (slow network, API hiccup), start the clock anyway. */
export const READY_FALLBACK_MS = 10000;

/**
 * Owns one play-through of five rounds.
 *   initial:    saved state to resume from (daily progress), or undefined for a fresh game
 *   onProgress: called with the full state after every change (used to persist the daily)
 * The round clock is wall-clock based (roundStartedAt), so it keeps running across
 * refreshes and "leave" — a timed daily can't be paused to look things up.
 */
export function useGame({ locations, relaxed, initial, onProgress }) {
  const [state, setState] = useState(() => initial ?? initialGameState());
  const [now, setNow] = useState(() => Date.now());
  const { roundIndex, phase, guess, cluesUsed, rounds, roundStartedAt } = state;

  const location = locations[roundIndex];
  const isLastRound = roundIndex === locations.length - 1;
  const totalSoFar = rounds.reduce((s, r) => s + r.score.total, 0);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  useEffect(() => { onProgressRef.current?.(state); }, [state]);

  const submit = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'guessing') return s;
      const round = buildRound({
        location: locations[s.roundIndex],
        guess: s.guess,
        cluesUsed: s.cluesUsed,
        roundStartedAt: s.roundStartedAt,
        relaxed,
      });
      return { ...s, phase: 'result', rounds: [...s.rounds, round] };
    });
  }, [locations, relaxed]);

  /** Called by the Street View panel once the panorama is showing. Starts the round clock. */
  const markReady = useCallback(() => {
    setState((s) => (s.phase === 'guessing' && s.roundStartedAt == null ? { ...s, roundStartedAt: Date.now() } : s));
  }, []);

  useEffect(() => {
    if (phase !== 'guessing' || roundStartedAt != null) return undefined;
    const id = setTimeout(markReady, READY_FALLBACK_MS);
    return () => clearTimeout(id);
  }, [phase, roundStartedAt, roundIndex, markReady]);

  // Countdown (timed mode only). Auto-submits at zero, including straight away when
  // resuming a round whose time already ran out.
  useEffect(() => {
    if (relaxed || phase !== 'guessing' || roundStartedAt == null) return undefined;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t - roundStartedAt >= ROUND_SECONDS * 1000) submit();
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [relaxed, phase, roundStartedAt, submit]);

  const setGuess = useCallback((g) => {
    setState((s) => (s.phase === 'guessing' ? { ...s, guess: g } : s));
  }, []);

  const revealClue = useCallback((id) => {
    if (!CLUES.some((c) => c.id === id)) return;
    setState((s) => (s.phase !== 'guessing' || s.cluesUsed.includes(id) ? s : { ...s, cluesUsed: [...s.cluesUsed, id] }));
  }, []);

  const nextRound = useCallback(() => {
    setState((s) => (s.roundIndex >= locations.length - 1 ? s : {
      ...s, roundIndex: s.roundIndex + 1, phase: 'guessing', guess: null, cluesUsed: [], roundStartedAt: null,
    }));
  }, [locations.length]);

  let secondsLeft = null;
  if (!relaxed) {
    secondsLeft = roundStartedAt == null ? ROUND_SECONDS : Math.max(0, ROUND_SECONDS - (now - roundStartedAt) / 1000);
  }

  return {
    roundIndex, location, phase, guess, setGuess, cluesUsed, revealClue, rounds,
    secondsLeft, waiting: roundStartedAt == null, isLastRound, totalSoFar,
    potential: roundPotential(cluesUsed), submit, nextRound, markReady,
    lastRound: rounds[rounds.length - 1],
  };
}
