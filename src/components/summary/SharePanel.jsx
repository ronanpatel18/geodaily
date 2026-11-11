import { useState } from 'react';
import IconButton from '../common/IconButton';

export default function SharePanel({ text }) {
  const [status, setStatus] = useState('');

  const flash = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 2000); };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash('Copied to clipboard!');
    } catch {
      flash('Copy failed — select the preview text manually.');
    }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch { /* user cancelled; fall back to copy */ }
    }
    copy();
  };

  const [title, grid, meta, link] = text.split('\n');
  return (
    <section className="card share">
      <div>
        <h3>⇪ Share your result</h3>
        <p className="muted">Spoiler-free: the grid shows accuracy only, never the locations.</p>
        <div className="muted small legend">
          <span><i className="sq sq--green" /> under 250 km</span>
          <span><i className="sq sq--yellow" /> 250–1,000 km</span>
          <span><i className="sq sq--red" /> over 1,000 km</span>
        </div>
        <div className="row">
          <button type="button" className="btn btn--primary" onClick={share}>Share Results</button>
          <IconButton label="Copy to clipboard" onClick={copy}>⧉</IconButton>
          {status && <span className="muted small" role="status">{status}</span>}
        </div>
      </div>
      <div className="placeholder share__preview">
        <div className="eyebrow">Preview — copied text</div>
        <strong>{title}</strong>
        <div className="share__grid">{grid}</div>
        <div className="small">{meta}</div>
        <div className="muted small">{link}</div>
      </div>
    </section>
  );
}
