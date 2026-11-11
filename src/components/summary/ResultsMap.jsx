import { useMemo } from 'react';
import WorldMap from '../common/WorldMap';

export default function ResultsMap({ rounds, highlighted, onHighlight }) {
  const { markers, lines } = useMemo(() => {
    const markers = [];
    const lines = [];
    rounds.forEach((r, i) => {
      const dim = highlighted != null && highlighted !== i;
      if (r.hasGuess) {
        lines.push({ from: r.location, to: r.guess, active: !dim });
        markers.push({ id: `g${i}`, ...r.guess, kind: 'guess', dim });
      }
      markers.push({
        id: `a${i}`, ...r.location, kind: 'actual', num: i + 1, dim, active: highlighted === i,
        onClick: () => onHighlight(highlighted === i ? null : i),
        onHover: (on) => onHighlight(on ? i : null),
      });
    });
    return { markers, lines };
  }, [rounds, highlighted, onHighlight]);

  return (
    <section className="card">
      <div className="row row--between">
        <h3>Your guesses vs. actual locations</h3>
        <div className="legend">
          <span><i className="legend__dot legend__dot--actual" /> Actual</span>
          <span><i className="legend__dot legend__dot--guess" /> Your guess</span>
          <span><i className="legend__dash" /> Distance</span>
        </div>
      </div>
      <div className="results-map">
        <WorldMap markers={markers} lines={lines} fit />
      </div>
      <p className="muted small">Hover or click a numbered pin to highlight that round. Drag to spin, scroll to zoom.</p>
    </section>
  );
}
