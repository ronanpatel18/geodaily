import Icon from '../common/Icon';
import Brand from '../common/Brand';
import { formatClockPadded, formatNumber } from '../../lib/format';
import { ROUNDS_PER_GAME } from '../../lib/scoring';

export default function GameHeader({ roundIndex, secondsLeft, waiting, potential, totalSoFar, quitLabel = 'Quit to home', onQuit }) {
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
          <Icon name="clock" /> <strong>{formatClockPadded(secondsLeft)}</strong> <span className="muted small">{waiting ? 'loading…' : 'left'}</span>
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
      <button type="button" className="btn btn--outline game-back-btn" onClick={onQuit} title={quitLabel}>
        <Icon name="back" />
        <span>Back to Home</span>
      </button>
    </header>
  );
}
