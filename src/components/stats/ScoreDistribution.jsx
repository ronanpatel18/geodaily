const LABELS = ['< 10k', '10–15k', '15–20k', '20–23k', '23k+'];

export default function ScoreDistribution({ buckets, highlightIndex, gameCount, highlightScore }) {
  const max = Math.max(1, ...buckets);
  return (
    <section className="card">
      <div className="row row--between">
        <h3>▥ Score distribution</h3>
        <span className="pill">Last {gameCount} games</span>
      </div>
      <div className="bars" role="img" aria-label="Score distribution bar chart">
        {buckets.map((count, i) => (
          <div className="bars__col" key={LABELS[i]}>
            <span className="small">{count}</span>
            <div className={`bars__bar ${i === highlightIndex ? 'is-highlighted' : ''}`} style={{ height: `${(count / max) * 100}%` }} />
            <span className="muted small">{LABELS[i]}</span>
          </div>
        ))}
      </div>
      {highlightScore != null && (
        <p className="muted small">Highlighted bar = latest score ({highlightScore.toLocaleString('en-US')})</p>
      )}
    </section>
  );
}
