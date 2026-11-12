import { useMemo } from 'react';
import WorldMap from '../common/WorldMap';
import { mediumDate, timeUntilMidnight } from '../../lib/format';
import { MAX_GAME_POINTS } from '../../lib/scoring';
import { formatNumber } from '../../lib/format';

export default function DailyCard({ todayKey, dailyNo, completed, resumeRound, relaxed, onStart, onViewSummary }) {
  const countdown = useMemo(() => timeUntilMidnight(), []);
  return (
    <section className="card daily-card">
      <div className="row row--between">
        <span className="eyebrow">▣ Daily Challenge</span>
        <span className="pill">{mediumDate(todayKey)} · Daily #{dailyNo}</span>
      </div>
      <h2>Today's Daily Challenge</h2>
      <p className="muted">Five locations — the same set for every player today. Your score is based on distance + speed.</p>
      <div className="pill-row">
        <span className="pill">5 Locations • {relaxed ? 'Relaxed' : 'Timed'}</span>
        <span className="pill">Max {formatNumber(MAX_GAME_POINTS)} pts</span>
        <span className="pill">Date-seeded set</span>
      </div>
      <div className="map-preview">
        <WorldMap interactive={false} className="worldmap--preview" />
      </div>
      <div className="row">
        {completed ? (
          <button type="button" className="btn btn--primary" onClick={onViewSummary}>View Today's Results</button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={onStart}>
            {resumeRound ? `Resume Daily Challenge (${resumeRound}/5)` : 'Start Daily Challenge'}
          </button>
        )}
        <span className="muted small">Next challenge in {countdown}</span>
      </div>
    </section>
  );
}
