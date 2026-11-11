import { useState } from 'react';
import AppHeader from '../common/AppHeader';
import ResultsMap from './ResultsMap';
import BreakdownTable from './BreakdownTable';
import SharePanel from './SharePanel';
import { useApp } from '../../context/AppContext';
import { computeStreaks } from '../../lib/stats';
import { cluePenalty, MAX_GAME_POINTS } from '../../lib/scoring';
import { formatClock, formatDuration, formatNumber, mediumDate } from '../../lib/format';
import { buildShareText } from '../../lib/share';

export default function SummaryScreen({ result, onNavigate, onPractice }) {
  const { stats, settings } = useApp();
  const [highlighted, setHighlighted] = useState(null);
  const { rounds, mode, dateKey: key, dailyNo } = result;
  const isDaily = mode === 'daily';

  const score = rounds.reduce((s, r) => s + r.score.total, 0);
  const totalSeconds = rounds.reduce((s, r) => s + r.seconds, 0);
  const cluesUsed = rounds.reduce((s, r) => s + r.cluesUsed.length, 0);
  const penalty = rounds.reduce((s, r) => s + cluePenalty(r.cluesUsed), 0);
  const streak = computeStreaks(stats.games).current;
  const better = stats.games.filter((g) => g.score > score).length;
  const topPct = Math.max(1, Math.round(((better + 1) / Math.max(1, stats.games.length)) * 100));
  const grades = rounds.map((r) => r.grade);

  return (
    <div className="screen">
      <AppHeader variant="summary" onNavigate={onNavigate} />
      <main className="container">
        <div className="row row--between row--top">
          <div>
            <h1>{isDaily ? `Daily Completed! – ${mediumDate(key)}` : 'Practice Round Complete!'}</h1>
            <p className="muted">
              {isDaily ? `Daily #${dailyNo}` : 'Practice'} · {settings.relaxed ? 'Relaxed' : 'Timed'} mode · {rounds.length} of 5 locations
            </p>
          </div>
          {isDaily && <span className="pill">Streak extended → {streak} days</span>}
        </div>

        <div className="stat-tiles">
          <div className="card stat-tile stat-tile--score">
            <span className="eyebrow">Final score</span>
            <div><span className="stat-tile__big">{formatNumber(score)}</span> <span className="muted">/ {formatNumber(MAX_GAME_POINTS)} pts</span></div>
            <div className="progress"><div className="progress__bar" style={{ width: `${(score / MAX_GAME_POINTS) * 100}%` }} /></div>
          </div>
          <div className="card stat-tile">
            <span className="muted small">Total Time</span>
            <strong className="stat-tile__value">{formatDuration(totalSeconds)}</strong>
            <span className="muted small">Avg {formatClock(totalSeconds / rounds.length)} per location</span>
          </div>
          <div className="card stat-tile">
            <span className="muted small">Clues Used</span>
            <strong className="stat-tile__value">{cluesUsed}</strong>
            <span className="muted small">−{formatNumber(penalty)} pts total</span>
          </div>
          <div className="card stat-tile">
            <span className="muted small">Daily Rank</span>
            <strong className="stat-tile__value">Top {topPct}%</strong>
            <span className="muted small">Local estimate</span>
          </div>
        </div>

        <div className="summary-grid">
          <ResultsMap rounds={rounds} highlighted={highlighted} onHighlight={setHighlighted} />
          <BreakdownTable rounds={rounds} units={settings.units} highlighted={highlighted} onHighlight={setHighlighted} />
        </div>

        <SharePanel
          text={buildShareText({ dailyNo: isDaily ? dailyNo : 'Practice', score, grades, totalSeconds, cluesUsed, streak })}
        />

        <div className="row row--center">
          <button type="button" className="btn btn--outline" onClick={onPractice}>Play Practice Mode</button>
          <button type="button" className="link-btn" onClick={() => onNavigate('stats')}>View Full Stats</button>
        </div>
      </main>
    </div>
  );
}
