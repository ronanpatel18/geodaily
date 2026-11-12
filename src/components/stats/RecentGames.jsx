import { useState } from 'react';
import { formatDistance, formatNumber, weekdayDate } from '../../lib/format';

export default function RecentGames({ games, units }) {
  const [all, setAll] = useState(false);
  const rows = [...games].reverse().slice(0, all ? 50 : 5);
  return (
    <section className="card">
      <div className="row row--between">
        <h3>Recent games</h3>
        {games.length > 5 && (
          <button type="button" className="link-btn" onClick={() => setAll((a) => !a)}>{all ? 'Show less' : 'View all'}</button>
        )}
      </div>
      {rows.length === 0 ? (
        <p className="muted">No games yet — play a round to see it here.</p>
      ) : (
        <div className="table-scroll">
          <table className="table table--recent">
            <thead>
              <tr><th>Date</th><th>Mode</th><th>Final score</th><th>Avg distance</th><th>Clues used</th><th>Result</th></tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.id}>
                  <td>{weekdayDate(g.date)}</td>
                  <td>{g.mode === 'daily' ? `Daily #${g.dailyNo}` : 'Practice'}</td>
                  <td><strong>{formatNumber(g.score)}</strong></td>
                  <td>{formatDistance(g.avgDistanceKm, units)}</td>
                  <td>{g.cluesUsed}</td>
                  <td><span className="grade-strip">{g.grades.map((gr, i) => <span key={i} className={`sq sq--${gr}`} />)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
