import Icon from './Icon';
export default function IconButton({ label, children, ...rest }) {
  return (
    <button type="button" className="icon-btn" aria-label={label} title={label} {...rest}>
      {typeof children === 'string' ? <Icon name={({ 'Zoom in': 'plus', 'Zoom out': 'minus', 'Reset view': 'compass', Menu: 'menu', Stats: 'chart', Home: 'home', Settings: 'settings', 'Expand map': 'expand', 'Close map': 'close' })[label] || 'expand'} /> : children}
    </button>
  );
}
