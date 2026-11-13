import Icon from './Icon';
export default function Brand({ withIcon = true }) {
  return <div className="brand">{withIcon && <span className="brand__icon"><Icon name="globe" /></span>}<span className="brand__name">geo<span>daily</span><span className="brand__dot">.</span></span></div>;
}
