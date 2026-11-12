import { useState } from 'react';
import Brand from '../common/Brand';
import IconButton from '../common/IconButton';
import { formatClockPadded, formatNumber } from '../../lib/format';
import { ROUNDS_PER_GAME } from '../../lib/scoring';

export default function GameHeader({ roundIndex, secondsLeft, waiting, potential, totalSoFar, quitLabel = 'Quit to home', onQuit }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="app-header game-header">
      <Brand withIcon={false} />
      <div className="game-header__progress">
        <strong>Location {roundIndex + 1} of {ROUNDS_PER_GAME}</strong>
        <div className="dots">
          {Array.from({ length: ROUNDS_PER_GAME }, (_, i) => (
            <span key={i} className={`dot ${i < roundIndex ? 'is-done' : i === roundIndex ? 'is-current' : ''}`} />
          ))}
        </div>
      </div>
      <div className="game-header__spacer" />
      {secondsLeft == null ? (
        <span className="pill">Relaxed · No timer</span>
      ) : (
        <div className={`timer ${secondsLeft <= 15 ? 'is-low' : ''}`}>
          ⏱ <strong>{formatClockPadded(secondsLeft)}</strong> <span className="muted small">{waiting ? 'loading…' : 'left'}</span>
        </div>
      )}
      <div className="score-box">
        <span className="eyebrow">Round potential</span>
        <strong>{formatNumber(potential)} pts</strong>
      </div>
      <div className="score-box">
        <span className="eyebrow">Total so far</span>
        <strong>{formatNumber(totalSoFar)} pts</strong>
      </div>
      <div className="dropdown">
        <IconButton label="Menu" onClick={() => setMenu((m) => !m)}>☰</IconButton>
        {menu && (
          <div className="dropdown__panel card">
            <button type="button" className="menu-item" onClick={onQuit}>{quitLabel}</button>
          </div>
        )}
      </div>
    </header>
  );
}
