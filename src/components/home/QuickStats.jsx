import Icon from '../common/Icon';
import { formatDistance } from '../../lib/format';
export default function QuickStats({ summary, units, onViewStats }) {
  const items = [
    { icon: 'flame', value: `${summary.current}`, unit: summary.current === 1 ? 'day' : 'days', label: 'Current streak' },
    { icon: 'layers', value: summary.gamesPlayed, label: 'Games played' },
    { icon: 'pin', value: summary.gamesPlayed ? formatDistance(summary.avgDistanceKm, units) : '—', label: 'Average distance' },
  ];
  return <section className="card quick-stats"><div className="quick-stats__title od-field"><strong>Your stats</strong></div>{items.map(it => <div className="quick-stat" key={it.label}><span className="quick-stat__icon"><Icon name={it.icon}/></span><div className="od-stat"><span className="quick-stat__value">{it.value}<small>{it.unit}</small></span><span className="muted small">{it.label}</span></div></div>)}<button type="button" className="link-btn" onClick={onViewStats}><span>View stats</span><Icon name="arrow" /></button></section>;
}
