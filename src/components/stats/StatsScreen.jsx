import AppHeader from '../common/AppHeader';
import ScoreDistribution from './ScoreDistribution';
import SettingsCard from './SettingsCard';
import RecentGames from './RecentGames';
import { useApp } from '../../context/AppContext';
import { computeSummary } from '../../lib/stats';
import { formatDistance, mediumDate, parseKey } from '../../lib/format';

const bucketOf = (s) => (s < 10000 ? 0 : s < 15000 ? 1 : s < 20000 ? 2 : s < 23000 ? 3 : 4);
const monthDay = (key) => parseKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function StatsScreen({ onNavigate }) {
  const { stats, settings } = useApp();
  const s = computeSummary(stats.games);
  const latest = stats.games[stats.games.length - 1];
  const units = settings.units;
  const otherUnits = units === 'km' ? 'mi' : 'km';

  return (
    <div className="screen">
      <AppHeader variant="stats" onNavigate={onNavigate} />
      <main className="container">
        <div className="row row--between row--top">
          <div>
            <h1>Your Geography Stats</h1>
            <p className="muted">Saved locally in this browser · since {mediumDate(stats.since)}</p>
          </div>
          <span className="pill">Units: {units}</span>
        </div>

        <div className="stat-tiles">
          <div className="card stat-tile">
            <span className="muted small">Current / Max Streak</span>
            <strong className="stat-tile__value">{s.current} / {s.max} days</strong>
            <span className="muted small">{s.bestRun ? `Best run: ${monthDay(s.bestRun.start)} – ${monthDay(s.bestRun.end)}` : 'No streak yet'}</span>
          </div>
          <div className="card stat-tile">
            <span className="muted small">Games Played</span>
            <strong className="stat-tile__value">{s.gamesPlayed}</strong>
            <span className="muted small">{stats.games.filter((g) => g.mode === 'daily').length} daily · {stats.games.filter((g) => g.mode === 'practice').length} practice</span>
          </div>
          <div className="card stat-tile">
            <span className="muted small">Avg Distance Error</span>
            <strong className="stat-tile__value">{s.gamesPlayed ? formatDistance(s.avgDistanceKm, units) : '—'}</strong>
            <span className="muted small">{s.gamesPlayed ? `Lifetime · ≈ ${formatDistance(s.avgDistanceKm, otherUnits)}` : 'No games yet'}</span>
          </div>
          <div className="card stat-tile">
            <span className="muted small">All-Time High Score</span>
            <strong className="stat-tile__value">{s.best ? s.best.score.toLocaleString('en-US') : '—'}</strong>
            <span className="muted small">{s.best ? `${mediumDate(s.best.date)}${s.best.dailyNo ? ` · Daily #${s.best.dailyNo}` : ' · Practice'}` : 'Play a game to set one'}</span>
          </div>
        </div>

        <div className="stats-grid">
          <ScoreDistribution
            buckets={s.buckets}
            gameCount={s.gamesPlayed}
            highlightIndex={latest ? bucketOf(latest.score) : -1}
            highlightScore={latest?.score ?? null}
          />
          <SettingsCard />
        </div>

        <RecentGames games={stats.games} units={units} />
      </main>
    </div>
  );
}
