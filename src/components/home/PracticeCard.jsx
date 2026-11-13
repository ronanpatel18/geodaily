import Icon from '../common/Icon';
export default function PracticeCard({ onPlay }) {
  return (
    <section className="card practice-card">

      <div className="radar" aria-hidden="true"><div className="radar-grid"/><div className="radar-ring radar-ring--one"/><div className="radar-ring radar-ring--two"/><div className="radar-ring radar-ring--three"/><div className="radar-axis radar-axis--x"/><div className="radar-axis radar-axis--y"/><div className="radar-sweep"/><span className="radar-blip radar-blip--a"/><span className="radar-blip radar-blip--b"/><span className="radar-blip radar-blip--c"/><span className="radar-center"><Icon name="compass" /></span><span className="radar-north">N</span><span className="radar-south">S</span></div>
      <div className="practice-copy"><h2>Practice</h2><p>Random locations.<br />Your streak stays safe.</p></div>
      <button type="button" className="btn btn--outline btn--block" onClick={onPlay}><span>Play practice</span><Icon name="arrow" /></button>
    </section>
  );
}
