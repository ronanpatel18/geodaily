import { useMemo, useState } from 'react';
import WorldMap from '../common/WorldMap';
import IconButton from '../common/IconButton';
import { formatCoord } from '../../lib/format';

export default function GuessMap({ guess, onGuess, onSubmit, disabled }) {
  const [expanded, setExpanded] = useState(false);
  const markers = useMemo(() => (guess ? [{ id: 'g', ...guess, kind: 'pin', label: 'Your pin' }] : []), [guess]);
  return (
    <aside className={`card guess ${expanded ? 'is-expanded' : ''}`}>
      <div className="row row--between">
        <strong>📍 Your Guess</strong>
        <IconButton label={expanded ? 'Collapse map' : 'Expand map'} onClick={() => setExpanded((e) => !e)}>
          {expanded ? '✕' : '⤢'}
        </IconButton>
      </div>
      <div className="guess__map">
        <WorldMap
          onPick={disabled ? undefined : onGuess}
          markers={markers}
        />
        {!guess && <span className="hint-chip guess__hint">🌐 Click the globe to drop a pin</span>}
      </div>
      <div className="muted small guess__coords">{guess ? `Pin placed · ${formatCoord(guess)}` : 'No pin placed yet'}</div>
      <button type="button" className="btn btn--primary btn--block" disabled={!guess || disabled} onClick={onSubmit}>
        Submit Guess
      </button>
    </aside>
  );
}
