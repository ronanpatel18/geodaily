import Icon from '../common/Icon';
import { useEffect, useRef, useState } from 'react';
import IconButton from '../common/IconButton';
import { hasStreetView, loadGoogleMaps } from '../../lib/streetview';

/** Real Google Street View panorama. Labels, address and walking links are disabled to avoid giving the answer away. */
function PanoramaView({ panoId, onError, onReady }) {
  const containerRef = useRef(null);
  const panoRef = useRef(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
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
        // Fires for the first panorama and again after every setPano (next round).
        panoRef.current.addListener('status_changed', () => {
          const status = panoRef.current?.getStatus();
          if (status === 'OK') onReadyRef.current?.();
          else if (status) onErrorRef.current?.(`Panorama unavailable (${status})`);
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
      <div className="hint-chip">Scroll to zoom · Drag to look around</div>
    </>
  );
}

/** Fallback when there's no API key, no coverage, or the API failed. */
function PlaceholderView({ location, roundNumber, reason, onReady }) {
  // Nothing to load: the round can start straight away.
  useEffect(() => { onReady?.(); }, [location.id, onReady]);
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
        <div className="streetview__icon"><Icon name="globe" /></div>
        Street View is unavailable
        <div className="muted small">Round {roundNumber} · {reason}</div>
      </div>
      <div className="streetview__controls">
        <IconButton label="Zoom in" onClick={() => setZoom((z) => clampZoom(z + 0.25))}>+</IconButton>
        <IconButton label="Zoom out" onClick={() => setZoom((z) => clampZoom(z - 0.25))}>−</IconButton>
        <IconButton label="Reset view" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>◎</IconButton>
      </div>
      <div className="hint-chip">Scroll to zoom · Drag to pan</div>
    </div>
  );
}

export default function StreetViewPanel({ location, roundNumber, onReady }) {
  const [error, setError] = useState(null);
  // A failed panorama only affects its own round.
  useEffect(() => { setError(null); }, [location.id]);
  const usable = hasStreetView && location.panoId && !error;

  let reason = 'no Street View coverage found for this location';
  if (!hasStreetView) reason = 'Street View has not been configured for this copy';
  else if (error) reason = error;

  return (
    <section className="placeholder streetview">
      {usable ? (
        <PanoramaView panoId={location.panoId} onError={setError} onReady={onReady} />
      ) : (
        <PlaceholderView location={location} roundNumber={roundNumber} reason={reason} onReady={onReady} />
      )}
    </section>
  );
}
