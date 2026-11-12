import { formatDistance } from '../../lib/format';

export default function QuickStats({ summary, units, onViewStats }) {
  const items = [
    { icon: '🔥', value: `${summary.current} ${summary.current === 1 ? 'day' : 'days'}`, label: 'Current Streak' },
    { icon: '▣', value: summary.gamesPlayed, label: 'Games Played' },
    { icon: '⌖', value: summary.gamesPlayed ? formatDistance(summary.avgDistanceKm, units) : '—', label: 'Avg Distance' },
  ];
  return (
    <section className="card quick-stats">
      <strong className="quick-stats__title">Quick stats</strong>
      {items.map((it) => (
        <div className="quick-stat" key={it.label}>
          <span className="quick-stat__icon">{it.icon}</span>
          <div>
            <div className="quick-stat__value">{it.value}</div>
            <div className="muted small">{it.label}</div>
          </div>
        </div>
      ))}
      <button type="button" className="link-btn" onClick={onViewStats}>View full stats →</button>
    </section>
  );
}
