import { formatClock, formatDistance, formatNumber } from '../../lib/format';

export default function BreakdownTable({ rounds, units, highlighted, onHighlight }) {
  const totalKm = rounds.reduce((s, r) => s + r.distanceKm, 0) / rounds.length;
  const totalSec = rounds.reduce((s, r) => s + r.seconds, 0);
  const total = rounds.reduce((s, r) => s + r.score.total, 0);
  return (
    <section className="card">
      <h3>Location breakdown</h3>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Country</th><th className="num">Distance</th><th className="num">Time</th><th className="num">Score</th></tr>
        </thead>
        <tbody>
          {rounds.map((r, i) => (
            <tr
              key={i}
              className={highlighted === i ? 'is-highlighted' : ''}
              onMouseEnter={() => onHighlight(i)}
              onMouseLeave={() => onHighlight(null)}
            >
              <td>{i + 1}</td>
              <td>{r.location.country}</td>
              <td className="num">{r.hasGuess ? formatDistance(r.distanceKm, units) : '—'}</td>
              <td className="num">{formatClock(r.seconds)}</td>
              <td className="num">{formatNumber(r.score.total)} <span className={`sq sq--${r.grade}`} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td>Total</td>
            <td className="num">{formatDistance(totalKm, units)} avg</td>
            <td className="num">{formatClock(totalSec)}</td>
            <td className="num">{formatNumber(total)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
