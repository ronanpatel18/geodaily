import { useEffect, useState } from 'react';
import Icon from '../common/Icon';
import WorldMap from '../common/WorldMap';
import { mediumDate, timeUntilMidnight, formatNumber } from '../../lib/format';
import { MAX_GAME_POINTS } from '../../lib/scoring';

export default function DailyCard({ todayKey, dailyNo, completed, resumeRound, relaxed, onStart, onViewSummary }) {
  const [countdown, setCountdown] = useState(timeUntilMidnight);
  useEffect(() => { const timer = setInterval(() => setCountdown(timeUntilMidnight()), 1000); return () => clearInterval(timer); }, []);
  const label = completed ? 'View results' : resumeRound ? `Resume (${resumeRound}/5)` : 'Start challenge';
  return (
    <section className="card daily-card">
      <div className="daily-topline"><span className="eyebrow">{mediumDate(todayKey)}</span><span className="daily-edition"><strong>#{String(dailyNo).padStart(3,'0')}</strong></span></div>
      <div className="daily-main">
        <div className="daily-copy"><h2>Five places<br />to find.</h2><p>Look around. Drop a pin.</p><div className="round-slots" aria-label="Five locations to discover">{[1,2,3,4,5].map(n => <span key={n}><span className="round-slot-number">0{n}</span><span className="round-slot-question">?</span></span>)}</div></div>
        <div className="daily-globe"><div className="globe-orbit" aria-hidden="true"/><div className="map-preview"><WorldMap interactive={false} controls={false} className="worldmap--preview" /></div></div>
      </div>
      <div className="daily-mission-meta"><span><Icon name="pin" /><strong>5</strong> locations</span><span><Icon name="clock" />{relaxed ? 'Relaxed mode' : 'Timed challenge'}</span><span><Icon name="layers" /><strong>{formatNumber(MAX_GAME_POINTS)}</strong> max points</span></div>
      <div className="daily-bottom"><button type="button" className="btn btn--primary" onClick={completed ? onViewSummary : onStart}><span>{label}</span><Icon name="arrow" /></button><div className="daily-reset od-field"><span>RESETS IN</span><strong>{countdown}</strong></div></div>
    </section>
  );
}
