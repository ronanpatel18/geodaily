export default function PracticeCard({ onPlay }) {
  return (
    <section className="card practice-card">
      <div className="practice-card__icon">◎</div>
      <h2>Practice Mode</h2>
      <p className="muted">Play random locations without affecting your daily streak.</p>
      <div className="pill-row">
        <span className="pill">Random rounds</span>
        <span className="pill">No streak impact</span>
      </div>
      <div className="spacer" />
      <button type="button" className="btn btn--outline btn--block" onClick={onPlay}>Play Practice Round</button>
    </section>
  );
}
