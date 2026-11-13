import Icon from './Icon';
import Brand from './Brand';
import IconButton from './IconButton';
import SettingsDropdown from './SettingsDropdown';
export default function AppHeader({ variant, onNavigate, onPractice }) {
  return <header className={`app-header ${variant === 'stats' ? 'app-header--stats' : ''}`}><Brand /><nav className="header-nav" aria-label="Main navigation"><button type="button" className={`nav-link ${variant === 'home' ? 'is-active' : ''}`} onClick={() => onNavigate('home')}>Daily</button>{onPractice && <button type="button" className="nav-link" onClick={onPractice}>Practice</button>}<button type="button" className={`nav-link ${variant === 'stats' ? 'is-active' : ''}`} onClick={() => onNavigate('stats')}>Stats</button></nav><div className="app-header__actions">{variant !== 'home' && <IconButton label="Home" onClick={() => onNavigate('home')}><Icon name="home" /></IconButton>}<SettingsDropdown /></div></header>;
}
