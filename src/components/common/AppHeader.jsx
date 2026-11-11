import Brand from './Brand';
import IconButton from './IconButton';
import SettingsDropdown from './SettingsDropdown';

/** variant: 'home' | 'summary' | 'stats' — mirrors the three header layouts in the wireframes. */
export default function AppHeader({ variant, onNavigate, onPractice }) {
  if (variant === 'stats') {
    return (
      <header className="app-header app-header--stats">
        <button type="button" className="back-btn" onClick={() => onNavigate('home')}>
          <span className="icon-btn icon-btn--sm">←</span> Back to Home
        </button>
        <Brand />
        <span />
      </header>
    );
  }
  return (
    <header className="app-header">
      <Brand />
      <div className="app-header__actions">
        {variant === 'home' ? (
          <>
            <button type="button" className="btn btn--outline" onClick={onPractice}>Practice Mode</button>
            <IconButton label="Stats" onClick={() => onNavigate('stats')}>▥</IconButton>
            <SettingsDropdown />
          </>
        ) : (
          <>
            <IconButton label="Home" onClick={() => onNavigate('home')}>⌂</IconButton>
            <IconButton label="Stats" onClick={() => onNavigate('stats')}>▥</IconButton>
          </>
        )}
      </div>
    </header>
  );
}
