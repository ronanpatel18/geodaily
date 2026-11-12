import { useMemo } from 'react';
import WorldMap from '../common/WorldMap';
import { formatDistance, formatClock, formatNumber } from '../../lib/format';
import { CLUES } from '../../lib/scoring';

const signed = (n) => `${n < 0 ? '−' : '+'}${formatNumber(Math.abs(n))}`;

export default function RoundResultModal({ round, roundIndex, isLast, units, onNext }) {
  const { location, guess, hasGuess, distanceKm, score, seconds, cluesUsed } = round;
  const clueNames = CLUES.filter((c) => cluesUsed.includes(c.id)).map((c) => c.label.split(' ')[0]).join(', ');
  const markers = useMemo(() => {
    const list = [{ id: 'a', ...location, kind: 'actual', label: `Actual: ${location.place.split(',')[0]}` }];
    if (hasGuess) list.push({ id: 'g', ...guess, kind: 'guess', label: 'Your guess' });
    return list;
  }, [location, guess, hasGuess]);
  const lines = useMemo(() => (hasGuess ? [{ from: guess, to: location }] : []), [guess, location, hasGuess]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Round result">
      <div className="modal card">
        <div className="row row--between">
          <span className="pill">Round {roundIndex + 1} of 5 · Result</span>
          <span>📍</span>
        </div>
        <h2>{hasGuess ? `Your guess was ${formatDistance(distanceKm, units)} off!` : "Time's up — no guess placed"}</h2>
        <p className="muted">Actual location: {location.place}, {location.country}</p>
        <WorldMap
          className="worldmap--result"
          markers={markers}
          lines={lines}
          fit
        >
          {hasGuess && <span className="distance-chip">{formatDistance(distanceKm, units)}</span>}
        </WorldMap>
        <dl className="breakdown">
          <div><dt>Distance score</dt><dd>{signed(score.distance)}</dd></div>
          <div><dt>Speed bonus {seconds != null && score.speed > 0 ? `(answered in ${formatClock(seconds)})` : ''}</dt><dd>{signed(score.speed)}</dd></div>
          <div><dt>Clue penalties{clueNames ? ` (${clueNames})` : ''}</dt><dd>{signed(-score.penalty)}</dd></div>
          <div className="breakdown__total"><dt>Round score</dt><dd>{formatNumber(score.total)} pts</dd></div>
        </dl>
        <button type="button" className="btn btn--primary btn--block" onClick={onNext} autoFocus>
          {isLast ? 'See Daily Summary' : `Next Location (${roundIndex + 2}/5)`}
        </button>
        <p className="muted small">On round 5/5 this button reads “See Daily Summary”.</p>
      </div>
    </div>
  );
}
