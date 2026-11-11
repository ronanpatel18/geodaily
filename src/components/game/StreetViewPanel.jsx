import { useEffect, useRef, useState } from 'react';
import IconButton from '../common/IconButton';
import { hasStreetView, loadGoogleMaps } from '../../lib/streetview';

/** Real Google Street View panorama. Labels, address and walking links are disabled to avoid giving the answer away. */
function PanoramaView({ panoId, onError }) {
  const containerRef = useRef(null);
  const panoRef = useRef(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const initial = useRef(panoId);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(async (maps) => {
        const { StreetViewPanorama } = await maps.importLibrary('streetView');
        if (cancelled) return;
        panoRef.current = new StreetViewPanorama(containerRef.current, {
          pano: initial.current,
          addressControl: false,
          showRoadLabels: false,
          linksControl: false,
          clickToGo: false,
          fullscreenControl: false,
          enableCloseButton: false,
          panControl: false,
          zoomControl: false,
          motionTracking: false,
          motionTrackingControl: false,
          scrollwheel: true,
          visible: true,
        });
      })
      .catch((e) => onErrorRef.current?.(e.message));
    return () => { cancelled = true; panoRef.current = null; };
  }, []);

  // Next round: swap the panorama in place.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    panoRef.current?.setPano(panoId);
    panoRef.current?.setPov({ heading: 0, pitch: 0 });
    panoRef.current?.setZoom(1);
  }, [panoId]);

  const zoomBy = (d) => {
    const p = panoRef.current;
    if (p) p.setZoom(Math.max(0, Math.min(5, p.getZoom() + d)));
  };

  return (
    <>
      <div ref={containerRef} className="streetview__viewer" />
      <div className="streetview__controls">
        <IconButton label="Zoom in" onClick={() => zoomBy(0.5)}>+</IconButton>
        <IconButton label="Zoom out" onClick={() => zoomBy(-0.5)}>−</IconButton>
        <IconButton label="Reset view" onClick={() => { panoRef.current?.setPov({ heading: 0, pitch: 0 }); panoRef.current?.setZoom(1); }}>◎</IconButton>
      </div>
      <div className="hint-chip">🔍 Scroll to zoom · Drag to look around</div>
    </>
  );
}

/** Fallback when there's no API key, no coverage, or the API failed. */
function PlaceholderView({ location, roundNumber, reason }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(null);
  const clampZoom = (z) => Math.min(2.5, Math.max(1, z));

  return (
    <div
      className="streetview__placeholder"
      onWheel={(e) => setZoom((z) => clampZoom(z - Math.sign(e.deltaY) * 0.1))}
      onPointerDown={(e) => setDrag({ x: e.clientX, y: e.clientY, start: pan })}
      onPointerMove={(e) => drag && setPan({ x: drag.start.x + (e.clientX - drag.x), y: drag.start.y + (e.clientY - drag.y) })}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <div
        className="streetview__scene"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        data-location={location.id}
      >
        <div className="streetview__horizon" />
        <div className="streetview__road" />
      </div>
      <div className="placeholder__label streetview__label">
        <div className="streetview__icon">🖼</div>
        Street View / Location Photo (360° pan)
        <div className="muted small">Round {roundNumber} · {reason}</div>
      </div>
      <div className="streetview__controls">
        <IconButton label="Zoom in" onClick={() => setZoom((z) => clampZoom(z + 0.25))}>+</IconButton>
        <IconButton label="Zoom out" onClick={() => setZoom((z) => clampZoom(z - 0.25))}>−</IconButton>
        <IconButton label="Reset view" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>◎</IconButton>
      </div>
      <div className="hint-chip">🔍 Scroll to zoom · Drag to pan</div>
    </div>
  );
}

export default function StreetViewPanel({ location, roundNumber }) {
  const [error, setError] = useState(null);
  const usable = hasStreetView && location.panoId && !error;

  let reason = 'no Street View coverage found for this location';
  if (!hasStreetView) reason = 'set VITE_GOOGLE_MAPS_API_KEY in .env.local to load Street View';
  else if (error) reason = error;

  return (
    <section className="placeholder streetview">
      {usable ? (
        <PanoramaView panoId={location.panoId} onError={setError} />
      ) : (
        <PlaceholderView location={location} roundNumber={roundNumber} reason={reason} />
      )}
    </section>
  );
}
