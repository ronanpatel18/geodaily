export default function Brand({ withIcon = true }) {
  return (
    <div className="brand">
      {withIcon && <span className="brand__icon">◍</span>}
      <span className="brand__name">GeoDaily</span>
    </div>
  );
}
