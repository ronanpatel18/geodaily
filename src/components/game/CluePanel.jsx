import Icon from '../common/Icon';
import { CLUES } from '../../lib/scoring';

const reveal = {
  region: (l) => l.region,
  language: (l) => l.language,
  flag: (l) => l.flag,
};

export default function CluePanel({ location, used, onReveal }) {
  return (
    <section className="card clues">
      <div className="clues__title">
        <strong>Clues</strong>
        <span className="muted small">· each clue lowers this round's max score</span>
      </div>
      <div className="clues__grid">
        {CLUES.map((clue) => {
          const open = used.includes(clue.id);
          return (
            <button
              key={clue.id}
              type="button"
              className={`clue ${open ? 'is-open' : ''}`}
              onClick={() => onReveal(clue.id)}
              aria-expanded={open}
            >
              <div className="row row--between">
                <strong><span className="clue__icon"><Icon name={clue.id === 'region' ? 'globe' : clue.id === 'language' ? 'layers' : 'pin'} /></span> {clue.label}</strong>
                <span>⌄</span>
              </div>
              <div className={open ? 'clue__value' : 'muted small'}>
                {open ? `Revealed: ${reveal[clue.id](location)}` : 'Click to reveal'}
              </div>
              <span className="pill">−{clue.penalty} pts{open ? ' · applied' : ''}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
